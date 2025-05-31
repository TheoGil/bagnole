const ACCELERATION_FACTOR = 0.1;
const FRICTION_FACTOR = 0.75;
const MAX_VELOCITY = 5;
const MAX_ANGULAR_VELOCITY = 0.07;
const ANGULAR_ACCELERATION = 0.005;

import { MathUtils, Vector2 } from "three";
import { drawCrossHair } from "./render-utils";

class Vehicle {
  position = new Vector2();
  velocity = new Vector2();
  acceleration = new Vector2();

  angle = MathUtils.degToRad(90);
  angularVelocity = 0;
  angularAcceleration = 0;

  linearVelocity = 0;
  linearAcceleration = 0;

  update(inputVector: Vector2) {
    this.angularAcceleration = inputVector.x * ANGULAR_ACCELERATION;
    this.angularVelocity += this.angularAcceleration;
    this.angularVelocity = MathUtils.clamp(
      this.angularVelocity,
      -MAX_ANGULAR_VELOCITY,
      MAX_ANGULAR_VELOCITY
    );

    const newAngle = this.angle + this.angularVelocity;
    this.angle = newAngle;

    this.angularAcceleration = 0;

    if (inputVector.x === 0 && this.angularVelocity !== 0) {
      this.angularVelocity = 0;
    }

    this.linearAcceleration = inputVector.y * ACCELERATION_FACTOR;
    this.linearVelocity += this.linearAcceleration;
    this.linearVelocity = MathUtils.clamp(
      this.linearVelocity,
      -MAX_VELOCITY,
      MAX_VELOCITY
    );
    this.velocity.set(
      this.linearVelocity * Math.cos(this.angle),
      this.linearVelocity * Math.sin(this.angle)
    );
    this.position.add(this.velocity);
    this.linearAcceleration = 0;

    if (inputVector.y === 0 && this.linearVelocity !== 0) {
      const sign = Math.sign(this.linearVelocity);
      this.linearVelocity += -sign * FRICTION_FACTOR;

      if (sign !== Math.sign(this.linearVelocity)) {
        this.linearVelocity = 0;
      }
    }
  }
}

const COLOR_VEHICLE = "#6A2C70";
const COLOR_HELPER = "#F9ED69";
const VEHICLE_WIDTH = 50 / 2;
const VEHICLE_DEPTH = 25 / 2;
function renderVehicle2D(ctx: CanvasRenderingContext2D, vehicle: Vehicle) {
  const x = vehicle.position.x;
  const y = vehicle.position.y;

  ctx.save();
  ctx.fillStyle = COLOR_VEHICLE;
  ctx.translate(x, y);
  ctx.rotate(vehicle.angle);
  ctx.translate(-x, -y);
  ctx.fillRect(
    x - VEHICLE_WIDTH / 2,
    y - VEHICLE_DEPTH / 2,
    VEHICLE_WIDTH,
    VEHICLE_DEPTH
  );

  ctx.beginPath();
  ctx.moveTo(x - VEHICLE_WIDTH / 2, y - VEHICLE_DEPTH / 2);
  ctx.lineTo(x - 5 - VEHICLE_WIDTH / 2, y);
  ctx.lineTo(x - VEHICLE_WIDTH / 2, y + VEHICLE_DEPTH / 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  drawCrossHair(
    ctx,
    vehicle.position.x,
    vehicle.position.y,
    COLOR_HELPER,
    10,
    1
  );
}

export { Vehicle, renderVehicle2D };
