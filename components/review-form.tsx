"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Star } from "lucide-react"

interface ReviewFormProps {
  bookingId: string
  workOrderId?: string | null
  customerName?: string | null
  existingReview?: {
    id: string
    rating: number
    comment: string | null
  } | null
}

export function ReviewForm({ bookingId, workOrderId, customerName, existingReview }: ReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(!!existingReview)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating.")
      return
    }
    setSubmitting(true)
    setError("")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("You must be signed in to leave a review.")
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      work_order_id: workOrderId || null,
      customer_user_id: user.id,
      customer_name: customerName || user.email,
      rating,
      comment: comment.trim() || null,
    })

    if (insertError) {
      console.log("[v0] Review submit error:", insertError.message)
      setError("Could not submit review. Please try again.")
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
    setOpen(false)
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-1 text-sm text-slate-500">
        <span>Your rating:</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`h-4 w-4 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          />
        ))}
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
      >
        Leave a Review
      </button>
    )
  }

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 sm:w-80">
      <p className="mb-2 text-sm font-medium text-slate-900">How was your cleaning?</p>
      <div className="mb-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-7 w-7 transition ${
                n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your experience (optional)..."
        rows={3}
        className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded-lg bg-teal-600 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
