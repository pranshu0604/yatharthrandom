"use client";

import { motion } from "framer-motion";
import { Tag, Clock, Calendar, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, getDiscount, getDaysUntilExpiry } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface PriceBreakdownProps {
  originalPrice: number;
  askingPrice: number;
  expiryDate: string | null;
  duration: string | null;
  membershipType: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Expiry indicator                                                   */
/* ------------------------------------------------------------------ */
function ExpiryIndicator({ daysLeft }: { daysLeft: number }) {
  const isExpired = daysLeft <= 0;
  const isUrgent = daysLeft > 0 && daysLeft < 7;
  const isWarning = daysLeft >= 7 && daysLeft < 30;

  const color = isExpired
    ? "text-error"
    : isUrgent
      ? "text-error"
      : isWarning
        ? "text-warning"
        : "text-success";

  const bgColor = isExpired
    ? "bg-error"
    : isUrgent
      ? "bg-error"
      : isWarning
        ? "bg-warning"
        : "bg-success";

  const bgLight = isExpired
    ? "bg-error-light"
    : isUrgent
      ? "bg-error-light"
      : isWarning
        ? "bg-warning-light"
        : "bg-success-light";

  const label = isExpired
    ? "Expired"
    : isUrgent
      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left — Act fast!`
      : isWarning
        ? `${daysLeft} days remaining`
        : `${daysLeft} days remaining`;

  /* Progress bar: percentage of a 365-day window remaining */
  const pct = isExpired ? 0 : Math.min(100, (daysLeft / 365) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className={cn("h-4 w-4", color)} />
          <span className={cn("text-sm font-semibold", color)}>{label}</span>
        </div>
      </div>
      <div className={cn("h-2 rounded-full overflow-hidden", bgLight)}>
        <motion.div
          className={cn("h-full rounded-full", bgColor)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PriceBreakdown                                                     */
/* ------------------------------------------------------------------ */
function PriceBreakdown({
  originalPrice,
  askingPrice,
  expiryDate,
  duration,
  membershipType,
  className,
}: PriceBreakdownProps) {
  const discount = getDiscount(originalPrice, askingPrice);
  const savings = originalPrice - askingPrice;
  const daysLeft = getDaysUntilExpiry(expiryDate);

  return (
    <Card className={cn("border-neutral-800/80", className)}>
      <CardContent className="space-y-5">
        {/* Membership type badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            {membershipType}
          </Badge>
        </div>

        {/* Price display */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white tracking-tight">
              {formatCurrency(askingPrice)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-base text-neutral-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
              <span className="inline-flex items-center rounded-md bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                {discount}% off
              </span>
            </div>
          )}
        </div>

        {/* Savings callout */}
        {savings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2.5 rounded-xl bg-accent/5 border border-accent/10 px-4 py-3"
          >
            <Tag className="h-4 w-4 text-accent shrink-0" />
            <span className="text-sm font-medium text-accent">
              You save {formatCurrency(savings)}
            </span>
          </motion.div>
        )}

        {/* Divider */}
        <div className="h-px bg-neutral-800" />

        {/* Expiry countdown */}
        {daysLeft !== null && <ExpiryIndicator daysLeft={daysLeft} />}

        {/* Duration info */}
        {duration && (
          <div className="flex items-center gap-2.5 text-neutral-400">
            <Clock className="h-4 w-4 text-neutral-400" />
            <span className="text-sm font-medium">Duration: {duration}</span>
          </div>
        )}

        {/* CTA hint */}
        <div className="pt-1">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Contact the seller to negotiate and finalize the transfer. All
            transactions are verified by ReMemberX.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

PriceBreakdown.displayName = "PriceBreakdown";

export { PriceBreakdown };
