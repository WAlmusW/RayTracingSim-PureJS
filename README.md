# PureJS 3D Ray Tracing Simulation

This project is a **3D ray tracing simulation** written entirely in **JavaScript**. It renders 3D scenes interactively within a web browser using HTML5 Canvas. Users can add objects, move them, and control the camera to explore the simulated environment.

---

## Features

- **Ray Tracing**: Realistic rendering of spheres, cubes, and reflections using ray tracing principles.
- **Interactive Camera**: Move the camera in 3D space using `W`, `A`, `S`, `D`, `Space`, and `Shift`.
- **Object Interaction**: Drag and drop objects (spheres or cubes) to reposition them.
- **Dynamic Scene Editing**:
  - Add spheres or cubes to the scene with random properties.
  - Toggle between high and low-quality rendering modes.
- **Gradient Sky**: Realistic gradient-based background for scenes.

---

## Project Structure

| File         | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `index.html` | HTML structure and UI for the simulation.                                    |
| `styles.css` | Styling for the UI elements and canvas.                                      |
| `app.js`     | Main application logic, rendering loop, and user interactions.               |
| `camera.js`  | Camera logic, including movement and rotation handling.                      |
| `cube.js`    | Logic for handling cube objects and ray intersection.                        |
| `sphere.js`  | Logic for handling sphere objects and ray intersection.                      |
| `scene.js`   | Scene setup, object management, and ray tracing calculations.                |
| `data.js`    | Configuration for scene, camera, and rendering settings.                     |
| `ray.js`     | Defines the `Ray` class for ray tracing.                                     |
| `math.js`    | Provides `Vector3` and `Matrix4` classes for vector and matrix calculations. |

---

## How to Use

1. **Download and Open the Project**

   - Download the repository as a ZIP file from GitHub.
   - Extract the contents to your local machine.
   - Open `index.html` in your browser. Ensure you allow scripts for full functionality.

2. **Controls**

   - **Camera Movement**:
     - `W`: Move forward
     - `S`: Move backward
     - `A`: Move left
     - `D`: Move right
     - `Space`: Move up
     - `Shift`: Move down
   - **Mouse Interaction**:
     - Click and drag objects to reposition them.
     - Move the mouse to look around.
   - **Buttons**:
     - `Add Sphere`: Adds a random sphere to the scene.
     - `Add Cube`: Adds a random cube to the scene.
     - `Toggle Quality`: Switch between high and low-quality rendering.

3. **View FPS**
   The FPS counter updates dynamically in the top-left corner of the canvas.

---

## Dependencies

- Pure JavaScript, no external libraries required.

---

## Future Enhancements (Probably)

- Add support for additional shapes (e.g., planes, pyramids).
- Implement more advanced materials like transparency and refraction.
- Introduce lighting configurations like spotlights and area lights.

---

## Credits

- **Author**: [WAlmusW](https://github.com/WAlmusW)
- Inspired by ray tracing concepts and graphics programming.
