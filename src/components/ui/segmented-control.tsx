'use client';

import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: { value: string; label: string; icon?: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="bg-surface-container-high p-1 rounded-lg border border-outline-variant/50 inline-flex flex-wrap sm:flex-nowrap w-full sm:w-auto">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-4 py-2 text-label-md font-label-md flex items-center justify-center gap-2 transition-all duration-200 ease-in-out flex-1 sm:flex-none",
              isActive
                ? "bg-surface text-primary shadow-sm rounded-md"
                : "text-on-surface-variant hover:text-primary rounded-md"
            )}
          >
            {option.icon && <span>{option.icon}</span>}
            <span className="whitespace-nowrap">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
