import type { Bezier } from "bezier-js";

function drawCrossHair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color = "green",
  size = 15,
  thickness = 3
) {
  const halfSize = size / 2;
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = thickness;
  ctx.strokeStyle = color;
  ctx.moveTo(x - halfSize, y - halfSize);
  ctx.lineTo(x + halfSize, y + halfSize);
  ctx.moveTo(x + halfSize, y - halfSize);
  ctx.lineTo(x - halfSize, y + halfSize);
  ctx.stroke();
  ctx.restore();
}

function renderBeziers(ctx: CanvasRenderingContext2D, beziers: Bezier[]) {
  ctx.beginPath();

  ctx.moveTo(beziers[0].points[0].x, beziers[0].points[0].y);

  beziers.forEach((bezier) => {
    switch (bezier.points.length) {
      case 3:
        ctx.quadraticCurveTo(
          bezier.points[1].x,
          bezier.points[1].y,
          bezier.points[2].x,
          bezier.points[2].y
        );
        break;
      case 4:
        ctx.bezierCurveTo(
          bezier.points[1].x,
          bezier.points[1].y,
          bezier.points[2].x,
          bezier.points[2].y,
          bezier.points[3].x,
          bezier.points[3].y
        );
        break;
      default:
        break;
    }
  });

  ctx.stroke();
}

export { drawCrossHair, renderBeziers };
