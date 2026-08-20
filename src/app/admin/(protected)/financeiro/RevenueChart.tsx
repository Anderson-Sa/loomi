"use client";

import { useState } from "react";
import { formatPriceCents } from "@/lib/format";

type Point = { label: string; totalCents: number };

export function RevenueChart({ points }: { points: Point[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...points.map((p) => p.totalCents));

  return (
    <div className="flex gap-3">
      {points.map((point, index) => {
        const heightPct = Math.max(2, (point.totalCents / max) * 100);
        const isHovered = hovered === index;
        return (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="relative flex h-40 w-full items-end justify-center"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered && (
                <div className="absolute -top-8 z-10 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white">
                  {formatPriceCents(point.totalCents)}
                </div>
              )}
              <div
                className="w-full max-w-6 rounded-t transition-colors"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: isHovered ? "var(--brand-dark)" : "var(--brand)",
                }}
              />
            </div>
            <span className="text-xs text-neutral-500">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}
