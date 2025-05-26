const ACCELERATION_FACTOR = 0.5;
const FRICTION_FACTOR = 0.75;
const MAX_VELOCITY = 10;
const MAX_ANGULAR_VELOCITY = 0.07;
const ANGULAR_ACCELERATION = 0.005;

import { MathUtils, Vector2 } from "three";

class Vehicle {
  position = new Vector2(500, 500);
  velocity = new Vector2();
  acceleration = new Vector2();

  angle = MathUtils.degToRad(90);
  lerpedAngle = MathUtils.degToRad(90);
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
      this.linearVelocity * Math.cos(this.lerpedAngle),
      this.linearVelocity * Math.sin(this.lerpedAngle)
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

function renderVehicle2D(ctx: CanvasRenderingContext2D, vehicle: Vehicle) {
  ctx.save();
  ctx.translate(vehicle.position.x + 50, vehicle.position.y + 25);
  ctx.rotate(vehicle.angle);
  ctx.translate(-(vehicle.position.x + 50), -(vehicle.position.y + 25));
  ctx.fillRect(vehicle.position.x, vehicle.position.y, 100, 50);
  ctx.restore();
}

export { Vehicle, renderVehicle2D };
