// Grab the canvas element from the HTML and set up the 2D drawing context
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const canvasWidth = RENDER_CONFIG.canvasWidth;
const canvasHeight = RENDER_CONFIG.canvasHeight;
const fpsCounterElement = document.getElementById("fps-counter"); // FPS counter element

// Create the scene
const scene = new Scene();

let isHighQuality = RENDER_CONFIG.isHighQuality; // Flag for rendering quality
let renderScale = RENDER_CONFIG.renderScale; // Scale factor for rendering (1 = high, 0.5 = low)

// Renders the scene on the canvas
function render() {
  const scaledWidth = Math.floor(canvasWidth * renderScale);
  const scaledHeight = Math.floor(canvasHeight * renderScale);
  const imageData = context.createImageData(scaledWidth, scaledHeight);
  const data = imageData.data;

  // Loop through every pixel on the canvas
  for (let y = 0; y < scaledHeight; y++) {
    for (let x = 0; x < scaledWidth; x++) {
      const normalizedX = (x / scaledWidth) * 2 - 1; // Horizontal coordinate (-1 to 1)
      const normalizedY = (y / scaledHeight) * 2 - 1; // Vertical coordinate (-1 to 1)

      const aspectRatio = scaledWidth / scaledHeight; // Aspect ratio of the canvas
      const pixelDirection = camera.direction
        .multiply(camera.fieldOfView)
        .add(
          camera.upDirection.multiply(
            (normalizedY * camera.fieldOfView) / aspectRatio
          )
        )
        .add(
          camera.direction
            .crossProduct(camera.upDirection)
            .multiply(normalizedX * camera.fieldOfView)
        ); // Calculate ray direction
      const ray = new Ray(camera.position, pixelDirection); // Create a ray from the camera
      const color = scene.trace(ray); // Trace the ray and get the color

      const pixelIndex = (y * scaledWidth + x) * 4; // Index in the image data array
      data[pixelIndex] = Math.min(255, color.x * 255); // Red component
      data[pixelIndex + 1] = Math.min(255, color.y * 255); // Green component
      data[pixelIndex + 2] = Math.min(255, color.z * 255); // Blue component
      data[pixelIndex + 3] = 255; // Alpha component (opacity)
    }
  }

  context.putImageData(imageData, 0, 0); // Draw the image data on the canvas
  if (renderScale !== 1) {
    context.imageSmoothingEnabled = false; // Disable smoothing for lower quality
    context.drawImage(
      canvas,
      0,
      0,
      scaledWidth,
      scaledHeight,
      0,
      0,
      canvasWidth,
      canvasHeight
    ); // Scale the image to the full canvas size
  }
}

// Main game loop that updates and renders the scene
function gameLoop() {
  render(); // Render the scene
  updateFPS(); // Update the FPS counter
  requestAnimationFrame(gameLoop); // Call gameLoop again for the next frame
}

let isMousePressed = false;
let previousMouseX = 0;
let previousMouseY = 0;
let selectedObject = null; // The sphere currently being dragged
let dragPlaneNormal = new Vector3(0, 0, 0); // Normal of the plane for dragging

// Handles mouse down events
canvas.addEventListener("mousedown", (event) => {
  isMousePressed = true;
  previousMouseX = event.clientX;
  previousMouseY = event.clientY;

  const ray = getRayFromMouseEvent(event); // Get a ray from the mouse position
  let closestDistance = Infinity; // Keep track of the closest object

  // Check if the ray intersects with any sphere
  for (const object of scene.objects) {
    const intersection = object.intersect(ray);
    if (intersection && intersection.t < closestDistance) {
      closestDistance = intersection.t;
      selectedObject = object; // Set the selected sphere
      dragPlaneNormal = intersection.normal; // Set the normal for dragging
    }
  }
});

// Handles mouse up events
canvas.addEventListener("mouseup", () => {
  isMousePressed = false; // Set flag to false
  selectedObject = null; // Deselect the sphere
});

