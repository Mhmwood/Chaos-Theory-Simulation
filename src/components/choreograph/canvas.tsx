"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import type { FractalParams } from "./choreograph-app";

export type Point = { x: number; y: number };

type ChoreographCanvasProps = {
  params: FractalParams;
  onControlPointsChange: (points: Point[]) => void;
};

const CONTROL_POINT_RADIUS = 10;
const CONTROL_POINT_HOVER_RADIUS = 14;

export const ChoreographCanvas = forwardRef<HTMLCanvasElement, ChoreographCanvasProps>(
  ({ params, onControlPointsChange }, ref) => {
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameId = useRef<number>();
    const transitionStartTime = useRef<number | null>(null);
    const transitionDuration = 500; // ms for smooth transition

    const previousParams = useRef<FractalParams>(params);
    const [draggingPointIndex, setDraggingPointIndex] = useState<number | null>(null);
    const [hoveringPointIndex, setHoveringPointIndex] = useState<number | null>(null);

    const getCanvas = () => {
      if (ref && typeof ref !== "function") return ref.current;
      return internalRef.current;
    };
    
    const draw = (ctx: CanvasRenderingContext2D, t: number) => {
      const canvas = ctx.canvas;
      const dpr = window.devicePixelRatio || 1;
      const physicalWidth = canvas.width / dpr;
      const physicalHeight = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "hsl(var(--background))";
      ctx.fillRect(0, 0, physicalWidth, physicalHeight);

      const lerp = (a: number, b: number, alpha: number) => a + (b - a) * alpha;
      const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
      const progress = transitionStartTime.current === null ? 1 : easeOutCubic(Math.min((t - transitionStartTime.current) / transitionDuration, 1));
      
      const areControlPointsEqual = (a: Point[], b: Point[]) => a.length === b.length && a.every((p, i) => p.x === b[i].x && p.y === b[i].y);

      const isTransitioning = progress < 1;
      const isDragging = draggingPointIndex !== null;

      // Use linear interpolation during drag for responsiveness, otherwise ease out
      const dragProgress = isDragging ? 1 : progress;

      const currentParams = {
        ...params,
        angle: lerp(previousParams.current.angle, params.angle, isTransitioning ? progress : 1),
        scale: lerp(previousParams.current.scale, params.scale, isTransitioning ? progress : 1),
        controlPoints: areControlPointsEqual(params.controlPoints, previousParams.current.controlPoints) && !isTransitioning ? params.controlPoints : params.controlPoints.map((p, i) => ({
            x: lerp(previousParams.current.controlPoints[i]?.x ?? p.x, p.x, dragProgress),
            y: lerp(previousParams.current.controlPoints[i]?.y ?? p.y, p.y, dragProgress),
        })),
      };

      const startPoint = { x: physicalWidth / 2, y: physicalHeight };
      const initialLength = physicalHeight / 4.5;

      drawBranch(ctx, startPoint.x, startPoint.y, -90, initialLength, params.iterations, currentParams);

      params.controlPoints.forEach((p, index) => {
        const x = p.x * physicalWidth;
        const y = p.y * physicalHeight;
        const isPointDragging = draggingPointIndex === index;
        const isPointHovering = hoveringPointIndex === index;

        ctx.beginPath();
        ctx.arc(x, y, isPointHovering || isPointDragging ? CONTROL_POINT_HOVER_RADIUS : CONTROL_POINT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = isPointDragging ? "hsl(var(--primary))" : "hsl(var(--accent))";
        ctx.globalAlpha = isPointHovering || isPointDragging ? 1.0 : 0.8;
        ctx.fill();
        ctx.strokeStyle = "hsla(var(--primary-foreground), 0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame((newTime) => draw(ctx, newTime));
      } else if (!isDragging) {
        transitionStartTime.current = null;
        previousParams.current = params;
      }
    };

    const drawBranch = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number, depth: number, currentParams: FractalParams) => {
      if (depth === 0 || length < 1) return;

      const endX = x + length * Math.cos((angle * Math.PI) / 180);
      const endY = y + length * Math.sin((angle * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      const colorIndex = (params.iterations - depth) % params.colorPalette.length;
      ctx.strokeStyle = params.colorPalette[colorIndex];
      ctx.lineWidth = Math.max(1, depth / 1.5);
      ctx.lineCap = "round";
      ctx.stroke();

      const newLength = length * currentParams.scale;
      const angle1 = currentParams.controlPoints[0] ? (currentParams.controlPoints[0].x - 0.5) * 2 * currentParams.angle : 0;
      const angle2 = currentParams.controlPoints[1] ? (currentParams.controlPoints[1].y - 0.5) * 2 * currentParams.angle : 0;

      drawBranch(ctx, endX, endY, angle - currentParams.angle + angle1, newLength, depth - 1, currentParams);
      drawBranch(ctx, endX, endY, angle + currentParams.angle + angle2, newLength, depth - 1, currentParams);
    };

    useEffect(() => {
      const canvas = getCanvas();
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const changedKeys = Object.keys(params).filter(k => params[k as keyof FractalParams] !== previousParams.current[k as keyof FractalParams]);
      if(changedKeys.length > 0 && draggingPointIndex === null){
        transitionStartTime.current = performance.now();
      }

      animationFrameId.current = requestAnimationFrame((t) => draw(ctx, t));
      
      return () => { if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [params]);
    
    useEffect(() => {
        const canvas = getCanvas();
        if (!canvas) return;
    
        const resizeHandler = () => {
            const dpr = window.devicePixelRatio || 1;
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
                animationFrameId.current = requestAnimationFrame((t) => draw(ctx, t));
            }
        };

        const resizeObserver = new ResizeObserver(resizeHandler);
        resizeObserver.observe(canvas);
        resizeHandler();
        
        return () => resizeObserver.disconnect();
    }, []);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = getCanvas();
        if (!canvas) return {x: 0, y: 0};
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePos(e);
      const canvas = getCanvas();
      if (!canvas) return;
      
      for (let i = 0; i < params.controlPoints.length; i++) {
        const p = params.controlPoints[i];
        const px = p.x * canvas.getBoundingClientRect().width;
        const py = p.y * canvas.getBoundingClientRect().height;
        const dist = Math.sqrt((pos.x - px) ** 2 + (pos.y - py) ** 2);
        if (dist <= CONTROL_POINT_HOVER_RADIUS) {
          setDraggingPointIndex(i);
          previousParams.current = params;
          return;
        }
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePos(e);
      const canvas = getCanvas();
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();

      if (draggingPointIndex !== null) {
        const newPoints = [...params.controlPoints];
        newPoints[draggingPointIndex] = { x: Math.max(0, Math.min(1, pos.x / width)), y: Math.max(0, Math.min(1, pos.y / height)) };
        onControlPointsChange(newPoints);
      } else {
         let hovering = false;
         for (let i = 0; i < params.controlPoints.length; i++) {
            const p = params.controlPoints[i];
            const px = p.x * width;
            const py = p.y * height;
            const dist = Math.sqrt((pos.x - px) ** 2 + (pos.y - py) ** 2);
            if (dist <= CONTROL_POINT_HOVER_RADIUS) {
                setHoveringPointIndex(i);
                hovering = true;
                break;
            }
        }
        if (!hovering) setHoveringPointIndex(null);
      }
    };
    
    const handleMouseUp = () => {
      if (draggingPointIndex !== null) {
        setDraggingPointIndex(null);
        previousParams.current = params;
      }
    };

    const handleMouseLeave = () => {
        handleMouseUp();
        setHoveringPointIndex(null);
    };

    return (
      <canvas
        ref={(el) => {
          if (ref && typeof ref !== 'function') ref.current = el;
          internalRef.current = el;
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full"
        style={{ cursor: draggingPointIndex !== null ? 'grabbing' : hoveringPointIndex !== null ? 'pointer' : 'default' }}
      />
    );
  }
);
ChoreographCanvas.displayName = "ChoreographCanvas";
