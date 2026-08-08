"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Dumbbell, Github } from "lucide-react";

interface NavbarProps {
  currentDayName?: string;
  showBack?: boolean;
  onBackClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDayName,
  showBack = false,
  onBackClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-13 max-w-lg items-center justify-between px-4 sm:max-w-xl">
        {/* Left: Back or Brand */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              type="button"
              onClick={onBackClick}
              className="apple-press -ml-1.5 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-[#0071e3] transition-colors hover:text-[#0077ed]"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              <span className="text-[15px]">Workouts</span>
            </button>
          ) : (
            <Link
              href="/"
              className="apple-press flex items-center gap-2 text-[#f5f5f7] transition-opacity hover:opacity-85"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1c1c1e] border border-white/10 text-[#f5f5f7]">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="text-[16px] font-semibold tracking-tight text-[#f5f5f7]">
                IronTrack
              </span>
            </Link>
          )}
        </div>

        {/* Center: Context */}
        {currentDayName && (
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="text-[14px] font-semibold text-[#f5f5f7] tracking-tight">
              {currentDayName}
            </span>
          </div>
        )}

        {/* Right: GitHub Direct Sync indicator */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#1c1c1e] border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#86868b]">
            <Github className="h-3 w-3 text-[#f5f5f7]" />
            <span>GitHub Sync</span>
          </span>
          <span className="sm:hidden flex h-6 w-6 items-center justify-center rounded-full bg-[#1c1c1e] border border-white/[0.08] text-[#86868b]">
            <Github className="h-3 w-3 text-[#f5f5f7]" />
          </span>
        </div>
      </div>
    </header>
  );
};
