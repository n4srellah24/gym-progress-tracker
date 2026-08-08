"use client";

import React, { useState } from "react";
import { TRAINING_SPLIT } from "@/lib/trainingSplit";
import { getTodayISODate, formatReadableDate } from "@/lib/utils";
import { DayPickerCard } from "@/components/DayPickerCard";
import { Navbar } from "@/components/Navbar";
import { Calendar, Info } from "lucide-react";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISODate());

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] flex flex-col pb-16">
      {/* Top Frosted Navbar */}
      <Navbar />

      <main className="mx-auto w-full max-w-lg px-4 sm:max-w-xl flex-1 pt-6 space-y-6">
        {/* Date Selector Header Card */}
        <section className="rounded-[20px] border border-white/[0.06] bg-[#161618] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wider text-[#86868b]">
                Workout Date
              </p>
              <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#f5f5f7] tracking-tight mt-0.5">
                {formatReadableDate(selectedDate)}
              </h1>
            </div>

            {/* iOS Style Date Picker Button */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#242426] border border-white/[0.08] px-3.5 py-1.5 transition-colors">
              <Calendar className="h-4 w-4 text-[#0071e3]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value || getTodayISODate())}
                className="bg-transparent text-[13px] font-medium text-[#f5f5f7] focus:outline-none cursor-pointer"
                aria-label="Change workout date"
              />
            </div>
          </div>
        </section>

        {/* Training Split Cards */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-semibold text-[#86868b] tracking-tight uppercase text-xs">
              Training Split
            </h2>
            <span className="text-[12px] text-[#6e6e73]">
              5 Day Rotation
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {TRAINING_SPLIT.map((splitDay, idx) => (
              <DayPickerCard
                key={splitDay.id}
                day={splitDay}
                selectedDate={selectedDate}
                dayIndex={idx}
              />
            ))}
          </div>
        </section>

        {/* Minimal Split Info Footer */}
        <section className="rounded-[16px] border border-white/[0.04] bg-[#101012] p-4 text-center">
          <p className="text-[12px] text-[#6e6e73] leading-relaxed">
            Lower A → Upper A → Arms → Lower B → Upper B → 2 Rest Days
          </p>
        </section>
      </main>
    </div>
  );
}
