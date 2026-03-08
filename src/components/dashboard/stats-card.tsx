"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
  delay?: number;
}

function StatsCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  className,
  delay = 0,
}: StatsCardProps) {
  return (
    <ScrollReveal delay={delay} direction="up">
      <Card className={cn("p-6", className)}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-500 truncate">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "mt-1 text-sm font-medium",
                  trend.positive ? "text-success" : "text-error",
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4 p-3 rounded-xl bg-accent/15 text-accent">
            {icon}
          </div>
        </div>
      </Card>
    </ScrollReveal>
  );
}

StatsCard.displayName = "StatsCard";

export { StatsCard };
