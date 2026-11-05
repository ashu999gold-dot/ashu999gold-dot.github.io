import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface CinematicLoaderProps {
  isLoading: boolean;
  onFinished?: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({
  isLoading,
  onFinished,
}) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isLoading && !fadingOut && !hidden) {
      setFadingOut(true);
      const timer = setTimeout(() => {
        setHidden(true);
        if (onFinished) onFinished();
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isLoading, fadingOut, hidden, onFinished]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090D] transition-opacity duration-700 pointer-events-none ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing flower valley blossom icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-[#101522] border border-[#8D83C9]/40 flex items-center justify-center shadow-lg shadow-[#8D83C9]/10">
            <Sparkles className="text-[#38BDF8] animate-pulse" size={24} />
          </div>
          <div className="absolute -inset-2 rounded-full border border-[#8D83C9]/20 animate-spin duration-1000" />
        </div>

        {/* Identity & Subtitle */}
        <h2 className="font-display font-semibold text-xl tracking-wider text-[#F1EBDD] mb-1">
          ASHUTOSH KUMAR
        </h2>
        <p className="font-mono text-xs text-[#8D83C9] tracking-widest uppercase">
          Initializing Night Flower Valley
        </p>

        {/* Subtle Progress Line */}
        <div className="w-48 h-0.5 bg-[#25264A] rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-[#38BDF8] via-[#C084FC] to-[#FDE047] animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
