import { wedding } from "@/config/wedding";
import { Monogram } from "./Monogram";
import { Botanical, Flourish } from "./Ornaments";

export function Hero() {
  return (
    <header className="hero">
      <Botanical className="hero__bot hero__bot--tl" />
      <Botanical className="hero__bot hero__bot--br" />

      <div className="hero__inner">
        <Monogram className="monogram--hero" />
        <p className="hero__invite">{wedding.copy.inviteLine}</p>

        <h1 className="hero__names">
          <span className="hero__name">{wedding.bride}</span>
          <span className="hero__and" aria-hidden="true">
            and
          </span>
          <span className="sr-only"> and </span>
          <span className="hero__name">{wedding.groom}</span>
        </h1>

        <Flourish className="hero__flourish" />

        <p className="hero__date">
          <time dateTime="2026-12-11">{wedding.event.dateLabel}</time>
        </p>
        <p className="hero__time">{wedding.event.timeLabel}</p>

        <p className="hero__presence">{wedding.copy.presenceLine}</p>
      </div>
    </header>
  );
}
