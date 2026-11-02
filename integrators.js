class EulerCromer {
  step(world, dt) {
    for (const body of world.bodies) {
      if (body.isStatic) continue;

      const acceleration = body.force.mul(body.invMass);

      body.vel.addScaled(acceleration, dt);
      body.pos.addScaled(body.vel, dt);
      body.acc = acceleration.clone();
    }
  }
}

class VelocityVerlet {
  step(world, dt) {
    const oldAccelerations = new Map();

    // 1. Calculate current accelerations and update positions.
    for (const body of world.bodies) {
      if (body.isStatic) continue;

      const oldAcc = body.force.mul(body.invMass);
      oldAccelerations.set(body, oldAcc);

      body.pos.addScaled(body.vel, dt);
      body.pos.addScaled(oldAcc, 0.5 * dt * dt);
    }

    // 2. Recalculate forces at the new positions.
    for (const body of world.bodies) {
      body.clearForce();
    }

    for (const force of world.forces) {
      force.apply(world);
    }

    // 3. Update velocities using both accelerations.
    for (const body of world.bodies) {
      if (body.isStatic) continue;

      const oldAcc = oldAccelerations.get(body);
      const newAcc = body.force.mul(body.invMass);

      body.vel.addScaled(oldAcc.add(newAcc), 0.5 * dt);
      body.acc = newAcc.clone();
    }
  }
}

export { EulerCromer, VelocityVerlet };