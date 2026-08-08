"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirmLeave: () => void;
  onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onConfirmLeave,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xs rounded-[20px] border border-white/[0.08] bg-[#1c1c1e] p-5 text-center shadow-2xl">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ff453a]/15 text-[#ff453a]">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h3 className="text-[17px] font-semibold text-[#f5f5f7]">
          Discard Workout?
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-[#86868b]">
          You have uncommitted sets logged in this session. If you leave now, they will be lost.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirmLeave}
            className="apple-press w-full rounded-full bg-[#ff453a] py-2.5 text-[14px] font-semibold text-white hover:bg-[#ff554a] transition-colors"
          >
            Discard & Leave
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="apple-press w-full rounded-full bg-[#2c2c2e] py-2.5 text-[14px] font-medium text-[#f5f5f7] hover:bg-[#343438] transition-colors"
          >
            Keep Editing
          </button>
        </div>
      </div>
    </div>
  );
};
