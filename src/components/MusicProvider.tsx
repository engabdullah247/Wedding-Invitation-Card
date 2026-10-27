"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export const MUSIC_SRC = "/audio/romantic-wedding-instrumental.mp3";
const TARGET_VOLUME = 0.55;
const STORAGE_KEY = "ms-wedding-music";

type MusicContextValue = {
  /** Audio is actually playing right now. */
  playing: boolean;
  /** Visitor allows music (false once they switch it off). */
  enabled: boolean;
  /** Last playback attempt was rejected by the browser or failed to load. */
  failed: boolean;
  /** Start playback. Must be called from a user gesture (click / key press). */
  start: () => Promise<boolean>;
  stop: () => void;
  toggle: () => void;
  /** Change the visitor's preference without starting audio (cover page). */
  setEnabled: (value: boolean) => void;
};

// Visitor's "music allowed" preference lives in sessionStorage, exposed as a tiny external store.
const listeners = new Set<() => void>();
function subscribePref(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function readPref(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}
function writePref(value: "on" | "off") {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable - preference simply isn't remembered */
  }
  listeners.forEach((l) => l());
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}

/**
 * Owns the one and only <audio> element. It lives in the root layout, so it
 * survives client-side route changes and no duplicate players can be created.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const enabled = useSyncExternalStore(subscribePref, readPref, () => true);
  const [failed, setFailed] = useState(false);


  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (target: number, ms: number, done?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      clearFade();
      const from = audio.volume;
      const steps = Math.max(1, Math.round(ms / 50));
      let i = 0;
      fadeRef.current = window.setInterval(() => {
        i += 1;
        const v = from + (target - from) * (i / steps);
        audio.volume = Math.min(1, Math.max(0, v));
        if (i >= steps) {
          clearFade();
          done?.();
        }
      }, 50);
    },
    [clearFade],
  );

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    writePref("on");
    setFailed(false);
    clearFade();
    try {
      if (audio.paused) audio.volume = 0;
      await audio.play();
      fadeTo(TARGET_VOLUME, 1800);
      return true;
    } catch {
      setFailed(true);
      return false;
    }
  }, [clearFade, fadeTo]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    writePref("off");
    setFailed(false);
    if (!audio) return;
    fadeTo(0, 700, () => audio.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) stop();
    else void start();
  }, [playing, start, stop]);

  const setEnabled = useCallback(
    (value: boolean) => {
      writePref(value ? "on" : "off");
      if (!value) setFailed(false);
    },
    [],
  );

  useEffect(() => () => clearFade(), [clearFade]);

  const value = useMemo(
    () => ({ playing, enabled, failed, start, stop, toggle, setEnabled }),
    [playing, enabled, failed, start, stop, toggle, setEnabled],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="none"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
      />
    </MusicContext.Provider>
  );
}
