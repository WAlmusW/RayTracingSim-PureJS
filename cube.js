// A class representing an axis-aligned cube in 3D space
class Cube {
  constructor(center, size, color, roughness) {
    this.center = center;
    this.size = size;
    this.color = color;
    this.roughness = roughness;
  }

  // Checks if a ray intersects with the cube
  intersect(ray) {
    // Calculate the half-size (distance from center to any face)
    const halfSize = this.size / 2;

    // Calculate the minimum and maximum x, y, z coordinates of the cube
    const minX = this.center.x - halfSize;
    const maxX = this.center.x + halfSize;
    const minY = this.center.y - halfSize;
    const maxY = this.center.y + halfSize;
    const minZ = this.center.z - halfSize;
    const maxZ = this.center.z + halfSize;

    // Calculate the intersection distances for each pair of parallel planes
    const tMinX = (minX - ray.origin.x) / ray.direction.x;
    const tMaxX = (maxX - ray.origin.x) / ray.direction.x;
    const tMinY = (minY - ray.origin.y) / ray.direction.y;
    const tMaxY = (maxY - ray.origin.y) / ray.direction.y;
    const tMinZ = (minZ - ray.origin.z) / ray.direction.z;
    const tMaxZ = (maxZ - ray.origin.z) / ray.direction.z;

    // Find the largest of the minimum distances and the smallest of the maximum distances
    const tMin = Math.max(
      Math.min(tMinX, tMaxX),
      Math.min(tMinY, tMaxY),
      Math.min(tMinZ, tMaxZ)
    );
    const tMax = Math.min(
      Math.max(tMinX, tMaxX),
      Math.max(tMinY, tMaxY),
      Math.max(tMinZ, tMaxZ)
    );

    // If tMax is less than tMin, the ray does not intersect the cube
    if (tMax < tMin || tMax < 0) {
      return null;
    }

    // Calculate the intersection point and normal vector for shading
    const intersectionDistance = tMin > 0 ? tMin : tMax; // Choose the closest valid intersection distance
    const intersectionPoint = ray.origin.add(
      ray.direction.multiply(intersectionDistance)
    );

    // Determine the face that was hit to calculate the normal
    let normal = new Vector3(0, 0, 1);
    if (intersectionPoint.x === minX) normal = new Vector3(-1, 0, 0);
    else if (intersectionPoint.x === maxX) normal = new Vector3(1, 0, 0);
    else if (intersectionPoint.y === minY) normal = new Vector3(0, -1, 0);
    else if (intersectionPoint.y === maxY) normal = new Vector3(0, 1, 0);
    else if (intersectionPoint.z === minZ) normal = new Vector3(0, 0, -1);
    else if (intersectionPoint.z === maxZ) normal = new Vector3(0, 0, 1);

    return {
      t: intersectionDistance,
      point: intersectionPoint,
      normal: normal,
    };
  }
}
