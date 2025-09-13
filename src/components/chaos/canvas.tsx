"use client";

import { useRef, useEffect, forwardRef } from 'react';

type DoublePendulumState = {
    a1: number; // angle 1
    a2: number; // angle 2
    a1_v: number; // angular velocity 1
    a2_v: number; // angular velocity 2
};

type PendulumProps = {
    l1: number; // length 1
    l2: number; // length 2
    m1: number; // mass 1
    m2: number; // mass 2
};

type ChaosCanvasProps = {
  initialConditions: PendulumProps & { a1: number, a2: number };
  traceColor: string;
  pendulumColor: string;
  isRunning: boolean;
};

const G = 0.5; // Gravity
const TRACE_LENGTH = 500;

export const ChaosCanvas = forwardRef<HTMLCanvasElement, ChaosCanvasProps>(
  ({ initialConditions, traceColor, pendulumColor, isRunning }, ref) => {
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameId = useRef<number>();
    const state = useRef<DoublePendulumState>({
      a1: initialConditions.a1,
      a2: initialConditions.a2,
      a1_v: 0,
      a2_v: 0,
    });
    const trace = useRef<{x: number, y: number}[]>([]);

    const getCanvas = () => {
        if (ref && typeof ref !== "function") return ref.current;
        return internalRef.current;
    };

    const update = () => {
      const { l1, l2, m1, m2 } = initialConditions;
      const { a1, a2, a1_v, a2_v } = state.current;

      // Equations of motion for the double pendulum
      // From https://www.myphysicslab.com/pendulum/double-pendulum-en.html
      let num1 = -G * (2 * m1 + m2) * Math.sin(a1);
      let num2 = -m2 * G * Math.sin(a1 - 2 * a2);
      let num3 = -2 * Math.sin(a1 - a2) * m2;
      let num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * Math.cos(a1 - a2);
      let den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      let a1_a = (num1 + num2 + num3 * num4) / den;

      num1 = 2 * Math.sin(a1 - a2);
      num2 = a1_v * a1_v * l1 * (m1 + m2);
      num3 = G * (m1 + m2) * Math.cos(a1);
      num4 = a2_v * a2_v * l2 * m2 * Math.cos(a1 - a2);
      den = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      let a2_a = (num1 * (num2 + num3 + num4)) / den;

      state.current.a1_v += a1_a;
      state.current.a2_v += a2_a;
      state.current.a1 += state.current.a1_v;
      state.current.a2 += state.current.a2_v;
    };

    const draw = () => {
      const canvas = getCanvas();
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const dpr = window.devicePixelRatio || 1;
      const physicalWidth = canvas.width / dpr;
      const physicalHeight = canvas.height / dpr;
      
      const { l1, l2 } = initialConditions;
      const { a1, a2 } = state.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, physicalWidth, physicalHeight);

      const pivotX = physicalWidth / 2;
      const pivotY = physicalHeight / 2.5;

      const x1 = pivotX + l1 * Math.sin(a1);
      const y1 = pivotY + l1 * Math.cos(a1);
      const x2 = x1 + l2 * Math.sin(a2);
      const y2 = y1 + l2 * Math.cos(a2);

      // Add to trace
      trace.current.push({ x: x2, y: y2 });
      if (trace.current.length > TRACE_LENGTH) {
        trace.current.shift();
      }
      
      // Draw trace
      if (trace.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trace.current[0].x, trace.current[0].y);
        for (let i = 1; i < trace.current.length; i++) {
          ctx.lineTo(trace.current[i].x, trace.current[i].y);
        }
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw pendulum arms
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = pendulumColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw masses
      ctx.fillStyle = pendulumColor;
      ctx.beginPath();
      ctx.arc(x1, y1, initialConditions.m1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y2, initialConditions.m2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    
    const animate = () => {
      if (isRunning) {
        update();
      }
      draw();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const canvas = getCanvas();
        if (!canvas) return;
    
        const resizeHandler = () => {
            const dpr = window.devicePixelRatio || 1;
            const { width, height } = canvas.getBoundingClientRect();
            if (width === 0 || height === 0) return;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        };

        const resizeObserver = new ResizeObserver(resizeHandler);
        resizeObserver.observe(canvas);
        resizeHandler();
        
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
      state.current = {
        a1: initialConditions.a1,
        a2: initialConditions.a2,
        a1_v: 0,
        a2_v: 0,
      };
      trace.current = [];
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, [isRunning, initialConditions]);

    return (
      <canvas
        ref={el => {
          if (ref && typeof ref !== 'function') ref.current = el;
          internalRef.current = el;
        }}
        className="w-full h-full"
      />
    );
  }
);
ChaosCanvas.displayName = "ChaosCanvas";
