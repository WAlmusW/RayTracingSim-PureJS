// Scene configuration
const SCENE_DATA = {
  lightSources: [new Vector3(0, -5, 5)], // Light sources in the scene
  plainSkyColor: new Vector3(0.7, 0.7, 1), // plain sky color in the scene
  gradientSkyColor: {
    startColor: new Vector3(0.5, 0.7, 1.0), // Top color (light blue)
    endColor: new Vector3(1.0, 1.0, 1.0), // Bottom color (white)
  },
  objects: [
    {
      type: "Sphere",
      center: new Vector3(-3, 0, -5),
      radius: 1,
      color: new Vector3(1, 0, 0), // Red sphere
      roughness: 0.8, // Almost mirror-like
    },
    {
      type: "Sphere",
      center: new Vector3(-1.5, 0, -7),
      radius: 1,
      color: new Vector3(0, 1, 0), // Green sphere
      roughness: 0.1, // Almost diffuse like concrete
    },
    {
      type: "Sphere",
      center: new Vector3(1.5, 0, -7),
      radius: 1,
      color: new Vector3(0, 0, 1), // Blue sphere
      roughness: 1, // Perfect mirror
    },
    {
      type: "Cube",
      center: new Vector3(3, 0, -5),
      size: 2,
      color: new Vector3(1, 0, 0), // Red cube
      roughness: 0, // Perfect concrete
    },
  ],
};

// Camera configuration
const CAMERA_DATA = {
  position: new Vector3(0, 0, 0),
  direction: new Vector3(0, 0, -1),
  upDirection: new Vector3(0, 1, 0),
  fieldOfView: Math.PI / 3,
};

// Rendering configuration
const RENDER_CONFIG = {
  canvasWidth: 1500,
  canvasHeight: 550,
  isHighQuality: false,
  renderScale: 0.5,
  ambientFactor: 0.2, // Ambient lighting level
  reflectionDepth: 2, // Max depth for reflections
  reflectionFactor: 0.4, // Reflection intensity
};

// Movement sensitivity
const CAMERA_CONTROL_CONFIG = {
  rotationSensitivity: 0.005,
  movementSpeed: 0.1,
};
