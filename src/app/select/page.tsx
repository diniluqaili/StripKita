"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePhotoboxStore } from "@/store/usePhotoboxStore";

type Stage = "strip" | "hero";

export default function SelectPage() {
  const router = useRouter();
  const { capturedPhotos, layout, setSelectedForStrip, setSelectedForHero } =
    usePhotoboxStore();

  const [stage, setStage] = useState<Stage>("strip");
  const [stripPicks, setStripPicks] = useState<string[]>([]);
  const [heroPick, setHeroPick] = useState<string | null>(null);

  // ── Stage 1 helpers ──────────────────────────────────────

  function toggleStrip(url: string) {
    setStripPicks((prev) => {
      if (prev.includes(url)) {
        return prev.filter((u) => u !== url);
      }
      if (prev.length >= layout) return prev; // already at limit
      return [...prev, url];
    });
  }

  function confirmStrip() {
    if (stripPicks.length !== layout) return;
    setSelectedForStrip(stripPicks);
    setStage("hero");
    setHeroPick(null);
  }

  // ── Stage 2 helpers ──────────────────────────────────────

  function confirmHero() {
    if (!heroPick) return;
    setSelectedForHero(heroPick);
    router.push("/edit");
  }

  // ── Shared ───────────────────────────────────────────────

  if (capturedPhotos.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl">🎞️</div>
        <p className="text-white/60">Belum ada foto. Kembali ke kamera dulu.</p>
        <button
          onClick={() => router.push("/camera")}
          className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-400 font-semibold transition-all"
        >
          Ke Kamera
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 px-4 py-6 gap-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          {/* Stage indicator pills */}
          {(["strip", "hero"] as Stage[]).map((s, i) => (
            <div
              key={s}
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all
                ${
                  stage === s
                    ? "bg-pink-500 text-white"
                    : i < ["strip", "hero"].indexOf(stage)
                      ? "bg-white/20 text-white/60"
                      : "bg-white/5 text-white/25"
                }
              `}
            >
              <span>{i + 1}</span>
              <span>{s === "strip" ? "Pilih Strip" : "Pilih Hero"}</span>
            </div>
          ))}
        </div>

        {stage === "strip" ? (
          <>
            <h1 className="text-xl font-bold mt-3">
              Pilih {layout} foto untuk strip
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              {stripPicks.length}/{layout} dipilih — urutan pilih = urutan di
              strip
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mt-3">Pilih 1 foto hero</h1>
            <p className="text-sm text-white/40 mt-0.5">
              Foto ini akan jadi Hero.png — format square dengan caption
            </p>
          </>
        )}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-2 flex-1">
        {capturedPhotos.map((url, i) => {
          const isStripSelected = stripPicks.includes(url);
          const stripOrder = stripPicks.indexOf(url);
          const isHeroSelected = heroPick === url;

          return (
            <button
              key={i}
              onClick={() => {
                if (stage === "strip") toggleStrip(url);
                else setHeroPick(url);
              }}
              className={`
                relative aspect-[3/4] rounded-xl overflow-hidden transition-all
                ${
                  stage === "strip"
                    ? isStripSelected
                      ? "ring-4 ring-pink-400 scale-[0.97]"
                      : stripPicks.length >= layout
                        ? "opacity-40"
                        : "ring-2 ring-white/10 hover:ring-white/30"
                    : isHeroSelected
                      ? "ring-4 ring-yellow-400 scale-[0.97]"
                      : "ring-2 ring-white/10 hover:ring-white/30"
                }
              `}
            >
              <img
                src={url}
                alt={`photo ${i + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Strip order badge */}
              {stage === "strip" && isStripSelected && (
                <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                  <span className="text-white text-xs font-black">
                    {stripOrder + 1}
                  </span>
                </div>
              )}

              {/* Hero checkmark */}
              {stage === "hero" && isHeroSelected && (
                <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-black text-xs font-black">✓</span>
                </div>
              )}

              {/* Dim unselected during hero stage */}
              {stage === "hero" && !isHeroSelected && (
                <div className="absolute inset-0 bg-black/30" />
              )}
            </button>
          );
        })}
      </div>

      {/* Strip order preview (only in stage 1) */}
      {stage === "strip" && stripPicks.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
            Urutan strip
          </p>
          <div className="flex gap-2">
            {stripPicks.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt={`strip ${i + 1}`}
                  className="w-14 h-20 object-cover rounded-lg border-2 border-pink-400"
                />
                <span className="absolute bottom-1 right-1 text-xs font-black text-white bg-pink-500 rounded px-1">
                  {i + 1}
                </span>
              </div>
            ))}
            {Array.from({ length: layout - stripPicks.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-14 h-20 rounded-lg border-2 border-dashed border-white/15 flex items-center justify-center"
              >
                <span className="text-white/20 text-lg">+</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA button */}
      <div className="flex flex-col gap-2">
        {stage === "strip" ? (
          <button
            onClick={confirmStrip}
            disabled={stripPicks.length !== layout}
            className={`
              w-full py-4 rounded-2xl font-bold text-lg transition-all
              ${
                stripPicks.length === layout
                  ? "bg-pink-500 hover:bg-pink-400 active:scale-95 text-white"
                  : "bg-white/5 text-white/25 cursor-not-allowed"
              }
            `}
          >
            {stripPicks.length === layout
              ? "Lanjut → Pilih Foto Hero"
              : `Pilih ${layout - stripPicks.length} foto lagi`}
          </button>
        ) : (
          <>
            <button
              onClick={confirmHero}
              disabled={!heroPick}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg transition-all
                ${
                  heroPick
                    ? "bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black"
                    : "bg-white/5 text-white/25 cursor-not-allowed"
                }
              `}
            >
              {heroPick ? "Lanjut → Edit & Hias" : "Pilih 1 foto hero"}
            </button>

            <button
              onClick={() => setStage("strip")}
              className="text-sm text-white/30 hover:text-white/60 transition-all py-1"
            >
              ← Ubah pilihan strip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
