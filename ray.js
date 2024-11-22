class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction.normalize(); // Direction of the ray, normalized
  }
}
