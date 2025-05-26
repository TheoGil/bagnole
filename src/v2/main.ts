import { Vector2 } from "three";
import "../style.css";
import { renderVehicle2D, Vehicle } from "./Vehicle";

class Keyboard {
  keys: Map<
    KeyboardEvent["code"],
    {
      isDown: boolean;
      timeStamp: number;
    }
  >;

  inputVector = new Vector2();

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);

    this.keys = new Map<
      KeyboardEvent["code"],
      {
        isDown: boolean;
        timeStamp: number;
      }
    >();
  }

  onKeyDown(e: KeyboardEvent) {
    this.keys.set(e.code, { isDown: true, timeStamp: e.timeStamp });
  }

  onKeyUp(e: KeyboardEvent) {
    if (this.keys.get(e.code)) {
      this.keys.get(e.code)!.isDown = false;
    }
  }

  updateInputVector() {
    let y = 0;

    if (
      this.keys.get("ArrowDown")?.isDown &&
      !this.keys.get("ArrowUp")?.isDown
    ) {
      y = 1;
    } else if (
      !this.keys.get("ArrowDown")?.isDown &&
      this.keys.get("ArrowUp")?.isDown
    ) {
      y = -1;
    } else if (
      this.keys.get("ArrowDown")?.isDown &&
      this.keys.get("ArrowUp")?.isDown
    ) {
      y =
        this.keys.get("ArrowDown")!.timeStamp >
        this.keys.get("ArrowUp")!.timeStamp
          ? 1
          : -1;
    }

    let x = 0;

    if (
      this.keys.get("ArrowRight")?.isDown &&
      !this.keys.get("ArrowLeft")?.isDown
    ) {
      x = 1;
    } else if (
      !this.keys.get("ArrowRight")?.isDown &&
      this.keys.get("ArrowLeft")?.isDown
    ) {
      x = -1;
    } else if (
      this.keys.get("ArrowRight")?.isDown &&
      this.keys.get("ArrowLeft")?.isDown
    ) {
      x =
        this.keys.get("ArrowRight")!.timeStamp >
        this.keys.get("ArrowLeft")!.timeStamp
          ? 1
          : -1;
    }

    this.inputVector.set(x, y);
  }
}

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  vehicle: Vehicle;
  keyboard: Keyboard;

  constructor() {
    // Setup player input
    this.keyboard = new Keyboard();

    // Setup vehicle
    this.vehicle = new Vehicle();

    // Setup rendering
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;

    document.body.appendChild(this.canvas);
    this.canvas.style.position = "fixed";
    this.canvas.style.inset = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.onResize();

    this.update = this.update.bind(this);
    this.update();
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  update() {
    this.keyboard.updateInputVector();

    this.vehicle.update(this.keyboard.inputVector);

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    renderVehicle2D(this.ctx, this.vehicle);

    requestAnimationFrame(this.update);
  }
}

new Game();
