import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Disc, Waves, Sparkles, Radio, Sun } from "lucide-react";

type Mode = "circular" | "bars" | "particles" | "tunnel" | "radial" | "ribbon";
type Palette = "violet" | "cyberpunk" | "ocean" | "emerald" | "solar";

export const PulsePreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMode, setCurrentMode] = useState<Mode>("circular");
  const [currentPalette, setCurrentPalette] = useState<Palette>("violet");
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const modeRef = useRef(currentMode);
  modeRef.current = currentMode;

  const paletteRef = useRef(currentPalette);
  paletteRef.current = currentPalette;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Palette color lookups
    const palettes: Record<Palette, { primary: string; secondary: string; accent: string; bg: string }> = {
      violet: { primary: "#C084FC", secondary: "#818CF8", accent: "#38BDF8", bg: "#04060A" },
      cyberpunk: { primary: "#F43F5E", secondary: "#06B6D4", accent: "#FBBF24", bg: "#04060A" },
      ocean: { primary: "#0EA5E9", secondary: "#38BDF8", accent: "#67E8F9", bg: "#04060A" },
      emerald: { primary: "#10B981", secondary: "#34D399", accent: "#6EE7B7", bg: "#04060A" },
      solar: { primary: "#F59E0B", secondary: "#EF4444", accent: "#FCD34D", bg: "#04060A" },
    };

    // Particles for particle mode
    const numParticles = 64;
    const particles = Array.from({ length: numParticles }, (_, i) => ({
      angle: (i / numParticles) * Math.PI * 2,
      baseRadius: 40 + Math.random() * 80,
      speed: 0.01 + Math.random() * 0.02,
      size: 2 + Math.random() * 3,
    }));

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isPlayingRef.current) return;

      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const curPal = palettes[paletteRef.current];
      const mode = modeRef.current;

      // Soft trail fade
      ctx.fillStyle = "rgba(4, 6, 10, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Procedural synthetic FFT spectrum bins (48 bins)
      const numBins = 48;
      const bins: number[] = [];
      for (let i = 0; i < numBins; i++) {
        const freq = (i / numBins) * 4.0;
        const val =
          Math.sin(time * 2.5 + freq * 3.2) * 0.35 +
          Math.cos(time * 1.8 + freq * 1.6) * 0.35 +
          Math.sin(time * 0.8 + i * 0.4) * 0.3;
        bins.push(Math.max(0.05, Math.min(1.0, (val + 1) * 0.5)));
      }

      if (mode === "circular") {
        const radius = 55;
        ctx.save();
        ctx.translate(cx, cy);

        // Core glow circle
        ctx.beginPath();
        ctx.arc(0, 0, radius - 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(141, 131, 201, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pulsing bars
        for (let i = 0; i < numBins; i++) {
          const angle = (i / numBins) * Math.PI * 2;
          const barHeight = bins[i] * 45;
          const x1 = Math.cos(angle) * radius;
          const y1 = Math.sin(angle) * radius;
          const x2 = Math.cos(angle) * (radius + barHeight);
          const y2 = Math.sin(angle) * (radius + barHeight);

          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, curPal.secondary);
          grad.addColorStop(1, curPal.primary);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (mode === "bars") {
        const barWidth = width / numBins;
        for (let i = 0; i < numBins; i++) {
          const h = bins[i] * (height * 0.85);
          const x = i * barWidth;
          const y = height - h;

          const grad = ctx.createLinearGradient(0, height, 0, y);
          grad.addColorStop(0, curPal.secondary);
          grad.addColorStop(1, curPal.accent);

          ctx.fillStyle = grad;
          ctx.fillRect(x + 1, y, barWidth - 2, h);
        }
      } else if (mode === "particles") {
        ctx.save();
        ctx.translate(cx, cy);
        for (let i = 0; i < numParticles; i++) {
          const p = particles[i];
          p.angle += p.speed;
          const binIdx = Math.floor((i / numParticles) * numBins);
          const r = p.baseRadius + bins[binIdx] * 35;
          const px = Math.cos(p.angle) * r;
          const py = Math.sin(p.angle) * r;

          ctx.fillStyle = i % 2 === 0 ? curPal.primary : curPal.accent;
          ctx.beginPath();
          ctx.arc(px, py, p.size * (0.8 + bins[binIdx]), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (mode === "tunnel") {
        for (let ring = 0; ring < 6; ring++) {
          const r = (ring + 1) * 22 + Math.sin(time * 3 + ring) * 8;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = ring % 2 === 0 ? curPal.primary : curPal.secondary;
          ctx.lineWidth = 1.5 + (ring % 3);
          ctx.stroke();
        }
      } else if (mode === "radial") {
        ctx.save();
        ctx.translate(cx, cy);
        for (let i = 0; i < numBins; i++) {
          const len = bins[i] * 90;
          ctx.rotate((Math.PI * 2) / numBins);
          ctx.strokeStyle = curPal.accent;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(len, 0);
          ctx.stroke();
        }
        ctx.restore();
      } else if (mode === "ribbon") {
        ctx.beginPath();
        for (let i = 0; i < numBins; i++) {
          const x = (i / (numBins - 1)) * width;
          const y = cy + Math.sin(time * 3 + i * 0.25) * (bins[i] * 65);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = curPal.primary;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="flex flex-col glass-panel glass-specular rounded-2xl overflow-hidden p-5 border border-white/12 shadow-2xl">
      {/* Top Header & Simulation Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
          <span className="font-mono text-[#F1EBDD] font-medium tracking-wider">
            CANVAS 2D FFT VISUALIZER
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[11px] font-mono cursor-pointer hover:bg-white/[0.1] text-[#F1EBDD]"
            title={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? "LIVE" : "PAUSED"}</span>
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="relative my-3 flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          width={420}
          height={240}
          className="w-full h-auto max-h-[240px] block"
        />
        <div className="absolute top-2 right-2 text-[10px] font-mono text-[#A6A5AE] glass-pill px-2.5 py-0.5 pointer-events-none">
          60 FPS · FFT 48 BINS
        </div>
      </div>

      {/* Mode Controls */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#A6A5AE] uppercase tracking-wider">
            Visualization Mode:
          </span>
          <span className="text-[11px] font-mono text-[#C084FC] capitalize">{currentMode}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {(
            [
              { id: "circular", label: "Circular", icon: Disc },
              { id: "bars", label: "Bars", icon: Waves },
              { id: "particles", label: "Particles", icon: Sparkles },
              { id: "tunnel", label: "Tunnel", icon: Radio },
              { id: "radial", label: "Radial", icon: Sun },
              { id: "ribbon", label: "Ribbon", icon: Waves },
            ] as const
          ).map((m) => {
            const Icon = m.icon;
            const active = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setCurrentMode(m.id)}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-mono transition cursor-pointer ${
                  active
                    ? "bg-white/[0.15] text-[#F1EBDD] font-semibold border border-white/25 shadow-sm"
                    : "glass-pill text-[#A6A5AE] hover:text-[#F1EBDD] hover:bg-white/[0.05]"
                }`}
              >
                <Icon size={11} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Palette Selector */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10 text-xs">
        <span className="text-[11px] font-mono text-[#A6A5AE]">Palette:</span>
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: "violet", color: "#C084FC", label: "Violet" },
              { id: "cyberpunk", color: "#F43F5E", label: "Cyber" },
              { id: "ocean", color: "#0EA5E9", label: "Ocean" },
              { id: "emerald", color: "#10B981", label: "Emerald" },
              { id: "solar", color: "#F59E0B", label: "Solar" },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => setCurrentPalette(p.id)}
              className={`w-5 h-5 rounded-full border transition cursor-pointer ${
                currentPalette === p.id ? "scale-125 border-white ring-2 ring-white/25" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: p.color }}
              title={p.label}
              aria-label={`Select ${p.label} palette`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
