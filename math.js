// A class representing a 3D vector, used for positions, directions, and colors
class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vector) {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtract(vector) {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  multiply(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  // Normalizes the vector (makes its length equal to 1)
  normalize() {
    const length = Math.sqrt(this.dotProduct(this)); // Length of the vector
    return this.multiply(1 / length); // Divide each component by the length
  }

  crossProduct(vector) {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }
}

// A class representing a 4x4 matrix, used for rotations and transformations (camera)
class Matrix4 {
  constructor() {
    this.elements = new Float32Array(16); // 16 elements for the matrix
    this.setIdentity(); // Initialize as an identity matrix
  }

  // Sets the matrix to the identity matrix (no transformation)
  setIdentity() {
    this.elements.fill(0); // Fill with zeros
    this.elements[0] =
      this.elements[5] =
      this.elements[10] =
      this.elements[15] =
        1; // Diagonal elements set to 1
    return this;
  }

  // Sets up a rotation matrix around the Y-axis
  setRotationY(angle) {
    const cosine = Math.cos(angle); // Cosine of the angle
    const sine = Math.sin(angle); // Sine of the angle
    this.setIdentity(); // Reset to identity
    this.elements[0] = cosine; // Rotation elements
    this.elements[2] = -sine;
    this.elements[8] = sine;
    this.elements[10] = cosine;
    return this;
  }

  // Sets up a rotation matrix around an arbitrary axis
  setRotationAxis(axis, angle) {
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const oneMinusCosine = 1 - cosine;
    const x = axis.x,
      y = axis.y,
      z = axis.z;

    // Fill in the rotation matrix values
    this.elements[0] = oneMinusCosine * x * x + cosine;
    this.elements[1] = oneMinusCosine * x * y + sine * z;
    this.elements[2] = oneMinusCosine * x * z - sine * y;
    this.elements[3] = 0;

    this.elements[4] = oneMinusCosine * x * y - sine * z;
    this.elements[5] = oneMinusCosine * y * y + cosine;
    this.elements[6] = oneMinusCosine * y * z + sine * x;
    this.elements[7] = 0;

    this.elements[8] = oneMinusCosine * x * z + sine * y;
    this.elements[9] = oneMinusCosine * y * z - sine * x;
    this.elements[10] = oneMinusCosine * z * z + cosine;
    this.elements[11] = 0;

    this.elements[12] = this.elements[13] = this.elements[14] = 0;
    this.elements[15] = 1;

    return this;
  }

  multiplyVector3(vector) {
    const x = vector.x,
      y = vector.y,
      z = vector.z;
    const e = this.elements;
    return new Vector3(
      e[0] * x + e[4] * y + e[8] * z,
      e[1] * x + e[5] * y + e[9] * z,
      e[2] * x + e[6] * y + e[10] * z
    );
  }
}
