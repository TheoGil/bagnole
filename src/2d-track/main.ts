import rawSvgTrack from "./Mario Circuit 1.svg?raw";
import { renderVehicle2D, Vehicle } from "./Vehicle";
import { PlayerInput } from "./PlayerInput";
import { renderTrack, Track } from "./Track";
import "./style.css";
import { Mouse, renderMouse } from "./Mouse";

// Those number are the SVG artboard width and height.
// I know those because I've authored the SVG myself.
// TODO: Dynamically get the data from the SVG file.
const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 1000;

const track = new Track({
  rawSvg: rawSvgTrack,
  width: 100,
});

const canvasEl = document.createElement("canvas")!;
canvasEl.width = WORLD_WIDTH;
canvasEl.height = WORLD_HEIGHT;
const ctx = canvasEl.getContext("2d")!;
document.body.appendChild(canvasEl);
// canvasEl.style.position = "absolute";
// canvasEl.style.top = "0px";
// canvasEl.style.left = "0px";

const mouse = new Mouse({ canvas: canvasEl });

const playerInput = new PlayerInput();

const vehicle = new Vehicle();
vehicle.position;
track.curvePath.getPoint(0, vehicle.position);

function animate() {
  playerInput.updateInputVector();
  vehicle.update(playerInput.inputVector);
  const correctedVehiclePosition = track.getCorrectedPoint(vehicle.position);
  if (correctedVehiclePosition) {
    vehicle.position.copy(correctedVehiclePosition);
  }

  ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  //   track.beziers.forEach((bezier) => {
  //     renderTrackSectionOffset(bezier, track.width / 2);
  //     renderTrackSectionOffset(bezier, -track.width / 2);
  //   });

  renderTrack(ctx, track);
  renderVehicle2D(ctx, vehicle);
  renderMouse(ctx, mouse, track);

  requestAnimationFrame(animate);
}

animate();
