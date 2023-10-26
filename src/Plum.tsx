import { useEffect, useRef } from "react";

type Point = { x: number, y: number };
type Branch = { start: Point, length: number, theta: number };

function Plum() {
  const WIDTH = 600;
  const HEIGHT = 600;
  const CHANCE = 0.4;
  const DEPTH = 3;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pendingTasks = Array<() => unknown>();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#888';

    const lineTo = (p1: Point, p2: Point): void => {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    const getEndPoint = (b: Branch): Point => {
      const { start: { x, y }, length, theta } = b;
      return {
        x: x + length * Math.cos(theta),
        y: y + length * Math.sin(theta),
      }
    }

    const drawBranch = (b: Branch): void => {
      lineTo(b.start, getEndPoint(b));
    };

    const step = (b: Branch, depth = 0) => {
      const end = getEndPoint(b);
      drawBranch(b);

      if (depth < DEPTH || Math.random() < CHANCE) {
        pendingTasks.push(() => step({
          start: end,
          length: b.length + (Math.random() * 10 - 5),
          theta: b.theta - 0.3 * Math.random(),
        }, depth + 1))
      }

      if (depth < DEPTH || Math.random() < CHANCE) {
        pendingTasks.push(() => step({
          start: end,
          length: b.length + (Math.random() * 10 - 5),
          theta: b.theta + 0.3 * Math.random(),
        }, depth + 1))
      }
    }

    const frame = () => {
      const tasks = [...pendingTasks];
      pendingTasks.length = 0;
      tasks.forEach(fn => fn());
    }

    const startFrame = (count = 0) => {
      requestAnimationFrame(() => {
        if (count % 5 === 0)
          frame();
        startFrame(count + 1);
      });
    }

    const init = () => {
      step({
        start: { x: WIDTH / 2, y: HEIGHT },
        length: 20,
        theta: -Math.PI / 2,
      });
    }

    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    init();
    startFrame();
  }, [canvasRef, pendingTasks])


  return (
    <>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}/>
    </>
  )
}

export default Plum;
