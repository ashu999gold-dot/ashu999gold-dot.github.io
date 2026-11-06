import React from "react";

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = "left",
}) => {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 sm:mb-16 ${isCenter ? "text-center mx-auto max-w-2xl" : "text-left max-w-3xl"}`}>
      <div
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-mono text-[#8D83C9] mb-4 shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
        <span>{badge}</span>
      </div>
      <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F1EBDD] tracking-tight leading-tight drop-shadow-md">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-[#A6A5AE] text-base sm:text-lg mt-3 leading-relaxed drop-shadow">
          {subtitle}
        </p>
      )}
    </div>
  );
};
