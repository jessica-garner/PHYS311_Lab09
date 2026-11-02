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




const integratorSelect = document.getElementById("integratorSelect");



integratorSelect.addEventListener("change", () => {
  integrator = integratorSelect.value === "euler"
    ? new EulerCromer()
    : new VelocityVerlet();

  world.integrator = integrator;
});

// Animation loop.
let previousTime = 0;
let accumulator = 0;

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
  accumulator += frameTime;

  const physicsStart = performance.now();

  while (accumulator >= fixedDt) {
    world.step(fixedDt);
    accumulator -= fixedDt;
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