// Handles mouse move events
canvas.addEventListener("mousemove", (event) => {
  if (isMousePressed) {
    if (selectedObject) {
      // Dragging the sphere
      const ray = getRayFromMouseEvent(event); // Get a ray from the mouse position
      const planeDotProduct = dragPlaneNormal.dotProduct(ray.direction); // Check if the ray is parallel to the plane

      if (Math.abs(planeDotProduct) > 0.0001) {
        // Calculate the intersection point on the plane
        const t =
          dragPlaneNormal.dotProduct(
            selectedObject.center.subtract(ray.origin)
          ) / planeDotProduct;
        const intersectionPoint = ray.origin.add(ray.direction.multiply(t));
        selectedObject.center = intersectionPoint; // Move the sphere to the intersection point
      }
    } else {
      // Rotating the camera
      const deltaX = event.clientX - previousMouseX;
      const deltaY = -(event.clientY - previousMouseY);
      rotateCamera(deltaX, deltaY);
    }

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
  }
});

// Converts a mouse event into a ray
function getRayFromMouseEvent(event) {
  const rect = canvas.getBoundingClientRect(); // Get the canvas bounds
  const normalizedX = (event.clientX - rect.left) / rect.width; // Normalize X coordinate
  const normalizedY = (event.clientY - rect.top) / rect.height; // Normalize Y coordinate

  const u = normalizedX * 2 - 1; // Horizontal coordinate (-1 to 1)
  const v = normalizedY * 2 - 1; // Vertical coordinate (-1 to 1)

  const aspectRatio = canvasWidth / canvasHeight; // Aspect ratio of the canvas
  const pixelDirection = camera.direction
    .multiply(camera.fieldOfView)
    .add(camera.upDirection.multiply((v * camera.fieldOfView) / aspectRatio))
    .add(
      camera.direction
        .crossProduct(camera.upDirection)
        .multiply(u * camera.fieldOfView)
    ); // Calculate ray direction
  return new Ray(camera.position, pixelDirection); // Return the ray
}

// Handles keyboard input for camera movement
document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      moveCamera("forward");
      break;
    case "s":
      moveCamera("backward");
      break;
    case "a":
      moveCamera("left");
      break;
    case "d":
      moveCamera("right");
      break;
    case " ":
      moveCamera("up");
      break;
    case "shift":
      moveCamera("down");
      break;
  }
});

// Adds a new sphere to the scene when the "Add Sphere" button is clicked
document.getElementById("addSphere").addEventListener("click", () => {
  const randomX = Math.random() * 10 - 5;
  const randomY = Math.random() * 10 - 5;
  const randomZ = Math.random() * -10 - 5;
  const randomRadius = Math.random() * 0.5 + 0.5;
  const randomColor = new Vector3(Math.random(), Math.random(), Math.random());
  const randomRoughness = Math.random();
  scene.addObject(
    new Sphere(
      new Vector3(randomX, randomY, randomZ),
      randomRadius,
      randomColor,
      randomRoughness
    )
  );
});

// Add a new cube to the scene when the "Add Cube" button is clicked
document.getElementById("addCube").addEventListener("click", () => {
  const randomX = Math.random() * 10 - 5;
  const randomY = Math.random() * 10 - 5;
  const randomZ = Math.random() * -10 - 5;
  const randomSize = Math.random() * 1 + 0.5;
  const randomColor = new Vector3(Math.random(), Math.random(), Math.random());
  const randomRoughness = Math.random();
  scene.addObject(
    new Cube(
      new Vector3(randomX, randomY, randomZ),
      randomSize,
      randomColor,
      randomRoughness
    )
  );
});

// Toggles the rendering quality when the "Toggle Quality" button is clicked
document.getElementById("toggleQuality").addEventListener("click", () => {
  isHighQuality = !isHighQuality;
  renderScale = isHighQuality ? 1 : 0.5;
});

let lastFrameTime = performance.now();
let frameCounter = 0; // Number of frames since the last update

// Updates the FPS counter
function updateFPS() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime; // Time since last update
  frameCounter++;

  if (deltaTime >= 1000) {
    // Update FPS every second
    const fps = Math.round((frameCounter * 1000) / deltaTime); // Calculate FPS
    fpsCounterElement.textContent = `FPS: ${fps}`; // Update the counter
    frameCounter = 0; // Reset frame count
    lastFrameTime = currentTime; // Reset last frame time
  }
}

gameLoop();
