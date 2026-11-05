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
      violet: { primary: "#C084FC", secondary: "#818CF8", accent: "#38BDF8", bg: "#08090D" },
      cyberpunk: { primary: "#F43F5E", secondary: "#06B6D4", accent: "#FBBF24", bg: "#08090D" },
      ocean: { primary: "#0EA5E9", secondary: "#38BDF8", accent: "#67E8F9", bg: "#050B14" },
      emerald: { primary: "#10B981", secondary: "#34D399", accent: "#6EE7B7", bg: "#05110E" },
      solar: { primary: "#F59E0B", secondary: "#EF4444", accent: "#FCD34D", bg: "#0F0B08" },
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
      ctx.fillStyle = "rgba(8, 9, 13, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Simulated audio frequency buffer (64 bins)
      const bufferLength = 48;
      const freqData = new Float32Array(bufferLength);
      const bassBeat = Math.sin(time * 3) > 0.7 ? 1.3 : 1.0;

      for (let i = 0; i < bufferLength; i++) {
        const harmonic1 = Math.sin(time * 2 + i * 0.25) * 0.5 + 0.5;
        const harmonic2 = Math.cos(time * 3.5 - i * 0.18) * 0.3 + 0.3;
        const bassWeight = Math.max(0, 1 - i / 14) * bassBeat * 0.4;
        freqData[i] = Math.min(1.0, (harmonic1 * 0.4 + harmonic2 * 0.3 + bassWeight));
      }

      ctx.save();

      if (mode === "circular") {
        // Circular Waveform Mode
        ctx.beginPath();
        const baseR = 55 * bassBeat;
        for (let i = 0; i <= bufferLength; i++) {
          const idx = i % bufferLength;
          const angle = (i / bufferLength) * Math.PI * 2;
          const r = baseR + freqData[idx] * 45;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = curPal.primary;
        ctx.lineWidth = 3;
        ctx.shadowColor = curPal.primary;
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Inner glowing ring
        ctx.beginPath();
        ctx.arc(cx, cy, baseR * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = curPal.secondary;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.stroke();
      } else if (mode === "bars") {
        // Frequency Bars Mode
        const barWidth = (width - 40) / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = freqData[i] * (height * 0.55);
          const x = 20 + i * barWidth;
          const y = height - 20 - barHeight;

          const grad = ctx.createLinearGradient(0, y, 0, height - 20);
          grad.addColorStop(0, curPal.primary);
          grad.addColorStop(1, curPal.secondary);

          ctx.fillStyle = grad;
          ctx.shadowColor = curPal.primary;
          ctx.shadowBlur = 6;
          ctx.fillRect(x, y, barWidth - 2, barHeight);
        }
      } else if (mode === "particles") {
        // Orbiting Particles Mode
        particles.forEach((p, idx) => {
          p.angle += p.speed;
          const freq = freqData[idx % bufferLength];
          const r = p.baseRadius + freq * 35;
          const x = cx + Math.cos(p.angle) * r;
          const y = cy + Math.sin(p.angle) * r;

          ctx.beginPath();
          ctx.arc(x, y, p.size * (1 + freq * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? curPal.primary : curPal.accent;
          ctx.shadowColor = curPal.primary;
          ctx.shadowBlur = 12;
          ctx.fill();
        });
      } else if (mode === "tunnel") {
        // Tunnel Rays Mode
        const rays = 24;
        for (let i = 0; i < rays; i++) {
          const angle = (i / rays) * Math.PI * 2 + time * 0.2;
          const val = freqData[i % bufferLength];
          const innerR = 15;
          const outerR = 60 + val * 85;

          const x1 = cx + Math.cos(angle) * innerR;
          const y1 = cy + Math.sin(angle) * innerR;
          const x2 = cx + Math.cos(angle) * outerR;
          const y2 = cy + Math.sin(angle) * outerR;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 2 === 0 ? curPal.primary : curPal.secondary;
          ctx.lineWidth = 2 + val * 3;
          ctx.shadowColor = curPal.accent;
          ctx.shadowBlur = 10;
          ctx.stroke();
        }
      } else if (mode === "radial") {
        // Radial Peaks
        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2;
          const val = freqData[i];
          const r1 = 30;
          const r2 = r1 + val * 65;

          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
          ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
          ctx.strokeStyle = curPal.primary;
          ctx.lineWidth = 3;
          ctx.shadowColor = curPal.secondary;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }
      } else if (mode === "ribbon") {
        // Sine Ribbon Mode
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const norm = x / width;
          const idx = Math.floor(norm * bufferLength);
          const amp = freqData[idx] * 40;
          const y = cy + Math.sin(x * 0.03 + time * 3) * amp + Math.cos(x * 0.015 - time) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = curPal.primary;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = curPal.accent;
        ctx.shadowBlur = 14;
        ctx.stroke();
      }

      ctx.restore();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="flex flex-col bg-[#08090D] border border-[#8D83C9]/20 rounded-xl overflow-hidden p-4">
      {/* Top Header & Simulation Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-[#8D83C9]/15 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
          <span className="font-mono text-[#F1EBDD] font-medium tracking-wider">
            CANVAS 2D FFT VISUALIZER
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#25264A]/50 hover:bg-[#25264A] text-[#F1EBDD] transition text-[11px] font-mono cursor-pointer"
            title={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? "LIVE" : "PAUSED"}</span>
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="relative my-3 flex items-center justify-center bg-[#050608] rounded-lg overflow-hidden border border-[#8D83C9]/10">
        <canvas
          ref={canvasRef}
          width={420}
          height={240}
          className="w-full h-auto max-h-[240px] block"
        />
        <div className="absolute top-2 right-2 text-[10px] font-mono text-[#A6A5AE] bg-black/60 px-2 py-0.5 rounded border border-white/5 pointer-events-none">
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
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-[11px] font-mono transition cursor-pointer ${
                  active
                    ? "bg-[#8D83C9]/30 text-[#F1EBDD] border border-[#8D83C9]/50"
                    : "bg-[#101522]/60 text-[#A6A5AE] hover:text-[#F1EBDD] border border-transparent"
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
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#8D83C9]/10 text-xs">
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
                currentPalette === p.id ? "scale-125 border-white ring-2 ring-white/20" : "border-transparent opacity-70 hover:opacity-100"
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
