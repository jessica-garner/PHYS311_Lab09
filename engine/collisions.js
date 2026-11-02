function resolveWallCollisions(world) {
  const { left, right, bottom, top } = world.bounds;

  for (const body of world.bodies) {
    if (body.isStatic) continue;

    const r = body.radius;
    const e = body.restitution;

    if (body.pos.x - r < left) {
      body.pos.x = left + r;
      if (body.vel.x < 0) body.vel.x *= -e;
    }

    if (body.pos.x + r > right) {
      body.pos.x = right - r;
      if (body.vel.x > 0) body.vel.x *= -e;
    }

    if (body.pos.y - r < bottom) {
      body.pos.y = bottom + r;
      if (body.vel.y < 0) body.vel.y *= -e;
    }

    if (body.pos.y + r > top) {
      body.pos.y = top - r;
      if (body.vel.y > 0) body.vel.y *= -e;
    }
  }
}

function resolveCircleCollisions(world) {
  const bodies = world.bodies;

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];

      const difference = b.pos.sub(a.pos);
      const distance = difference.length();
      const minDistance = a.radius + b.radius;

      if (distance >= minDistance || distance === 0) continue;

      const normal = difference.mul(1 / distance);
      const overlap = minDistance - distance;

      const invA = a.invMass;
      const invB = b.invMass;
      const invTotal = invA + invB;

      if (invTotal === 0) continue;

      // Positional correction weighted by inverse mass.
      const correction = normal.mul(overlap / invTotal);
      a.pos.addTo(correction.mul(-invA));
      b.pos.addTo(correction.mul(invB));

      // Relative velocity along the collision normal.
      const relativeVelocity = b.vel.sub(a.vel);
      const vn = relativeVelocity.dot(normal);

      // Ignore bodies that are already separating.
      if (vn > 0) continue;

      const e = Math.min(a.restitution, b.restitution);
      const impulseMagnitude = -(1 + e) * vn / invTotal;
      const impulse = normal.mul(impulseMagnitude);

      a.vel.addTo(impulse.mul(-invA));
      b.vel.addTo(impulse.mul(invB));
    }
  }
}

function resolveCollisions(world) {
  resolveWallCollisions(world);
  resolveCircleCollisions(world);
}

export { resolveCollisions };
