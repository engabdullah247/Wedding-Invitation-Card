"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { Monogram } from "./Monogram";
import { MusicButton } from "./MusicButton";
import { useMusic } from "./MusicProvider";
import { Botanical } from "./Ornaments";

type Phase = "idle" | "opening" | "rising" | "leaving";

export function InvitationCover() {
  const router = useRouter();
  const { enabled, start } = useMusic();
  const [phase, setPhase] = useState<Phase>("idle");
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    router.prefetch("/invitation");
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, [router]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const open = () => {
    if (busy.current) return; // ignore repeated activations
    busy.current = true;

    // Playback may only begin from a user gesture, so it is started right here.
    if (enabled) void start();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("leaving");
      later(() => router.push("/invitation"), 250);
      return;
    }
    setPhase("opening");
    later(() => setPhase("rising"), 750);
    later(() => setPhase("leaving"), 1750);
    later(() => router.push("/invitation"), 2500);
  };

  return (
    <main className="cover" data-phase={phase}>
      <Botanical className="cover__bot cover__bot--tl" />
      <Botanical className="cover__bot cover__bot--br" />

      <div className="cover__music">
        <MusicButton />
      </div>

      <section className="cover__stage" aria-labelledby="cover-title">
        <p className="cover__eyebrow">The wedding invitation of</p>
        <h1 id="cover-title" className="cover__title">
          <span className="sr-only">{wedding.initials} — </span>
          {wedding.copy.coverPhrase}
        </h1>

        <div className="envelope" aria-hidden="true">
          <div className="envelope__back" />
          <div className="envelope__card">
            <span className="envelope__card-eyebrow">The wedding of</span>
            <Monogram className="monogram--card" />
            <span className="envelope__card-date">{wedding.event.dateLabel}</span>
          </div>
          <div className="envelope__front">
            <svg viewBox="0 0 300 200" preserveAspectRatio="none">
              <path d="M0 200 L150 112 L300 200" fill="none" className="envelope__fold" />
            </svg>
          </div>
          <div className="envelope__flap">
            <svg viewBox="0 0 300 112" preserveAspectRatio="none">
              <path d="M0 0 L150 112 L300 0" fill="none" className="envelope__fold" />
            </svg>
          </div>
          <Monogram className="monogram--seal envelope__seal" />
        </div>

        <p className="cover__hint">{wedding.copy.coverHint}</p>

        <button
          type="button"
          className="btn btn--pulse cover__open"
          onClick={open}
          disabled={phase !== "idle"}
        >
          Open Invitation
        </button>
      </section>

      <div className="cover__veil" aria-hidden="true" />
    </main>
  );
}
