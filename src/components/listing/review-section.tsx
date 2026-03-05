"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { cn, formatDate } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  buyer: {
    name: string;
    image: string | null;
  };
}

interface ReviewSectionProps {
  reviews: ReviewData[];
  averageRating: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Rating breakdown bar                                               */
/* ------------------------------------------------------------------ */
function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-neutral-500 w-12 text-right shrink-0">
        {star} star
      </span>
      <div className="flex-1 h-2.5 rounded-full bg-neutral-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: (5 - star) * 0.08 }}
        />
      </div>
      <span className="text-sm text-neutral-400 w-8 shrink-0">{count}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                        */
/* ------------------------------------------------------------------ */
function EmptyReviews() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <MessageSquare className="h-7 w-7 text-neutral-300" />
      </div>
      <h4 className="text-base font-semibold text-neutral-700 mb-1">
        No reviews yet
      </h4>
      <p className="text-sm text-neutral-400 text-center max-w-xs">
        Be the first to review this listing after completing a purchase.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Single review card                                                 */
/* ------------------------------------------------------------------ */
function ReviewCard({ review }: { review: ReviewData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-5 border-b border-neutral-100 last:border-b-0"
    >
      <Avatar
        name={review.buyer.name}
        src={review.buyer.image}
        size="md"
        className="shrink-0 mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
          <h4 className="text-sm font-semibold text-neutral-800">
            {review.buyer.name}
          </h4>
          <time className="text-xs text-neutral-400">
            {formatDate(review.createdAt)}
          </time>
        </div>
        <StarRating
          value={review.rating}
          starClassName="h-3.5 w-3.5"
          className="mb-2"
        />
        {review.comment && (
          <p className="text-sm text-neutral-600 leading-relaxed">
            {review.comment}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ReviewSection                                                      */
/* ------------------------------------------------------------------ */
function ReviewSection({
  reviews,
  averageRating,
  className,
}: ReviewSectionProps) {
  const total = reviews.length;

  /* Build distribution */
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className={cn("space-y-8", className)}>
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold text-primary tracking-tight">
          Reviews
        </h2>
        {total > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-bold text-primary">
              {averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating
                value={averageRating}
                halfStars
                starClassName="h-5 w-5"
              />
              <p className="text-sm text-neutral-400 mt-0.5">
                Based on {total} review{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}
      </div>

      {total > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Rating breakdown */}
          <div className="space-y-2.5 p-5 rounded-xl bg-neutral-50 border border-neutral-100 h-fit">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Rating Breakdown
            </h3>
            {distribution.map(({ star, count }) => (
              <RatingBar
                key={star}
                star={star}
                count={count}
                total={total}
              />
            ))}
          </div>

          {/* Review list */}
          <div className="divide-y-0">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyReviews />
      )}
    </section>
  );
}

ReviewSection.displayName = "ReviewSection";

export { ReviewSection, type ReviewData };
