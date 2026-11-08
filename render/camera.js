class Camera {
  constructor(canvas, scale = 20) {
    this.canvas = canvas;
    this.scale = scale;
  }

  toScreen(position) {
    return {
      x: this.canvas.width / 2 + position.x * this.scale,
      y: this.canvas.height / 2 - position.y * this.scale
    };
  }

  toWorld(screenX, screenY) {
    return {
      x: (screenX - this.canvas.width / 2) / this.scale,
      y: (this.canvas.height / 2 - screenY) / this.scale
    };
  }
}

export { Camera };