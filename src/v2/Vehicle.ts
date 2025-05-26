import { MathUtils, Vector2 } from "three";

export function drawCrossHair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color = "red"
) {
  const size = 5;
  const halfSize = size / 2;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(x - halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y + halfSize);
  ctx.moveTo(x + halfSize, y - halfSize);
  ctx.lineTo(x - halfSize, y + halfSize);
  ctx.stroke();
  ctx.restore();
}

/**
 * Bicycle model.
 * This car controller simplifies the car by only simulating two wheels (just like a bike).
 * Both wheel are centered, front wheel can steer, back wheel cannot (again, just like a bike).
 * Reference: https://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
 * Also reference: https://www.youtube.com/watch?v=mJ1ZfGDTMCY (Godot Recipes: Car Steering)
 */

const LINEAR_VELOCITY_MAX = 10;
const LINEAR_VELOCITY_MIN = 0.01;
const ACCELERATION_FACTOR = 0.25; // How fast the vehicle can accelerate
const STEERING_FACTOR = 0.75; // How fast the vehicle can turn
const FRICTION_FACTOR = 0.25; // Amount deduced from the linearVelocity each update
const BRAKING_FACTOR = 0.5;

class Vehicle {
  position = new Vector2(500, 500);
  angle = 0;
  linearVelocity = 0;
  acceleration = 0;

  width = 50;
  length = 100;

  frontWheelPosition = new Vector2();
  backWheelPosition = new Vector2();
  distanceBetweenWheels = 80;

  update(inputVector: Vector2) {
    // V1
    /*
    // TODO
    const deltaTime = 1;

    const steering = -inputVector.x * STEERING_FACTOR;

    let acceleration = inputVector.y * ACCELERATION_FACTOR;

    // Braking
    // if (inputVector.y === 1) {
    //   this.decelerate(BRAKING_FACTOR);
    // }

    // STEP 1
    // Compute the position and front and back wheels
    this.frontWheelPosition.x =
      this.position.x + (this.distanceBetweenWheels / 2) * Math.cos(this.angle);
    this.frontWheelPosition.y =
      this.position.y + (this.distanceBetweenWheels / 2) * Math.sin(this.angle);

    this.backWheelPosition.x =
      this.position.x - (this.distanceBetweenWheels / 2) * Math.cos(this.angle);
    this.backWheelPosition.y =
      this.position.y - (this.distanceBetweenWheels / 2) * Math.sin(this.angle);

    // Compute new linear velocity
    this.linearVelocity += acceleration;
    this.linearVelocity = MathUtils.clamp(
      this.linearVelocity,
      -LINEAR_VELOCITY_MAX,
      LINEAR_VELOCITY_MAX
    );

    // STEP 2
    // Move the front and back wheels.
    this.backWheelPosition.x +=
      this.linearVelocity * deltaTime * Math.cos(this.angle);
    this.backWheelPosition.y +=
      this.linearVelocity * deltaTime * Math.sin(this.angle);

    this.frontWheelPosition.x +=
      this.linearVelocity * deltaTime * Math.cos(this.angle + steering);
    this.frontWheelPosition.y +=
      this.linearVelocity * deltaTime * Math.sin(this.angle + steering);

    // STEP 3
    // Compute new vehicle position by averaging wheels positions.
    // Compute new angle.
    this.position.x =
      (this.frontWheelPosition.x + this.backWheelPosition.x) / 2;
    this.position.y =
      (this.frontWheelPosition.y + this.backWheelPosition.y) / 2;

    this.angle = Math.atan2(
      this.frontWheelPosition.y - this.backWheelPosition.y,
      this.frontWheelPosition.x - this.backWheelPosition.x
    );

    // Apply friction
    if (acceleration === 0) {
      this.decelerate(FRICTION_FACTOR);
    }
      */

    // TODO
    const deltaTime = 1;

    const steering = inputVector.x * STEERING_FACTOR;

    // STEP 1
    // Compute the position and front and back wheels
    this.frontWheelPosition.x =
      this.position.x + (this.distanceBetweenWheels / 2) * Math.cos(this.angle);
    this.frontWheelPosition.y =
      this.position.y + (this.distanceBetweenWheels / 2) * Math.sin(this.angle);

    this.backWheelPosition.x =
      this.position.x - (this.distanceBetweenWheels / 2) * Math.cos(this.angle);
    this.backWheelPosition.y =
      this.position.y - (this.distanceBetweenWheels / 2) * Math.sin(this.angle);

    this.computeLinearVelocity(inputVector);

    // STEP 2
    // Move the front and back wheels.
    this.backWheelPosition.x +=
      this.linearVelocity * deltaTime * Math.cos(this.angle);
    this.backWheelPosition.y +=
      this.linearVelocity * deltaTime * Math.sin(this.angle);

    this.frontWheelPosition.x +=
      this.linearVelocity * deltaTime * Math.cos(this.angle + steering);
    this.frontWheelPosition.y +=
      this.linearVelocity * deltaTime * Math.sin(this.angle + steering);

    // STEP 3
    // Compute new vehicle position by averaging wheels positions.
    // Compute new angle.
    this.position.x =
      (this.frontWheelPosition.x + this.backWheelPosition.x) / 2;
    this.position.y =
      (this.frontWheelPosition.y + this.backWheelPosition.y) / 2;

    this.angle = Math.atan2(
      this.frontWheelPosition.y - this.backWheelPosition.y,
      this.frontWheelPosition.x - this.backWheelPosition.x
    );

    // Apply friction
    if (this.acceleration === 0) {
      this.decelerate(FRICTION_FACTOR);
    }
  }

  decelerate(amount: number) {
    if (Math.abs(this.linearVelocity) > LINEAR_VELOCITY_MIN) {
      const direction = Math.sign(this.linearVelocity);
      this.linearVelocity += amount * -direction;

      if (Math.sign(this.linearVelocity) !== direction) {
        this.linearVelocity = 0;
      }
    }
  }

  computeLinearVelocity(inputVector: Vector2) {
    this.acceleration = 0;

    const FORWARD = inputVector.y === -1;
    if (FORWARD) {
      this.acceleration = ACCELERATION_FACTOR;
    }

    const BACKWARD = inputVector.y === 1;
    if (BACKWARD) {
      const BRAKING = this.linearVelocity > 0;
      if (BRAKING) {
        this.decelerate(BRAKING_FACTOR);
      } else {
        this.acceleration = -ACCELERATION_FACTOR;
      }
    }

    this.linearVelocity = MathUtils.clamp(
      this.linearVelocity + this.acceleration,
      -LINEAR_VELOCITY_MAX,
      LINEAR_VELOCITY_MAX
    );

    console.log(this.linearVelocity);
  }
}

function renderVehicle2D(ctx: CanvasRenderingContext2D, vehicle: Vehicle) {
  const COLOR_WHEELS = "#FFE2E2";
  ctx.fillStyle = COLOR_WHEELS;

  drawCrossHair(
    ctx,
    vehicle.frontWheelPosition.x,
    vehicle.frontWheelPosition.y,
    "green"
  );

  drawCrossHair(
    ctx,
    vehicle.backWheelPosition.x,
    vehicle.backWheelPosition.y,
    "red"
  );

  // carLocation + wheelBase/2 * new Vector2( cos(carHeading) , sin(carHeading) );
}

export { Vehicle, renderVehicle2D };
