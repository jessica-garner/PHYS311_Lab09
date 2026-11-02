# PHYS 311 Lab 9 — Multi-Body Browser Simulation

1. Overview
This project makes a browser-based multi-body physics simulation using JavaScript modules.

2. How to Run
1. Open a terminal in your designated folder for this lab.
2. Run `python -m http.server 8000`.
3. Open `http://localhost:8000` in a browser.

3. Scenes

- Billiards / Ball Pit: 20 moving balls with wall and circle-circle collisions. The bounciness slider changes the coefficient of restitution. You can change the number of bodies in main.js, at const numberofBodies. This number should initially be set to 20.


- Gravitational N-Body:Three bodies interact through softened Newtonian gravity.
- Student Choice: A spring-connected body system under gravity.



4. Controls
- Choose scene: Switches between the three simulation scenes.
- Integrator: Switches between Euler-Cromer and Velocity Verlet.
- Bounciness: Adjusts the coefficient of restitution for collisions.

5. Code Organization
- `engine/vec2.js` — vector operations.
- `engine/body.js` — Body properties, mass, position, velocity, and KE
- `engine/forces.js` — Gravity, drag, spring, and Newton gravity.
- `engine/integrators.js` — Euler-Cromer and Velocity Verlet integration.
- `engine/collisions.js` — Wall and circle collision handling.
- `engine/world.js` — Simulation state and physics update sequence.
- `render/camera.js` — Convert world coordinates to screen coordinates.
- `render/renderer.js` — Draws the simulation.
- `render/hud.js` — Displays E, p, t, FPS, and timing information.
- `main.js` — Creates scenes, connects controls, and runs the animation loop.

6. Physics Update Sequence
Each world update has five stages:
1. Clear accumulated forces.
2. Apply forces.
3. Integrate motion.
4. Resolve collisions.
5. Advance simulation time.

