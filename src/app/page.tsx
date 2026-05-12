"use client";

import { useRouter } from "next/navigation";
import { usePhotoboxStore } from "@/store/usePhotoboxStore";
import type { StripLayout } from "@/store/usePhotoboxStore";

// Frame color options
const FRAME_COLORS = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#1a1a1a" },
  { label: "Pink", value: "#ffb6c1" },
  { label: "Sage", value: "#b2d8b2" },
  { label: "Lavender", value: "#c8b4e8" },
  { label: "Butter", value: "#fff0a0" },
];

export default function HomePage() {
  const router = useRouter();
  const { layout, frameColor, setLayout, setFrameColor, resetAll } =
    usePhotoboxStore();

  function handleStart() {
    resetAll(); // clear any leftover session data
    setLayout(layout); // re-apply current picks after reset
    setFrameColor(frameColor);
    router.push("/camera");
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-10 gap-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Strip<span className="text-pink-400">Kita</span>
        </h1>
        <p className="text-sm text-white/50 mt-2">
          Virtual photobox · jepret, pilih, hias, download
        </p>
      </div>

      {/* Layout picker */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Pilih layout strip
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {([3, 4] as StripLayout[]).map((n) => (
            <button
              key={n}
              onClick={() => setLayout(n)}
              className={`
                relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all
                ${
                  layout === n
                    ? "border-pink-400 bg-pink-400/10"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }
              `}
            >
              {/* Mini strip preview */}
              <div className="flex flex-col gap-1.5">
                {Array.from({ length: n }).map((_, i) => (
                  <div key={i} className="w-16 h-10 rounded bg-white/15" />
                ))}
              </div>
              <span className="text-sm font-medium">Strip {n}</span>
              {layout === n && (
                <span className="absolute top-2 right-2 text-pink-400 text-xs font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Frame color picker */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Warna frame
        </h2>
        <div className="grid grid-cols-6 gap-3">
          {FRAME_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setFrameColor(c.value)}
              title={c.label}
              className={`
                w-full aspect-square rounded-full border-2 transition-all
                ${
                  frameColor === c.value
                    ? "border-pink-400 scale-110"
                    : "border-white/20 hover:scale-105"
                }
              `}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
        <p className="text-xs text-white/30">
          Dipilih:{" "}
          <span
            className="font-medium"
            style={{ color: frameColor === "#1a1a1a" ? "#aaa" : frameColor }}
          >
            {FRAME_COLORS.find((c) => c.value === frameColor)?.label ??
              frameColor}
          </span>
        </p>
      </section>

      {/* Preview of selection */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Preview
        </h2>
        <div
          className="w-full rounded-2xl p-4 flex flex-col gap-2 items-center"
          style={{ backgroundColor: frameColor }}
        >
          {Array.from({ length: layout }).map((_, i) => (
            <div key={i} className="w-full h-20 rounded-lg bg-black/20" />
          ))}
          <p
            className="text-xs mt-1 font-medium"
            style={{
              color:
                frameColor === "#ffffff" ||
                frameColor === "#fff0a0" ||
                frameColor === "#b2d8b2"
                  ? "#555"
                  : "#ccc",
            }}
          >
            {layout} foto · frame{" "}
            {FRAME_COLORS.find((c) => c.value === frameColor)?.label}
          </p>
        </div>
      </section>

      {/* Start button */}
      <div className="mt-auto">
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-pink-500 hover:bg-pink-400 active:scale-95 transition-all font-bold text-lg text-white"
        >
          Mulai Jepret
        </button>
        <p className="text-center text-xs text-white/25 mt-3">
          Kamu akan mengambil 6 foto, lalu pilih yang terbaik
        </p>
      </div>
    </div>
  );
}
