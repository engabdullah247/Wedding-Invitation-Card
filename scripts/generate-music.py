#!/usr/bin/env python3
"""
Generates an original romantic piano + violin instrumental for the M & S invitation.

Everything (melody, harmony, synthesis, reverb) is created from scratch by this script,
so the resulting track is original and royalty-free. No samples or third-party audio are used.

Usage:  python3 scripts/generate-music.py [output.wav]
Then encode with ffmpeg (see README).
"""
import sys
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 44100
BPM = 64
BEAT = 60.0 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(11)

def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

# ---- Harmony (D major) -------------------------------------------------------
# chord: (bass midi, arpeggio base midi, intervals of 3 chord tones + octave)
CH = {
    "D":   (38, 50, (0, 4, 7, 12)),
    "A":   (33, 57, (0, 4, 7, 12)),
    "Bm":  (35, 59, (0, 3, 7, 12)),
    "F#m": (30, 54, (0, 3, 7, 12)),
    "G":   (31, 55, (0, 4, 7, 12)),
}
CYCLE = ["D", "A", "Bm", "F#m", "G", "D", "G", "A"]
PROG = CYCLE * 3 + ["D"]  # 25 bars, last bar resolves

# ---- Violin melody: per bar list of (midi, beats); None = rest ---------------
C1 = [
    [(78, 3), (76, 1)], [(73, 2), (76, 2)], [(78, 2), (74, 1), (71, 1)], [(73, 2), (78, 2)],
    [(79, 3), (78, 1)], [(81, 2), (78, 2)], [(79, 2), (83, 2)], [(81, 3), (76, 1)],
]
C2 = [
    [(81, 2), (78, 1), (81, 1)], [(85, 2), (83, 1), (81, 1)], [(83, 2), (81, 1), (78, 1)], [(78, 2), (81, 2)],
    [(83, 3), (79, 1)], [(86, 2), (83, 1), (81, 1)], [(83, 2), (79, 1), (81, 1)], [(85, 3), (81, 1)],
]
C3 = C1[:6] + [[(79, 2), (78, 2)], [(76, 3), (73, 1)]]
MELODY = [None, None] + C1[2:] + C2 + C3 + [[(74, 4)]]
MELODY[0] = None
MELODY[1] = None
# the first two bars are piano-only; cycle-1 bars 3-8 carry the melody
assert len(MELODY) == len(PROG), (len(MELODY), len(PROG))

TOTAL = len(PROG) * BAR
TAIL = 6.0
N = int((TOTAL + TAIL) * SR)
L = np.zeros(N)
R = np.zeros(N)

def add(sig, start, pan=0.0):
    i = int(start * SR)
    j = min(N, i + len(sig))
    if i >= N:
        return
    seg = sig[: j - i]
    gl = np.cos((pan + 1) * np.pi / 4)
    gr = np.sin((pan + 1) * np.pi / 4)
    L[i:j] += seg * gl
    R[i:j] += seg * gr

def piano(m, dur, vel):
    f0 = midi_hz(m)
    length = dur + 2.5 + max(0.0, (60 - m)) * 0.06
    t = np.arange(int(length * SR)) / SR
    out = np.zeros_like(t)
    base_tau = 3.2 - (m - 30) * 0.035
    base_tau = max(1.0, base_tau)
    for det in (-0.6, 0.6):  # two slightly detuned strings
        for n in range(1, 11):
            fn = f0 * n * np.sqrt(1 + 0.00035 * n * n) * 2 ** (det / 1200)
            if fn > 9000:
                break
            amp = (1.0 / n ** 1.15) * (vel ** (0.6 + 0.12 * n))
            tau = base_tau / (1 + 0.55 * (n - 1))
            out += amp * np.sin(2 * np.pi * fn * t + rng.uniform(0, 6.28)) * np.exp(-t / tau)
    # hammer thump
    thump = rng.standard_normal(int(0.02 * SR)) * np.exp(-np.arange(int(0.02 * SR)) / (0.004 * SR))
    out[: len(thump)] += thump * 0.04 * vel
    atk = np.minimum(1, t / 0.004)
    rel_start = dur + 0.6
    rel = np.where(t > rel_start, np.exp(-(t - rel_start) / 0.9), 1.0)
    return out * atk * rel * 0.5

