import { resolveCollisions } from "./collisions.js";

class World {
  constructor({
    bounds = { left: -40, right: 25, bottom: -20, top: 20 },
    integrator
  } = {}) {
    this.bodies = [];
    this.forces = [];
    this.integrator = integrator;
    this.bounds = bounds;
    this.time = 0;
  }

  addBody(body) {
    this.bodies.push(body);
    return body;
  }

  addForce(force) {
    this.forces.push(force);
    return force;
  }

  step(dt) {
    // 1. Clear accumulated forces.
    for (const body of this.bodies) {
      body.clearForce();
    }

    // 2. Apply all forces.
    for (const force of this.forces) {
      force.apply(this);
    }

    // 3. Integrate motion.
    this.integrator.step(this, dt);

    // 4. Resolve collisions.
    resolveCollisions(this);

    // 5. Advance simulation time.
    this.time += dt;
  }
}

export { World };