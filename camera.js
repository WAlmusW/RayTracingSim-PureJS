// The camera object, which defines where the viewer is in the 3D space
let camera = {
  ...CAMERA_DATA,
};

// Rotates the camera based on mouse movement
function rotateCamera(mouseDeltaX, mouseDeltaY) {
  const rotationSensitivity = CAMERA_CONTROL_CONFIG.rotationSensitivity;
  const rightDirection = camera.direction
    .crossProduct(camera.upDirection)
    .normalize(); // Right direction vector

  // Rotate around the Y-axis (horizontal rotation)
  const rotationYMatrix = new Matrix4().setRotationY(
    -mouseDeltaX * rotationSensitivity
  );
  camera.direction = rotationYMatrix.multiplyVector3(camera.direction);

  // Rotate around the right axis (vertical rotation)
  const rotationXMatrix = new Matrix4().setRotationAxis(
    rightDirection,
    -mouseDeltaY * rotationSensitivity
  );
  camera.direction = rotationXMatrix.multiplyVector3(camera.direction);
  camera.upDirection = rotationXMatrix.multiplyVector3(camera.upDirection); // Adjust the up direction
}

// Moves the camera in different directions
function moveCamera(direction) {
  const movementSpeed = CAMERA_CONTROL_CONFIG.movementSpeed;
  const rightDirection = camera.direction
    .crossProduct(camera.upDirection)
    .normalize(); // Right direction vector

  // Move the camera based on the specified direction
  switch (direction) {
    case "forward":
      camera.position = camera.position.add(
        camera.direction.multiply(movementSpeed)
      );
      break;
    case "backward":
      camera.position = camera.position.subtract(
        camera.direction.multiply(movementSpeed)
      );
      break;
    case "left":
      camera.position = camera.position.subtract(
        rightDirection.multiply(movementSpeed)
      );
      break;
    case "right":
      camera.position = camera.position.add(
        rightDirection.multiply(movementSpeed)
      );
      break;
    case "up":
      camera.position = camera.position.subtract(
        camera.upDirection.multiply(movementSpeed)
      );
      break;
    case "down":
      camera.position = camera.position.add(
        camera.upDirection.multiply(movementSpeed)
      );
      break;
  }
}
