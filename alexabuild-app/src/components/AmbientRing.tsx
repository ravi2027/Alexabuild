"use client";

import { useEffect, useRef } from "react";
import { RingState } from "@/types";

interface AmbientRingProps {
  state: RingState;
}

export default function AmbientRing({ state }: AmbientRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const barsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const numBars = 48;
    const innerR = 56;
    const outerR = 80;

    // Initialize bar heights
    if (barsRef.current.length !== numBars) {
      barsRef.current = Array.from({ length: numBars }, () => Math.random() * 0.3);
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      const isActive = state === "listening" || state === "processing" || state === "responding";
      const speed = state === "processing" ? 0.12 : state === "responding" ? 0.08 : isActive ? 0.06 : 0.02;
      const maxH = state === "processing" ? 1.0 : state === "listening" ? 0.85 : state === "responding" ? 0.7 : 0.25;

      // Update bars
      barsRef.current = barsRef.current.map((h, i) => {
        const target = isActive
          ? Math.abs(Math.sin(Date.now() * 0.003 + i * 0.4)) * maxH * (0.5 + Math.random() * 0.5)
          : Math.random() * 0.15;
        return h + (target - h) * speed;
      });

      // Draw waveform bars around ring
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2 - Math.PI / 2;
        const barH = barsRef.current[i];
        const barLen = innerR + barH * (outerR - innerR);

        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * barLen;
        const y2 = cy + Math.sin(angle) * barLen;

        // Color based on state
        let color1: string, color2: string;
        if (state === "processing") {
          color1 = `rgba(139, 92, 246, ${0.4 + barH * 0.6})`;
          color2 = `rgba(6, 182, 212, ${0.2 + barH * 0.4})`;
        } else if (state === "listening") {
          color1 = `rgba(6, 182, 212, ${0.5 + barH * 0.5})`;
          color2 = `rgba(59, 130, 246, ${0.3 + barH * 0.4})`;
        } else if (state === "responding") {
          color1 = `rgba(16, 185, 129, ${0.4 + barH * 0.6})`;
          color2 = `rgba(6, 182, 212, ${0.2 + barH * 0.4})`;
        } else {
          color1 = `rgba(6, 182, 212, ${0.15 + barH * 0.3})`;
          color2 = `rgba(99, 102, 241, ${0.1 + barH * 0.2})`;
        }

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [state]);

  const ringClass = state === "idle" ? "ring-idle" : "ring-active";

  const ringColors: Record<RingState, string> = {
    idle: "from-cyan-500/20 via-purple-500/10 to-blue-500/20",
    listening: "from-cyan-400/30 via-blue-500/20 to-cyan-400/30",
    processing: "from-purple-500/40 via-indigo-600/30 to-purple-500/40",
    responding: "from-emerald-500/30 via-cyan-500/20 to-emerald-500/30",
  };

  const stateLabel: Record<RingState, string> = {
    idle: "Ambient — Ready",
    listening: "Listening...",
    processing: "Processing...",
    responding: "Responding",
  };

  const stateColor: Record<RingState, string> = {
    idle: "text-cyan-400/70",
    listening: "text-cyan-300",
    processing: "text-purple-300",
    responding: "text-emerald-300",
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center float-anim">
        {/* Orbital dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="orbit-dot-1 absolute">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="orbit-dot-2 absolute">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="orbit-dot-3 absolute">
            <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          </div>
        </div>

        {/* Waveform canvas */}
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="absolute inset-0 w-full h-full"
          style={{ width: "200px", height: "200px" }}
        />

        {/* Main ring */}
        <div
          className={`relative w-[120px] h-[120px] rounded-full ${ringClass} bg-gradient-to-br ${ringColors[state]} border-2 border-cyan-400/30 flex items-center justify-center z-10`}
        >
          {/* Inner ring */}
          <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-purple-500/20 flex items-center justify-center">
            {/* Center icon */}
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/20 flex items-center justify-center">
              {state === "idle" && (
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-400/80" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                  <path strokeLinecap="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
                </svg>
              )}
              {state === "listening" && (
                <div className="flex gap-1 items-end">
                  {[3, 6, 4, 8, 5].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full"
                      style={{
                        height: `${h * 2}px`,
                        animation: `waveform 0.${5 + i}s ease-in-out infinite alternate`,
                        "--wave-height": `${h * 3}px`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
              {state === "processing" && (
                <div className="w-8 h-8 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />
              )}
              {state === "responding" && (
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* State label */}
      <div className={`text-sm font-medium tracking-widest uppercase mono ${stateColor[state]}`}>
        {stateLabel[state]}
      </div>

      {/* Typing dots when processing */}
      {state === "processing" && (
        <div className="flex gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      )}
    </div>
  );
}
