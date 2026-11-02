class Renderer {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.camera = camera;
  }

  render(world) {
    const ctx = this.ctx;
    const canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the world boundaries.
    const bottomLeft = this.camera.toScreen({
      x: world.bounds.left,
      y: world.bounds.bottom
    });

    const topRight = this.camera.toScreen({
      x: world.bounds.right,
      y: world.bounds.top
    });

    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      bottomLeft.x,
      topRight.y,
      topRight.x - bottomLeft.x,
      bottomLeft.y - topRight.y
    );

    // Draw each body.
    for (const body of world.bodies) {
      const p = this.camera.toScreen(body.pos);

      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        body.radius * this.camera.scale,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = body.isStatic ? "#777777" : "#4169e1";
      ctx.fill();

      ctx.strokeStyle = "#222222";
      ctx.stroke();
    }
  }
}

export { Renderer };