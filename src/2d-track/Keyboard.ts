import { Vector2 } from "three";

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

    this.initTouchControls();
  }

  initTouchControls() {
    const leftButtonEl = document.querySelector("[data-button-left");
    leftButtonEl?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      leftButtonEl.classList.add("active");
      this.keys.set("ArrowLeft", { isDown: true, timeStamp: e.timeStamp });
    });
    leftButtonEl?.addEventListener("pointerup", (e) => {
      e.preventDefault();
      leftButtonEl.classList.remove("active");
      if (this.keys.get("ArrowLeft")) {
        this.keys.get("ArrowLeft")!.isDown = false;
      }
    });

    const rightButtonEl = document.querySelector("[data-button-right");
    rightButtonEl?.addEventListener("pointerdown", (e) => {
      rightButtonEl.classList.add("active");
      e.preventDefault();
      this.keys.set("ArrowRight", { isDown: true, timeStamp: e.timeStamp });
    });
    rightButtonEl?.addEventListener("pointerup", (e) => {
      e.preventDefault();
      rightButtonEl.classList.remove("active");
      if (this.keys.get("ArrowRight")) {
        this.keys.get("ArrowRight")!.isDown = false;
      }
    });

    const upButtonEl = document.querySelector("[data-button-up");
    upButtonEl?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      upButtonEl.classList.add("active");
      this.keys.set("ArrowUp", { isDown: true, timeStamp: e.timeStamp });
    });
    upButtonEl?.addEventListener("pointerup", (e) => {
      e.preventDefault();
      upButtonEl.classList.remove("active");
      if (this.keys.get("ArrowUp")) {
        this.keys.get("ArrowUp")!.isDown = false;
      }
    });
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

export { Keyboard };
