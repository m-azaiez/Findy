"use client";

import { useMemo, useState } from "react";
import { type KeyboardEvent, type MouseEvent } from "react";

import { cn } from "@/lib/utils/cn";

type StarRatingInputProps = {
  className?: string;
  disabled?: boolean;
  label?: string;
  max?: number;
  name: string;
  onChange: (value: number) => void;
  value: number;
};

function clampRating(value: number, max: number) {
  return Math.min(Math.max(value, 0.5), max);
}

function toHalfStep(value: number) {
  return Math.round(value * 2) / 2;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.75l2.91 5.89 6.5.94-4.7 4.58 1.11 6.47L12 17.58l-5.82 3.05 1.11-6.47-4.7-4.58 6.5-.94L12 2.75z" />
    </svg>
  );
}

export function StarRatingInput({
  className,
  disabled = false,
  label = "Rating",
  max = 5,
  name,
  onChange,
  value
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;
  const stars = useMemo(() => Array.from({ length: max }, (_, index) => index + 1), [max]);

  function getPointerValue(starNumber: number, event: MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const nextValue = starNumber - 1 + (relativeX <= bounds.width / 2 ? 0.5 : 1);

    return clampRating(toHalfStep(nextValue), max);
  }

  function handleKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(clampRating(toHalfStep(value + 0.5), max));
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(clampRating(toHalfStep(value - 0.5), max));
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      onChange(0.5);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      onChange(max);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <input type="hidden" name={name} value={value.toFixed(1)} />
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={0.5}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value.toFixed(1)} out of ${max}`}
        onKeyDown={handleKeyboard}
        onMouseLeave={() => setHoverValue(null)}
        className={cn("inline-flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/30", disabled && "opacity-60")}
      >
        {stars.map((starNumber) => {
          const fillPercent = Math.max(0, Math.min(1, displayValue - (starNumber - 1))) * 100;

          return (
            <button
              key={starNumber}
              type="button"
              disabled={disabled}
              onMouseMove={(event) => setHoverValue(getPointerValue(starNumber, event))}
              onClick={(event) => onChange(getPointerValue(starNumber, event))}
              className="group relative h-9 w-9 rounded-md transition-transform hover:scale-105 focus-visible:outline-none"
              aria-label={`Set rating to ${Math.max(0.5, starNumber - 0.5)} to ${starNumber}`}
            >
              <StarIcon className="h-9 w-9 text-foreground/18 transition-colors group-hover:text-accent/30" />
              <span className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                <StarIcon className="h-9 w-9 text-accent-secondary" />
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium text-foreground/80">{displayValue.toFixed(1)} / 5</span>
        <span className="text-foreground/55">Half-star precision</span>
      </div>
    </div>
  );
}
