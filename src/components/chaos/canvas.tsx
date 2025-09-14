
"use client";

import { useRef, useEffect, forwardRef } from 'react';

type DoublePendulumState = {
    a1: number;
    a2: number;
    a1_v: number;
    a2_v: number;
};

type PendulumProps = {
    id: number;
    l1: number;
    l2: number;
    m1: number;
    m2: number;
    a1: number;
    a2: number;
    traceColor: string;
    pendulumColor: string;
};

type ChaosCanvasProps = {
  systems: PendulumProps[];
  isRunning: boolean;
  zoom: number;
};

const G = 0.5;
const TRACE_LENGTH = 500;

type SystemState = {
    props: PendulumProps;
    state: DoublePendulumState;
    trace: {x: number, y: number}[];
}

export const ChaosCanvas = forwardRef<HTMLCanvasElement, ChaosCanvasProps>(
  ({ systems, isRunning, zoom }, ref) => {
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameId = useRef<number>();
    const systemStates = useRef<Map<number, SystemState>>(new Map());

    const getCanvas = () => {
        if (ref && typeof ref !== "function") return ref.current;
        return internalRef.current;
    };

    const update = () => {
        systemStates.current.forEach((sys) => {
            const { l1, l2, m1, m2 } = sys.props;
            const { a1, a2, a1_v, a2_v } = sys.state;

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

            sys.state.a1_v += a1_a;
            sys.state.a2_v += a2_a;
            sys.state.a1 += sys.state.a1_v;
            sys.state.a2 += sys.state.a2_v;
        });
    };

    const draw = () => {
      const canvas = getCanvas();
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const dpr = window.devicePixelRatio || 1;
      const physicalWidth = canvas.width;
      const physicalHeight = canvas.height;
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;
      
      ctx.save();
      ctx.clearRect(0, 0, physicalWidth, physicalHeight);
      ctx.scale(dpr * zoom, dpr * zoom);


      const pivotX = logicalWidth / (2 * zoom);
      const pivotY = logicalHeight / (2.5 * zoom);

      systemStates.current.forEach((sys) => {
          const { l1, l2, m1, m2, traceColor, pendulumColor } = sys.props;
          const { a1, a2 } = sys.state;

          const x1 = pivotX + l1 * Math.sin(a1);
          const y1 = pivotY + l1 * Math.cos(a1);
          const x2 = x1 + l2 * Math.sin(a2);
          const y2 = y1 + l2 * Math.cos(a2);

          sys.trace.push({ x: x2, y: y2 });
          if (sys.trace.length > TRACE_LENGTH) {
            sys.trace.shift();
          }
          
          if (sys.trace.length > 1) {
            ctx.beginPath();
            ctx.moveTo(sys.trace[0].x, sys.trace[0].y);
            for (let i = 1; i < sys.trace.length; i++) {
              ctx.lineTo(sys.trace[i].x, sys.trace[i].y);
            }
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = 2 ;
            ctx.globalAlpha = 0.7;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }

          ctx.beginPath();
          ctx.moveTo(pivotX, pivotY);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = pendulumColor;
          ctx.lineWidth = 3 ;
          ctx.stroke();
          
          ctx.fillStyle = pendulumColor;
          ctx.beginPath();
          ctx.arc(x1, y1, m1 , 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x2, y2, m2 , 0, Math.PI * 2);
          ctx.fill();
      });
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
      // Initialize or update system states
      const newSystemStates = new Map<number, SystemState>();
      for (const sysProps of systems) {
          const existing = systemStates.current.get(sysProps.id);
          if (existing) {
              // Preserve trace and physics state, but update props (like colors)
              existing.props = sysProps;
              newSystemStates.set(sysProps.id, existing);
          } else {
              // New system, initialize it
              newSystemStates.set(sysProps.id, {
                  props: sysProps,
                  state: {
                      a1: sysProps.a1,
                      a2: sysProps.a2,
                      a1_v: 0,
                      a2_v: 0,
                  },
                  trace: [],
              });
          }
      }
      systemStates.current = newSystemStates;

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, [isRunning, systems, zoom]);

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
