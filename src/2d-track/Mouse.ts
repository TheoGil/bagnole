import { Vector2 } from "three";
import { drawCrossHair } from "./render-utils";
import type { Track } from "./Track";

class Mouse {
  position: Vector2;
  canvasEl: HTMLCanvasElement;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.position = new Vector2();
    this.canvasEl = canvas;
    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  onMouseMove(e: MouseEvent) {
    // Convert "world" mouse position to "canvas space"
    const canvasBcr = this.canvasEl.getBoundingClientRect();
    this.position.set(e.clientX - canvasBcr.x, e.clientY - canvasBcr.y);
  }
}

function renderMouse(
  ctx: CanvasRenderingContext2D,
  mouse: Mouse,
  track: Track
) {
  const closestPointOnPath = track.getClosestPoint(mouse.position);
  const correctedPoint = track.getCorrectedPoint(mouse.position);

  if (closestPointOnPath) {
    ctx.setLineDash(correctedPoint ? [10, 10] : []);
    ctx.beginPath();
    ctx.strokeStyle = "#ffeb3b";
    ctx.moveTo(closestPointOnPath.x, closestPointOnPath.y);
    ctx.lineTo(mouse.position.x, mouse.position.y);
    ctx.stroke();

    drawCrossHair(
      ctx,
      closestPointOnPath.x,
      closestPointOnPath.y,
      "#ffc107",
      8
    );

    if (correctedPoint) {
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.strokeStyle = "#ffeb3b";
      ctx.moveTo(closestPointOnPath.x, closestPointOnPath.y);
      ctx.lineTo(correctedPoint.x, correctedPoint.y);
      ctx.stroke();

      drawCrossHair(ctx, correctedPoint.x, correctedPoint.y, "#ffc107", 16);
    }
  }

  drawCrossHair(
    ctx,
    mouse.position.x,
    mouse.position.y,
    "#ffc107",
    correctedPoint ? 8 : 16
  );
}

export { Mouse, renderMouse };
