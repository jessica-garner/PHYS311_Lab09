class HUD {
  constructor() {
    this.energyStart = null;
  }

  calculateEnergy(world) {
    let energy = 0;

    // Kinetic energy
    for (const body of world.bodies) {
      energy += body.kineticEnergy();
    }

    // Potential energy from conservative forces
    for (const force of world.forces) {
      if (typeof force.potentialEnergy === "function") {
        energy += force.potentialEnergy(world);
      }
    }

    return energy;
  }

  calculateMomentum(world) {
    let px = 0;
    let py = 0;

    for (const body of world.bodies) {
      if (body.isStatic) continue;

      px += body.mass * body.vel.x;
      py += body.mass * body.vel.y;
    }

    return Math.sqrt(px * px + py * py);
  }

  render(ctx, world, stats = {}) {
    const energy = this.calculateEnergy(world);
    const momentum = this.calculateMomentum(world);

    if (this.energyStart === null) {
      this.energyStart = energy;
    }

    const drift = Math.abs(this.energyStart) > 1e-12
      ? ((energy - this.energyStart) / Math.abs(this.energyStart)) * 100
      : 0;

    const lines = [
      `Time: ${world.time.toFixed(2)} s`,
      `Bodies: ${world.bodies.length}`,
      `Total energy: ${energy.toFixed(4)} J`,
      `Energy drift: ${drift.toFixed(3)}%`,
      `|Momentum|: ${momentum.toFixed(4)}`,
      `FPS: ${(stats.fps || 0).toFixed(1)}`,
      `Physics: ${(stats.physicsMs || 0).toFixed(2)} ms`,
      `Render: ${(stats.renderMs || 0).toFixed(2)} ms`
    ];

    ctx.save();
    ctx.font = "14px Arial";
    ctx.fillStyle = Math.abs(drift) > 1 ? "red" : "black";

    let y = 24;

    for (const line of lines) {
      ctx.fillText(line, 15, y);
      y += 20;
    }

    ctx.restore();
  }

  resetEnergy(world) {
    this.energyStart = this.calculateEnergy(world);
  }
}

export { HUD };