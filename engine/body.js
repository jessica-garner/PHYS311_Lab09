import { Vec2 } from "./vec2.js";

let nextId = 0;

class Body {
  constructor({
    pos = new Vec2(),
    vel = new Vec2(),
    mass = 1,
    radius = 0.15,
    isStatic = false,
    restitution = 1
  } = {}) {
    this.id = nextId++;

    this.pos = pos.clone();
    this.vel = vel.clone();
    this.acc = new Vec2(0, 0);
    this.force = new Vec2(0, 0);

    this.mass = mass;
    this.radius = radius;
    this.isStatic = isStatic;
    this.restitution = restitution;
  }

  get invMass() {
    return this.isStatic ? 0 : 1 / this.mass;
  }

  clearForce() {
    this.force = new Vec2(0, 0);
  }

  kineticEnergy() {
    return this.isStatic ? 0 : 0.5 * this.mass * this.vel.lengthSq();
  }
}

export { Body };
