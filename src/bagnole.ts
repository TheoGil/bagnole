import { MathUtils, Vector2 } from "three";

const LINEAR_VELOCITY_MAX = 10;
const LINEAR_VELOCITY_MIN = 0.01;
const ACCELERATION_FACTOR = 1; // How fast the vehicle can accelerate
const STEERING_FACTOR = 0.75; // How fast the vehicle can turn
const FRICTION_FACTOR = 0.25; // Amount deduced from the linearVelocity each update

class Bagnole {
  width: number;
  length: number;
  position = new Vector2(0, 0);
  angle = 0;
  linearVelocity = 0;
  acceleration = 0;
  frontWheelPosition = new Vector2();
  backWheelPosition = new Vector2();

  constructor({ width, length }: { width: number; length: number }) {
    this.width = width;
    this.length = length;
  }

  update({
    deltaTime,
    normalizedAcceleration,
    normalizedSteering,
  }: {
    deltaTime: number;
    normalizedAcceleration: number;
    normalizedSteering: number;
  }) {
    const steering = normalizedSteering * STEERING_FACTOR;
    const acceleration = normalizedAcceleration * ACCELERATION_FACTOR;
    this.computeLinearVelocity(acceleration);
    this.applyFriction(acceleration);
    this.computeFrontWheelPosition();
    this.computeBackWheelPosition();
    this.moveFrontWheel(deltaTime, steering);
    this.moveBackWheel(deltaTime);
    this.computeNewPosition();
    this.computeNewAngle();
  }

  computeLinearVelocity(acceleration: number) {
    this.linearVelocity += acceleration;
    this.linearVelocity = MathUtils.clamp(
      this.linearVelocity,
      -LINEAR_VELOCITY_MAX,
      LINEAR_VELOCITY_MAX
    );
  }

  computeFrontWheelPosition() {
    this.frontWheelPosition.x =
      this.position.x + (this.length / 2) * Math.cos(this.angle);

    this.frontWheelPosition.y =
      this.position.y + (this.length / 2) * Math.sin(this.angle);
  }

  computeBackWheelPosition() {
    this.backWheelPosition.x =
      this.position.x - (this.length / 2) * Math.cos(this.angle);

    this.backWheelPosition.y =
      this.position.y - (this.length / 2) * Math.sin(this.angle);
  }

  moveFrontWheel(deltaTime: number, steering: number) {
    this.frontWheelPosition.x +=
      this.linearVelocity * deltaTime * Math.cos(this.angle + steering);

    this.frontWheelPosition.y +=
      this.linearVelocity * deltaTime * Math.sin(this.angle + steering);
  }

  moveBackWheel(deltaTime: number) {
    this.backWheelPosition.x +=
      this.linearVelocity * deltaTime * Math.cos(this.angle);
    this.backWheelPosition.y +=
      this.linearVelocity * deltaTime * Math.sin(this.angle);
  }

  computeNewPosition() {
    this.position.x =
      (this.frontWheelPosition.x + this.backWheelPosition.x) / 2;

    this.position.y =
      (this.frontWheelPosition.y + this.backWheelPosition.y) / 2;
  }

  computeNewAngle() {
    this.angle = Math.atan2(
      this.frontWheelPosition.y - this.backWheelPosition.y,
      this.frontWheelPosition.x - this.backWheelPosition.x
    );
  }

  applyFriction(acceleration: number) {
    if (acceleration === 0) {
      if (Math.abs(this.linearVelocity) > LINEAR_VELOCITY_MIN) {
        const direction = Math.sign(this.linearVelocity);
        this.linearVelocity += FRICTION_FACTOR * -direction;

        if (Math.sign(this.linearVelocity) !== direction) {
          this.linearVelocity = 0;
        }
      }
    }
  }
}

export { Bagnole };
