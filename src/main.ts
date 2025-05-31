import {
  BoxGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  // Vector2,
  WebGLRenderer,
} from "three";
// import { Bagnole } from "./bagnole";
import "./style.css";

// import { addMainLoopEffect, keyboardStore } from "@manapotion/vanilla";

import { OrbitControls } from "three/examples/jsm/Addons.js";

// class Keyboard {
//   keys: Map<
//     KeyboardEvent["code"],
//     {
//       isDown: boolean;
//       timeStamp: number;
//     }
//   >;

//   inputVector = new Vector2();

//   constructor() {
//     this.onKeyDown = this.onKeyDown.bind(this);
//     this.onKeyUp = this.onKeyUp.bind(this);

//     document.addEventListener("keydown", this.onKeyDown);
//     document.addEventListener("keyup", this.onKeyUp);

//     this.keys = new Map<
//       KeyboardEvent["code"],
//       {
//         isDown: boolean;
//         timeStamp: number;
//       }
//     >();
//   }

//   onKeyDown(e: KeyboardEvent) {
//     this.keys.set(e.code, { isDown: true, timeStamp: e.timeStamp });
//   }

//   onKeyUp(e: KeyboardEvent) {
//     if (this.keys.get(e.code)) {
//       this.keys.get(e.code)!.isDown = false;
//     }
//   }

//   updateInputVector() {
//     let y = 0;

//     if (
//       this.keys.get("ArrowDown")?.isDown &&
//       !this.keys.get("ArrowUp")?.isDown
//     ) {
//       y = 1;
//     } else if (
//       !this.keys.get("ArrowDown")?.isDown &&
//       this.keys.get("ArrowUp")?.isDown
//     ) {
//       y = -1;
//     } else if (
//       this.keys.get("ArrowDown")?.isDown &&
//       this.keys.get("ArrowUp")?.isDown
//     ) {
//       y =
//         this.keys.get("ArrowDown")!.timeStamp >
//         this.keys.get("ArrowUp")!.timeStamp
//           ? 1
//           : -1;
//     }

//     let x = 0;

//     if (
//       this.keys.get("ArrowRight")?.isDown &&
//       !this.keys.get("ArrowLeft")?.isDown
//     ) {
//       x = 1;
//     } else if (
//       !this.keys.get("ArrowRight")?.isDown &&
//       this.keys.get("ArrowLeft")?.isDown
//     ) {
//       x = -1;
//     } else if (
//       this.keys.get("ArrowRight")?.isDown &&
//       this.keys.get("ArrowLeft")?.isDown
//     ) {
//       x =
//         this.keys.get("ArrowRight")!.timeStamp >
//         this.keys.get("ArrowLeft")!.timeStamp
//           ? 1
//           : -1;
//     }

//     this.inputVector.set(x, y);
//   }
// }

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const WIDTH = 1;
const LENGTH = 2;

const geometry = new BoxGeometry(WIDTH, WIDTH, LENGTH);
const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new Mesh(geometry, material);

const frontWheelGeometry = new SphereGeometry(WIDTH / 2);
const frontWheelmaterial = new MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const frontWheel = new Mesh(frontWheelGeometry, frontWheelmaterial);
// frontWheel.position.set(LENGTH / 2, 0, 0);

const backWheelGeometry = new SphereGeometry(WIDTH / 2);
const backWheelmaterial = new MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true,
});
const backWheel = new Mesh(backWheelGeometry, backWheelmaterial);
// backWheel.position.set(-LENGTH / 2, 0, 0);

const bagnole3d = new Group();
scene.add(cube);
scene.add(frontWheel);
scene.add(backWheel);
cube.rotation.y = MathUtils.degToRad(90);
scene.add(bagnole3d);

camera.position.z = -50;
new OrbitControls(camera, renderer.domElement);

// keyboardStore.subscribe((state) => {
//   console.log(state);
// });

// const keyboard = new Keyboard();

// const bagnole = new Bagnole({
//   width: WIDTH,
//   length: LENGTH,
// });

// addMainLoopEffect(({ delta, elapsed }) => {
//   keyboard.updateInputVector();

//   bagnole.update({
//     deltaTime: delta,
//     normalizedAcceleration: -keyboard.inputVector.y,
//     normalizedSteering: keyboard.inputVector.x,
//   });

//   //   bagnole3d.position.set(bagnole.position.x, 0, bagnole.position.y);
//   //   bagnole3d.rotation.y = bagnole.angle;

//   cube.position.set(bagnole.position.x, 0, bagnole.position.y);
//   cube.rotation.y = -bagnole.angle;

//   frontWheel.position.set(
//     bagnole.frontWheelPosition.x,
//     0,
//     bagnole.frontWheelPosition.y
//   );

//   backWheel.position.set(
//     bagnole.backWheelPosition.x,
//     0,
//     bagnole.backWheelPosition.y
//   );

//   renderer.render(scene, camera);
// });
