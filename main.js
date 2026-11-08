import { Vec2 } from "./engine/vec2.js";
import { Body } from "./engine/body.js";
import { Gravity, Spring, NewtonGravity } from "./engine/forces.js";
import { EulerCromer, VelocityVerlet } from "./engine/integrators.js";
import { World } from "./engine/world.js";

import { Camera } from "./render/camera.js";
import { Renderer } from "./render/renderer.js";
import { HUD } from "./render/hud.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const camera = new Camera(canvas, 20);
const renderer = new Renderer(canvas, camera);
const hud = new HUD();



// Mouse interaction
let selectedBody = null;
let isDragging = false;

canvas.addEventListener("mousedown", (event) => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const mouse = camera.toWorld(mouseX, mouseY);

  selectedBody = null;

  // Find the body closest to the mouse.
  for (const body of world.bodies) {
    const dx = body.pos.x - mouse.x;
    const dy = body.pos.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= body.radius) {
      selectedBody = body;
      isDragging = true;
      break;
    }
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDragging || !selectedBody) return;

  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const mouse = camera.toWorld(mouseX, mouseY);

  selectedBody.pos.x = mouse.x;
  selectedBody.pos.y = mouse.y;

  selectedBody.vel.x = 0;
  selectedBody.vel.y = 0;
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  selectedBody = null;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
  selectedBody = null;
});

let integrator = new EulerCromer();

function createScene(name) {
  const world = new World({
    bounds: {
      left: -24,
      right: 24,
      bottom: -16,
      top: 16
    },
    integrator
  });

  if (name === "billiards") {
    // 20 balls arranged in a grid without initial overlap.
    
        const numberOfBodies = 20;
        const columns = Math.ceil(Math.sqrt(numberOfBodies));
        const rows = Math.ceil(numberOfBodies / columns);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                if (row * columns + col >= numberOfBodies) break;




        world.addBody(new Body({
          pos: new Vec2(-8 + col * 2, -3 + row * 2),
          vel: new Vec2(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
          ),
          mass: 1,
          radius: 0.5,
          restitution: 1
        }));
      }
    }
  }

  else if (name === "gravity") {
    world.addForce(new NewtonGravity(1, 0.5));

    world.addBody(new Body({
      pos: new Vec2(-5, 0),
      vel: new Vec2(0, 1),
      mass: 10,
      radius: 0.5
    }));

    world.addBody(new Body({
      pos: new Vec2(5, 0),
      vel: new Vec2(0, -1),
      mass: 10,
      radius: 0.5
    }));

    world.addBody(new Body({
      pos: new Vec2(0, 7),
      vel: new Vec2(-1, 0),
      mass: 5,
      radius: 0.4
    }));
  }

  else if (name === "custom") {
    const anchor = world.addBody(new Body({
      pos: new Vec2(0, 7),
      mass: 1,
      radius: 0.5,
      isStatic: true
    }));

    const bob = world.addBody(new Body({
      pos: new Vec2(4, 3),
      vel: new Vec2(0, 0),
      mass: 1,
      radius: 0.6
    }));

    world.addForce(new Gravity(new Vec2(0, -9.81)));
    world.addForce(new Spring(anchor, bob, 8, 5));
  }

  return world;
}

// Start with the billiards scene.
let world = createScene("billiards");
hud.resetEnergy(world);

// Scene dropdown.
const sceneSelect = document.getElementById("sceneSelect");

sceneSelect.addEventListener("change", () => {
  world = createScene(sceneSelect.value);

  const value = Number(restitutionSlider.value);
  for (const body of world.bodies) {
    body.restitution = value;
  }

  hud.resetEnergy(world);
});



// Bounciness slide
const restitutionSlider = document.getElementById("restitution");
const restitutionValue = document.getElementById("restitutionValue");

restitutionSlider.addEventListener("input", () => {
  const value = Number(restitutionSlider.value);

  restitutionValue.textContent = value.toFixed(1);

  for (const body of world.bodies) {
    body.restitution = value;
  }
});

const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

speedSlider.addEventListener("input", () => {
  speed = Number(speedSlider.value);
  speedValue.textContent = speed.toFixed(2) + "x";
});


const integratorSelect = document.getElementById("integratorSelect");



integratorSelect.addEventListener("change", () => {
  integrator = integratorSelect.value === "euler"
    ? new EulerCromer()
    : new VelocityVerlet();

  world.integrator = integrator;
});




// Pause / Resume
const pauseButton = document.getElementById("pauseButton");

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
});


// Step
const stepButton = document.getElementById("stepButton");

stepButton.addEventListener("click", () => {
  paused = true;
  stepOnce = true;
  accumulator = 0;
  pauseButton.textContent = "Resume";
});


// Reset
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
  world = createScene(sceneSelect.value);

  for (const body of world.bodies) {
    body.restitution = Number(restitutionSlider.value);
  }

  accumulator = 0;
  stepOnce = false;
  hud.resetEnergy(world);
});


// Speed
const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

speedSlider.addEventListener("input", () => {
  speed = Number(speedSlider.value);
  speedValue.textContent = speed.toFixed(2) + "x";
});







// Animation loop.
let previousTime = 0;
let accumulator = 0;

let paused = false;
let stepOnce = false;
let speed = 1;

const pauseButton = document.getElementById("pauseButton");
const stepButton = document.getElementById("stepButton");
const resetButton = document.getElementById("resetButton");

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
});

stepButton.addEventListener("click", () => {
  if (paused) {
    stepOnce = true;
  }
});

resetButton.addEventListener("click", () => {
  world = createScene(sceneSelect.value);
  accumulator = 0;
  hud.resetEnergy(world);
});

const fixedDt = 1 / 120;
const maxFrameTime = 0.05;

let fps = 0;
let frameCount = 0;
let fpsTimer = 0;


function animate(timestamp) {
  if (previousTime === 0) previousTime = timestamp;

  let frameTime = (timestamp - previousTime) / 1000;
  previousTime = timestamp;

  frameTime = Math.min(frameTime, maxFrameTime);

  const physicsStart = performance.now();

 /* idk if I want to keep this yet
 
    if (!paused) {
    accumulator += frameTime * speed;
  }

  if (paused && stepOnce) {
    world.step(fixedDt);
    stepOnce = false;
  } else if (!paused) {
    while (accumulator >= fixedDt) {
      world.step(fixedDt);
      accumulator -= fixedDt;
    }
  }

  const physicsMs = performance.now() - physicsStart;*/

const physicsStart = performance.now();

if (!paused) {
  accumulator += frameTime * speed;
}

if (paused && stepOnce) {
  world.step(fixedDt);
  stepOnce = false;
} else if (!paused) {
  while (accumulator >= fixedDt) {
    world.step(fixedDt);
    accumulator -= fixedDt;
  }
}

const physicsMs = performance.now() - physicsStart;


  frameCount++;
  fpsTimer += frameTime;

  if (fpsTimer >= 1) {
    fps = frameCount / fpsTimer;
    frameCount = 0;
    fpsTimer = 0;
  }

  const renderStart = performance.now();

  renderer.render(world);

  hud.render(ctx, world, {
    fps,
    physicsMs,
    renderMs: performance.now() - renderStart
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);







