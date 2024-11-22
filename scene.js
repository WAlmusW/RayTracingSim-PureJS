class Scene {
  constructor() {
    this.objects = [];
    this.lightSources = SCENE_DATA.lightSources;
    this.initializeObjects();
  }

  // Initialize objects based on the configuration
  initializeObjects() {
    for (const obj of SCENE_DATA.objects) {
      if (obj.type === "Sphere") {
        this.addObject(
          new Sphere(obj.center, obj.radius, obj.color, obj.roughness)
        );
      } else if (obj.type === "Cube") {
        this.addObject(
          new Cube(obj.center, obj.size, obj.color, obj.roughness)
        );
      }
    }
  }

  addObject(object) {
    this.objects.push(object);
  }

  // Traces a ray through the scene to find intersections and calculate colors
  trace(ray, depth = 0) {
    let closestDistance = Infinity;
    let closestIntersection = null;
    let closestObject = null;

    // PRIMARY RAY: Find the closest object the ray intersects
    for (const object of this.objects) {
      const intersection = object.intersect(ray);
      if (intersection && intersection.t < closestDistance) {
        closestDistance = intersection.t;
        closestIntersection = intersection;
        closestObject = object;
      }
    }

    if (!closestIntersection) {
      // return SCENE_DATA.plainSkyColor;

      // Use the ray's direction to create a gradient
      const t = 0.5 * (ray.direction.y + 1); // Map y-direction to [0, 1]
      const startColor = SCENE_DATA.gradientSkyColor.startColor;
      const endColor = SCENE_DATA.gradientSkyColor.endColor;
      return startColor.multiply(1 - t).add(endColor.multiply(t)); // Linear blend
    }

    const { point, normal } = closestIntersection;
    const baseColor = closestObject.color;

    // Ambient lighting
    const ambientFactor = RENDER_CONFIG.ambientFactor;
    let finalColor = baseColor.multiply(ambientFactor);

    // SHADOW RAY: Determine if the point is in shadow for each light source
    for (const light of this.lightSources) {
      const lightDirection = light.subtract(point).normalize();
      const shadowRay = new Ray(
        point.add(normal.multiply(0.001)), // Offset to avoid self-intersection
        lightDirection
      );

      // Check for shadows
      let inShadow = false;
      for (const object of this.objects) {
        if (object.intersect(shadowRay)) {
          inShadow = true;
          break;
        }
      }

      // If not in shadow, add diffuse lighting
      if (!inShadow) {
        const diffuseFactor = Math.max(0, normal.dotProduct(lightDirection));
        finalColor = finalColor.add(baseColor.multiply(diffuseFactor));
      }
    }

    // SECONDARY RAY: Reflection calculation
    if (depth < RENDER_CONFIG.reflectionDepth) {
      const reflectionDirection = ray.direction.subtract(
        normal.multiply(2 * ray.direction.dotProduct(normal)) // Reflect the direction vector
      );
      const reflectionRay = new Ray(
        point.add(normal.multiply(0.001)), // Offset to avoid self-intersection
        reflectionDirection
      );

      // Recursive call to trace the reflection ray
      const reflectionColor = this.trace(reflectionRay, depth + 1);

      // Blend reflection and base color based on roughness
      const roughness = closestObject.roughness;
      finalColor = finalColor
        .multiply(1 - roughness)
        .add(reflectionColor.multiply(roughness));
    }

    return finalColor; // Return the final color with ambient, diffuse, and reflection lighting
  }
}
