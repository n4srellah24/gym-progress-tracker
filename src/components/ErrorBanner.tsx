"use client";

import React from "react";
import { AlertCircle, RotateCcw, X } from "lucide-react";

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
  isSaving: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss,
  isSaving,
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-[16px] border border-[#ff453a]/30 bg-[#1c1c1e] p-3.5 shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff453a]" />
          <div>
            <h4 className="text-[13px] font-semibold text-[#f5f5f7]">
              Save Failed
            </h4>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[#86868b] break-words">
              {error}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="apple-press -mr-1 -mt-1 p-1 text-[#6e6e73] hover:text-[#f5f5f7]"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onRetry}
          disabled={isSaving}
          className="apple-press inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#0077ed] disabled:opacity-50 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
};
