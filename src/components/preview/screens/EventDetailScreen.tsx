"use client";

import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  CATEGORY_TINTS,
} from "../constants";
import { MOCK_EVENTS } from "../mockEvents";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
}

export function EventDetailScreen({ eventId, onBack }: EventDetailScreenProps) {
  const event = MOCK_EVENTS.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <p className="text-[13px] text-gray-400">Event not found</p>
        <button
          onClick={onBack}
          className="text-[13px] font-medium"
          style={{ color: BRAND.yellow }}
        >
          Go back
        </button>
      </div>
    );
  }

  const categoryCode = event.categories?.[0]?.code ?? 1;
  const gradient = CATEGORY_GRADIENTS[categoryCode] ?? CATEGORY_GRADIENTS[1];
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];
  const tint = CATEGORY_TINTS[categoryCode] ?? CATEGORY_TINTS[1];

  const dateLabel = event.startDate
    ? format(new Date(event.startDate), "EEEE, MMMM d, yyyy")
    : event.isAlwaysOpen
      ? "Always open"
      : null;

  const timeLabel = event.startDate
    ? format(new Date(event.startDate), "h:mm a")
    : event.scheduleStartTime
      ? event.scheduleStartTime.substring(0, 5)
      : null;

  const address = [event.streetName, event.houseNumber, event.city]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      {/* Hero gradient */}
      <div
        className="px-4 pt-1 pb-4"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[13px] font-medium text-white/80 mb-3 active:opacity-70"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-[18px] font-bold text-white leading-snug break-words">
          {event.title}
        </h1>

        {event.organiser && (
          <p className="text-[11px] text-white/70 mt-1">
            by {event.organiser}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4">
        {/* Tag pills */}
        {(event.categories?.length > 0 ||
          event.subcategories?.length > 0 ||
          event.tags?.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.categories?.map((cat) => (
              <span
                key={cat.code}
                className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                style={{ backgroundColor: tint, color }}
              >
                {cat.name}
              </span>
            ))}
            {event.subcategories?.map((sub) => (
              <span
                key={sub.code}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
                style={{ borderColor: BRAND.border, color: BRAND.textSecondary }}
              >
                {sub.name}
              </span>
            ))}
            {event.tags?.map((tag) => (
              <span
                key={tag.code}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#FEF9C3", color: "#92400E" }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Info rows */}
        <div className="flex flex-col gap-2.5 mb-4">
          {dateLabel && (
            <div className="flex items-start gap-2.5">
              <CalendarDays size={15} className="mt-0.5 flex-shrink-0" style={{ color }} />
              <div className="min-w-0">
                <p className="text-[12px] font-medium break-words" style={{ color: BRAND.textPrimary }}>
                  {dateLabel}
                </p>
                {timeLabel && (
                  <p className="text-[11px]" style={{ color: BRAND.textSecondary }}>
                    {timeLabel}
                  </p>
                )}
              </div>
            </div>
          )}

          {address && (
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 flex-shrink-0" style={{ color }} />
              <p className="text-[12px] break-words min-w-0" style={{ color: BRAND.textPrimary }}>
                {address}
              </p>
            </div>
          )}

          {event.hasSchedule && event.scheduleStartTime && (
            <div className="flex items-start gap-2.5">
              <Clock size={15} className="mt-0.5 flex-shrink-0" style={{ color }} />
              <p className="text-[12px] break-words min-w-0" style={{ color: BRAND.textPrimary }}>
                {event.scheduleStartTime.substring(0, 5)}
                {event.scheduleEndTime && ` – ${event.scheduleEndTime.substring(0, 5)}`}
                {event.recurrence && ` (${event.recurrence})`}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-4">
            <h2
              className="text-[13px] font-bold mb-1"
              style={{ color: BRAND.textPrimary }}
            >
              About
            </h2>
            <p
              className="text-[12px] leading-relaxed break-words"
              style={{ color: BRAND.textSecondary }}
            >
              {event.description}
            </p>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col gap-2">
          {event.eventUrl && (
            <a
              href={event.eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: color }}
            >
              <ExternalLink size={14} />
              Visit Website
            </a>
          )}
          {event.bookingUrl && (
            <a
              href={event.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold border transition-opacity active:opacity-80"
              style={{ borderColor: color, color }}
            >
              Book Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
