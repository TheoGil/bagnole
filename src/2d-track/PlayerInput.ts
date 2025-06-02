import { Vector2 } from "three";

class PlayerInput {
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
    this.initTouchButton(
      document.querySelector("[data-button-left")!,
      "ArrowLeft"
    );
    this.initTouchButton(
      document.querySelector("[data-button-right")!,
      "ArrowRight"
    );
    this.initTouchButton(document.querySelector("[data-button-up")!, "ArrowUp");
  }

  initTouchButton(buttonEl: HTMLElement, keyCode: string) {
    const onButtonDown = (e: PointerEvent) => {
      e.preventDefault();
      buttonEl.classList.add("active");
      this.keys.set(keyCode, { isDown: true, timeStamp: e.timeStamp });
    };

    const onButtonUp = (e: PointerEvent | TouchEvent) => {
      e.preventDefault();
      buttonEl.classList.remove("active");
      if (this.keys.get(keyCode)) {
        this.keys.get(keyCode)!.isDown = false;
      }
    };

    buttonEl?.addEventListener("pointerdown", onButtonDown);
    buttonEl?.addEventListener("pointerup", onButtonUp);
    buttonEl?.addEventListener("touchmove", (e: TouchEvent) => {
      const bcr = buttonEl.getBoundingClientRect();
      if (
        e.touches[0].clientX < bcr.x || // Is left
        e.touches[0].clientX > bcr.x + bcr.width || // Is right
        e.touches[0].clientY < bcr.y || // Is above
        e.touches[0].clientY > bcr.y + bcr.height // Is below
      ) {
        onButtonUp(e);
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

export { PlayerInput };
