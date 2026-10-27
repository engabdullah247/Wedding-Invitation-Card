"use client";

import { useMusic } from "./MusicProvider";

function SpeakerOn() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M4 9.5v5h3.6L12 18.5v-13L7.6 9.5H4z" fill="currentColor" />
      <path d="M15.2 9a4.2 4.2 0 0 1 0 6M17.6 6.6a7.6 7.6 0 0 1 0 10.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M4 9.5v5h3.6L12 18.5v-13L7.6 9.5H4z" fill="currentColor" />
      <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** Compact, accessible music switch. State is shown with an icon AND a text label. */
export function MusicButton() {
  const { playing, failed, toggle } = useMusic();
  const label = playing ? "Turn music off" : "Turn music on";

  return (
    <div className="music">
      <button
        type="button"
        className="music__btn"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={label}
        title={label}
        data-playing={playing}
      >
        {playing ? <SpeakerOn /> : <SpeakerOff />}
        <span className="music__text" aria-hidden="true">
          {playing ? "Music on" : "Music off"}
        </span>
      </button>
      <p className="music__note" role="status" aria-live="polite">
        {failed ? "Music couldn’t play. Tap to try again." : ""}
      </p>
    </div>
  );
}
