import { Vec2 } from "./vec2.js";

class Gravity {
  constructor(g = new Vec2(0, -9.81)) {
    this.g = g.clone();
  }

  apply(world) {
    for (const body of world.bodies) {
      if (body.isStatic) continue;

      body.force.addTo(this.g.mul(body.mass));
    }
  }

  potentialEnergy(world) {
    let energy = 0;

    for (const body of world.bodies) {
      if (body.isStatic) continue;

      energy -= body.mass * this.g.y * body.pos.y;
    }

    return energy;
  }
}

class Drag {
  constructor(coefficient = 0.1) {
    this.coefficient = coefficient;
  }

  apply(world) {
    for (const body of world.bodies) {
      if (body.isStatic) continue;

      body.force.addTo(body.vel.mul(-this.coefficient));
    }
  }
}

class Spring {
  constructor(bodyA, bodyB, stiffness = 10, restLength = 1) {
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.stiffness = stiffness;
    this.restLength = restLength;
  }

  apply(world) {
    const difference = this.bodyB.pos.sub(this.bodyA.pos);
    const distance = difference.length();

    if (distance === 0) return;

    const direction = difference.mul(1 / distance);
    const force = direction.mul(
      this.stiffness * (distance - this.restLength)
    );

    if (!this.bodyA.isStatic) {
      this.bodyA.force.addTo(force);
    }

    if (!this.bodyB.isStatic) {
      this.bodyB.force.addTo(force.mul(-1));
    }
  }

  potentialEnergy(world) {
    const distance = this.bodyB.pos.sub(this.bodyA.pos).length();
    const stretch = distance - this.restLength;

    return 0.5 * this.stiffness * stretch * stretch;
  }
}

class NewtonGravity {
  constructor(G = 1, softening = 0.2) {
    this.G = G;
    this.softening = softening;
  }

  apply(world) {
    const bodies = world.bodies;

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];

        const difference = b.pos.sub(a.pos);
        const distanceSq = difference.lengthSq()
          + this.softening * this.softening;

        const denominator = Math.pow(distanceSq, 1.5);

        const force = difference.mul(
          this.G * a.mass * b.mass / denominator
        );

        if (!a.isStatic) a.force.addTo(force);
        if (!b.isStatic) b.force.addTo(force.mul(-1));
      }
    }
  }

  potentialEnergy(world) {
    let energy = 0;
    const bodies = world.bodies;

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const difference = bodies[j].pos.sub(bodies[i].pos);

        const distance = Math.sqrt(
          difference.lengthSq() + this.softening * this.softening
        );

        energy -= this.G * bodies[i].mass * bodies[j].mass / distance;
      }
    }

    return energy;
  }
}

export { Gravity, Drag, Spring, NewtonGravity };
