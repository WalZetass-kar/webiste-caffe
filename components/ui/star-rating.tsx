"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  label?: string;
  readOnly?: boolean;
  className?: string;
};

export function StarRating({ value, onChange, max = 5, label, readOnly = false, className = "" }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const currentValue = hoverValue ?? value;

  return (
    <div className={className}>
      {label ? <p className="mb-3 text-sm font-medium text-cafe-text">{label}</p> : null}
      <div className="flex items-center gap-2">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const active = starValue <= currentValue;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => !readOnly && onChange(starValue)}
              onMouseEnter={() => !readOnly && setHoverValue(starValue)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              className="text-slate-400 transition hover:text-amber-400"
              aria-label={`Rate ${starValue} stars`}
            >
              <FontAwesomeIcon
                icon={faStar}
                className={`h-6 w-6 ${active ? "text-amber-400" : "text-slate-300"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
