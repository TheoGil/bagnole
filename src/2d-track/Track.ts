import {
  parseSVG,
  makeAbsolute,
  type CurveToCommandMadeAbsolute,
} from "svg-path-parser";
import {
  CubicBezierCurve,
  CurvePath,
  LineCurve,
  Vector2,
  type Vector2Like,
} from "three";
import { Bezier } from "bezier-js";
import { renderBeziers } from "./render-utils";

class Track {
  width: number;
  curvePath: CurvePath<Vector2>;
  beziers: Bezier[];

  constructor(options: { rawSvg: string; width: number }) {
    this.width = options.width;
    this.curvePath = new CurvePath<Vector2>();
    this.beziers = [];

    this.computeTrack(options.rawSvg);
  }

  extractCommandsFromRawSvg(rawSvg: string) {
    const template = document.createElement("template");
    template.innerHTML = rawSvg;

    const svgEl = template.content.querySelector("svg");
    if (!svgEl) throw new Error("No svg element found");

    const pathEl = svgEl.querySelector("path");
    if (!pathEl) throw new Error("No path element found");

    const d = pathEl.getAttribute("d");
    if (!d) throw new Error("No d attribute found on path");

    return makeAbsolute(parseSVG(d));
  }

  computeTrack(rawSvg: string) {
    const commands = this.extractCommandsFromRawSvg(rawSvg);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      switch (commands[i].command) {
        case "lineto":
        case "closepath":
          (() => {
            const curve = new LineCurve(
              new Vector2(command.x0, command.y0),
              new Vector2(command.x, command.y)
            );

            this.curvePath.add(curve);

            // bezier-js does not have the notion of "LineCurve" like threejs does.
            // since I want consistency, for straight lines, I'll be using a cubic bezier curve
            // where the control point is the midpoint of the segment.
            const midPoint = {
              x: (command.x0 + command.x) / 2,
              y: (command.y0 + command.y) / 2,
            };

            const bezier = new Bezier([
              {
                x: command.x0,
                y: command.y0,
              },
              midPoint,
              {
                x: command.x,
                y: command.y,
              },
            ]);

            this.beziers.push(bezier);
          })();
          break;
        case "curveto":
          (() => {
            const curve = new CubicBezierCurve(
              new Vector2(command.x0, command.y0),
              new Vector2(
                (command as CurveToCommandMadeAbsolute).x1,
                (command as CurveToCommandMadeAbsolute).y1
              ),
              new Vector2(
                (command as CurveToCommandMadeAbsolute).x2,
                (command as CurveToCommandMadeAbsolute).y2
              ),
              new Vector2(command.x, command.y)
            );

            this.curvePath.add(curve);

            const bezier = new Bezier([
              {
                x: command.x0,
                y: command.y0,
              },
              {
                x: (command as CurveToCommandMadeAbsolute).x1,
                y: (command as CurveToCommandMadeAbsolute).y1,
              },
              {
                x: (command as CurveToCommandMadeAbsolute).x2,
                y: (command as CurveToCommandMadeAbsolute).y2,
              },
              {
                x: command.x,
                y: command.y,
              },
            ]);

            this.beziers.push(bezier);
          })();
          break;
        default:
          break;
      }
    }
  }

  // https://pomax.github.io/bezierjs/#project
  getClosestSection(point: Vector2Like) {
    const sortedSections = [...this.beziers].sort((a, b) => {
      const projectedA = new Vector2().copy(a.project(point));
      const projectedB = new Vector2().copy(b.project(point));

      return projectedA.sub(point).length() - projectedB.sub(point).length();
    });

    if (sortedSections.length > 0) {
      return sortedSections[0];
    }

    return null;
  }

  getClosestPoint(point: Vector2Like) {
    const bezier = this.getClosestSection(point);

    if (bezier) {
      return new Vector2().copy(
        bezier.project({
          x: point.x,
          y: point.y,
        })
      );
    }

    return null;
  }

  getCorrectedPoint(point: Vector2Like) {
    const closestPoint = this.getClosestPoint(point);

    if (closestPoint) {
      // Distance between given point and its closest point on the track
      const difference = new Vector2().subVectors(point, closestPoint);

      // Since closestPoint sits in the middle of the track,
      // If distance is greater than half of track width,
      // it means that point is outside of the track boundaries.
      if (difference.length() > this.width / 2) {
        // We can get maxAllowedDistance by setting the length of the difference vector
        // to the maximum distance point can be from closestPoint (ie half of track width)
        const maxAllowedDifference = difference
          .clone()
          .setLength(this.width / 2);

        // Adding maxAllowedDifference to closestPoint gives us the corrected input position
        // as if the track were surrounded by invisible walls that point cannot go past.
        return closestPoint.clone().add(maxAllowedDifference);
      }
    }
  }
}

function renderTrack(ctx: CanvasRenderingContext2D, track: Track) {
  const COLOR_TRACK = "#9f9f9f";
  const COLOR_BORDER_1 = "#df0000";
  const COLOR_BORDER_2 = "#efefef";
  const BORDER_WIDTH = 2;

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.lineWidth = track.width;
  ctx.strokeStyle = COLOR_TRACK;
  renderBeziers(ctx, track.beziers);

  const outerBorder = track.beziers
    .map((bezier) => bezier.offset(track.width / 2) as Bezier[])
    .flat();

  const innerBorder = track.beziers
    .map((bezier) => bezier.offset(-track.width / 2) as Bezier[])
    .flat();

  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeStyle = COLOR_BORDER_1;
  ctx.setLineDash([]);

  ctx.beginPath();
  renderBeziers(ctx, outerBorder);

  ctx.beginPath();
  renderBeziers(ctx, innerBorder);

  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeStyle = COLOR_BORDER_2;
  ctx.setLineDash([10, 10]);

  ctx.beginPath();
  renderBeziers(ctx, outerBorder);

  ctx.beginPath();
  renderBeziers(ctx, innerBorder);

  const midLine = track.beziers
    .map((bezier) => bezier.offset(0) as Bezier[])
    .flat();

  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeStyle = COLOR_BORDER_2;
  ctx.setLineDash([25, 50]);

  ctx.beginPath();
  renderBeziers(ctx, midLine);
}

export { Track, renderTrack };