def violin(m, dur, vel):
    f0 = midi_hz(m)
    release = 0.5
    length = dur + release + 0.1
    t = np.arange(int(length * SR)) / SR
    vib_depth = 0.0045 * np.clip((t - 0.35) / 0.5, 0, 1)
    vib = 1 + vib_depth * np.sin(2 * np.pi * 5.3 * t + 0.4)
    phase = 2 * np.pi * np.cumsum(f0 * vib) / SR
    out = np.zeros_like(t)
    for n in range(1, 14):
        if f0 * n > 7500:
            break
        # formant-ish body resonances around 500 Hz and 2.8 kHz
        body = 1 + 1.4 * np.exp(-((f0 * n - 550) / 300) ** 2) + 0.9 * np.exp(-((f0 * n - 2800) / 700) ** 2)
        soften = 1.0 / (1.0 + (f0 * n / 2400.0) ** 2)  # tame the top end for a warmer tone
        out += (body * soften / n ** 1.05) * np.sin(n * phase)
    bow = rng.standard_normal(len(t))
    sos = butter(2, [2500, 6500], btype="band", fs=SR, output="sos")
    out += 0.05 * sosfilt(sos, bow)
    env = np.minimum(1, t / 0.28) * np.where(t > dur, np.exp(-(t - dur) / (release / 4)), 1.0)
    swell = 0.85 + 0.15 * np.sin(np.pi * np.clip(t / max(dur, 0.1), 0, 1))
    return out * env * swell * 0.16 * vel

for b, chord in enumerate(PROG):
    t0 = b * BAR
    bass, base, iv = CH[chord]
    last = b == len(PROG) - 1
    # bass: root plus octave, sustained
    piano_bass_dur = BAR * (2.8 if last else 1.0)
    add(piano(bass, piano_bass_dur, 0.72), t0, -0.2)
    add(piano(bass + 12, piano_bass_dur, 0.4), t0 + 0.01, -0.1)
    if last:
        for k, off in enumerate((0, 4, 7, 12, 16)):
            add(piano(base + off, 3.5, 0.5 - 0.04 * k), t0 + 0.06 * k, 0.1)
        continue
    pattern = [0, 1, 2, 3, 2, 1, 2, 1]
    for k, p in enumerate(pattern):
        vel = (0.58 if k == 0 else 0.4 if k % 2 == 0 else 0.34) * (1 + rng.uniform(-0.05, 0.05))
        tt = t0 + k * BEAT / 2 + rng.uniform(0, 0.008)
        add(piano(base + iv[p], 1.4, vel), tt, 0.12 + 0.04 * p)

# violin line
for b, bar in enumerate(MELODY):
    if not bar:
        continue
    pos = b * BAR
    for midi, beats in bar:
        d = beats * BEAT
        add(violin(midi, d * 0.97, 0.9), pos + 0.012, 0.18)
        pos += d

# gentle second violin an octave below on cycle 2 for warmth
for b, bar in enumerate(MELODY[8:16], start=8):
    if not bar:
        continue
    pos = b * BAR
    for midi, beats in bar:
        d = beats * BEAT
        add(violin(midi - 12, d * 0.97, 0.45), pos + 0.03, -0.25)
        pos += d

# ---- Reverb: synthetic stereo hall ----------------------------------------
def impulse(seed):
    r = np.random.default_rng(seed)
    n = int(3.4 * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-t / 0.95)
    sos = butter(1, 3800, btype="low", fs=SR, output="sos")
    ir = sosfilt(sos, ir)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return ir / np.sqrt(np.sum(ir ** 2))

irL, irR = impulse(5), impulse(9)
wetL = fftconvolve(L, irL)
wetR = fftconvolve(R, irR)
M = len(wetL)
dryL = np.pad(L, (0, M - N))
dryR = np.pad(R, (0, M - N))
mixL = dryL * 0.72 + wetL * 0.34
mixR = dryR * 0.72 + wetR * 0.34

# ---- Wrap the tail onto the start for a seamless loop ----------------------
loop_len = int(TOTAL * SR)
for ch in (mixL, mixR):
    over = ch[loop_len:]
    ch[: len(over)] += over
outL, outR = mixL[:loop_len].copy(), mixR[:loop_len].copy()

# soft sweetening: very gentle low-pass for a warm, non-harsh top end
sos = butter(2, 9500, btype="low", fs=SR, output="sos")
outL, outR = sosfilt(sos, outL), sosfilt(sos, outR)

peak = max(np.abs(outL).max(), np.abs(outR).max())
gain = 0.7 / peak
outL *= gain
outR *= gain
# 6 ms fade at the very start/end only to avoid file-edge clicks
fade = int(0.006 * SR)
ramp = np.linspace(0, 1, fade)
for ch in (outL, outR):
    ch[:fade] *= ramp
    ch[-fade:] *= ramp[::-1]

stereo = np.stack([outL, outR], axis=1)
out_path = sys.argv[1] if len(sys.argv) > 1 else "scripts/wedding-instrumental.wav"
wavfile.write(out_path, SR, (stereo * 32767).astype(np.int16))
print(f"wrote {out_path}: {loop_len / SR:.1f}s, peak {20*np.log10(0.7):.1f} dBFS")
