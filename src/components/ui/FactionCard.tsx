import React from "react";
import Link from "next/link";

interface FactionCardProps {
  title: string;
  subtitle: string;
  description: string;
  theme: "machine" | "outergod" | "newlondon" | "escova";
  link: string;
}

const themeStyles = {
  machine: {
    border: "border-[var(--color-machine-metal)]/30 hover:border-[var(--color-machine-neon)]",
    glow: "hover:shadow-[0_0_20px_var(--color-machine-neon)]",
    bg: "bg-black/60",
    textHover: "group-hover:text-[var(--color-machine-neon)] group-hover:text-glow-machine",
    font: "font-[family-name:var(--font-share-tech-mono)]",
    accent: "bg-[var(--color-machine-neon)]",
    pattern: "bg-[radial-gradient(ellipse_at_center,_var(--color-machine-metal)_0%,_transparent_70%)] opacity-10",
  },
  outergod: {
    border: "border-[var(--color-outergod-flesh)]/30 hover:border-[var(--color-outergod-blood)]",
    glow: "hover:shadow-[0_0_30px_var(--color-outergod-blood)]",
    bg: "bg-[#1a0505]/60",
    textHover: "group-hover:text-[#ff3333] transition-colors duration-700",
    font: "font-[family-name:var(--font-cinzel)]",
    accent: "bg-[var(--color-outergod-blood)]",
    pattern: "bg-[radial-gradient(circle_at_center,_var(--color-outergod-flesh)_0%,_transparent_50%)] opacity-20",
  },
  newlondon: {
    border: "border-[#5c4033]/40 hover:border-[var(--color-newlondon-brass)]",
    glow: "hover:shadow-[0_0_15px_var(--color-newlondon-brass)]",
    bg: "bg-[#2b1d14]/70",
    textHover: "group-hover:text-[var(--color-newlondon-brass)]",
    font: "font-serif",
    accent: "bg-[var(--color-newlondon-brass)]",
    pattern: "bg-[repeating-linear-gradient(45deg,_transparent,_transparent_10px,_rgba(180,83,9,0.1)_10px,_rgba(180,83,9,0.1)_20px)]",
  },
  escova: {
    border: "border-[var(--color-escova-neon)]/30 hover:border-[var(--color-escova-pink)]",
    glow: "hover:shadow-[0_0_25px_var(--color-escova-pink)]",
    bg: "bg-[#050014]/60",
    textHover: "group-hover:text-[var(--color-escova-pink)] group-hover:text-glow-escova",
    font: "font-[family-name:var(--font-share-tech-mono)]",
    accent: "bg-[var(--color-escova-neon)]",
    pattern: "bg-[linear-gradient(180deg,_transparent_0%,_rgba(16,185,129,0.1)_50%,_rgba(244,63,94,0.1)_100%)]",
  },
};

export default function FactionCard({ title, subtitle, description, theme, link }: FactionCardProps) {
  const styles = themeStyles[theme];

  return (
    <Link href={link} className={`group block relative overflow-hidden rounded-lg border backdrop-blur-sm transition-all duration-500 p-8 ${styles.border} ${styles.glow} ${styles.bg}`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-40 ${styles.pattern}`} />
      
      {/* Decorative Accent Line */}
      <div className={`absolute top-0 left-0 w-full h-1 ${styles.accent} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`} />

      <div className="relative z-10 flex flex-col h-full">
        <h4 className={`text-sm tracking-[0.2em] uppercase text-gray-400 mb-2 transition-colors duration-300 ${styles.font}`}>
          {subtitle}
        </h4>
        <h3 className={`text-3xl font-bold mb-4 transition-all duration-300 ${styles.font} ${styles.textHover}`}>
          {title}
        </h3>
        <div className={`w-12 h-[2px] mb-6 ${styles.accent} opacity-50 group-hover:opacity-100 group-hover:w-24 transition-all duration-500`} />
        <p className="text-gray-300 leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex-grow">
          {description}
        </p>
        
        <div className="mt-8 flex items-center justify-end">
          <span className={`text-xs uppercase tracking-wider opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ${styles.textHover} ${styles.font}`}>
            Enter Sector →
          </span>
        </div>
      </div>
    </Link>
  );
}
