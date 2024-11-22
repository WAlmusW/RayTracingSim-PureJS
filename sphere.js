// A class representing a sphere in 3D space
class Sphere {
  constructor(center, radius, color, roughness) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.roughness = roughness;
  }

  // Checks if a ray intersects with the sphere
  intersect(ray) {
    const originToCenter = ray.origin.subtract(this.center); // Vector from ray origin to sphere center
    const a = ray.direction.dotProduct(ray.direction);
    const b = 2.0 * originToCenter.dotProduct(ray.direction);
    const c =
      originToCenter.dotProduct(originToCenter) - this.radius * this.radius; // Equation for a sphere
    const discriminant = b * b - 4 * a * c; // Determines if the ray hits the sphere

    if (discriminant < 0) {
      return null; // No intersection
    } else {
      const t = (-b - Math.sqrt(discriminant)) / (2.0 * a); // Calculate the distance to the intersection
      if (t > 0) {
        // Intersection point and normal vector
        const intersectionPoint = ray.origin.add(ray.direction.multiply(t));
        const normalVector = intersectionPoint
          .subtract(this.center)
          .normalize();
        return { t, point: intersectionPoint, normal: normalVector }; // Return intersection details
      }
    }
    return null; // No intersection
  }
}
