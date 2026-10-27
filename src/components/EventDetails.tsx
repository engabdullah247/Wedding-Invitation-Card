import { wedding } from "@/config/wedding";
import { PinIcon } from "./Ornaments";
import { Reveal } from "./Reveal";

export function EventDetails() {
  const { event } = wedding;
  return (
    <section className="event" aria-labelledby="event-title">
      <Reveal className="event__inner">
        <p className="eyebrow eyebrow--light">Celebration details</p>
        <h2 id="event-title" className="section-title section-title--light">
          Join us for the wedding
        </h2>

        <div className="event__date" aria-label={`${event.dateLabel}`}>
          <span className="event__weekday">{event.weekday}</span>
          <span className="event__day" aria-hidden="true">
            {event.day}
          </span>
          <span className="event__month">
            {event.month} {event.year}
          </span>
        </div>

        <dl className="event__list">
          <div className="event__row">
            <dt>Date</dt>
            <dd>{event.dateLabel}</dd>
          </div>
          <div className="event__row">
            <dt>Time</dt>
            <dd>{event.timeLabel}</dd>
          </div>
          <div className="event__row">
            <dt>Venue</dt>
            <dd>{event.venue}</dd>
          </div>
        </dl>

        <a className="btn btn--light" href={event.mapsUrl} target="_blank" rel="noopener noreferrer">
          <PinIcon />
          Get Directions
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </a>
      </Reveal>
    </section>
  );
}
