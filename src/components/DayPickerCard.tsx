"use client";

import React from "react";
import Link from "next/link";
import { SplitDay } from "@/types/workout";
import { ChevronRight } from "lucide-react";

interface DayPickerCardProps {
  day: SplitDay;
  selectedDate: string;
  dayIndex: number;
}

export const DayPickerCard: React.FC<DayPickerCardProps> = ({
  day,
  selectedDate,
  dayIndex,
}) => {
  const totalDefaultSets = day.exercises.reduce(
    (acc, ex) => acc + ex.defaultSets,
    0
  );

  return (
    <Link
      href={`/session/${day.id}?date=${selectedDate}`}
      className="apple-press group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#161618] p-5 transition-colors duration-150 hover:bg-[#1a1a1c] hover:border-white/[0.1]"
    >
      <div>
        {/* Top Header: Day Badge & Set Count */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#242426] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Day {dayIndex + 1}
            </span>
            <span className="text-[12px] font-normal text-[#6e6e73]">
              {day.exercises.length} exercises
            </span>
          </div>

          <div className="flex items-center text-[12px] font-normal text-[#86868b]">
            <span>~{totalDefaultSets} sets</span>
          </div>
        </div>

        {/* Title & Focus */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold tracking-tight text-[#f5f5f7] transition-colors">
              {day.name}
            </h2>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#242426] text-[#86868b] group-hover:text-[#0071e3] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-[#86868b] mt-0.5">
            {day.focus}
          </p>
        </div>

        {/* Exercises Preview Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {day.exercises.map((ex) => (
            <span
              key={ex.name}
              className="inline-flex items-center gap-1 rounded-[8px] bg-[#1f1f22] border border-white/[0.04] px-2.5 py-1 text-[12px] text-[#a1a1a6]"
            >
              <span className="truncate max-w-[150px]">{ex.name}</span>
              <span className="text-[11px] font-medium text-[#6e6e73]">
                ×{ex.defaultSets}
              </span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
