"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePhotoboxStore } from "@/store/usePhotoboxStore";
import { generateStrip, generateHero } from "@/lib/canvasUtils";

type GenStatus = "generating" | "ready" | "error";

export default function DownloadPage() {
  const router = useRouter();
  const {
    selectedForStrip,
    selectedForHero,
    frameColor,
    caption,
    heroStickers,
    stripStickers,
    stripDataUrl,
    heroDataUrl,
    setStripDataUrl,
    setHeroDataUrl,
    resetAll,
  } = usePhotoboxStore();

  const [status, setStatus] = useState<GenStatus>("generating");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stripDataUrl && heroDataUrl) {
      setStatus("ready");
      return;
    }

    if (!selectedForHero || selectedForStrip.length === 0) {
      router.push("/select");
      return;
    }

    async function generate() {
      try {
        setStatus("generating");
        const [strip, hero] = await Promise.all([
          generateStrip(selectedForStrip, frameColor, caption, stripStickers),
          generateHero(selectedForHero!, frameColor, caption, heroStickers),
        ]);
        setStripDataUrl(strip);
        setHeroDataUrl(hero);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setError("Gagal generate foto. Coba ulangi.");
        setStatus("error");
      }
    }

    generate();
  }, []);

  function downloadFile(dataUrl: string, filename: string) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  function downloadBoth() {
    if (!stripDataUrl || !heroDataUrl) return;
    downloadFile(stripDataUrl, "strip-kita.png");
    setTimeout(() => downloadFile(heroDataUrl, "hero-kita.png"), 400);
  }

  function handleStartOver() {
    // This wipes all photos, selections, stickers, and generated images from memory
    resetAll();
    router.push("/");
  }

  // ── Generating ─────────────────────────────────────────────────────────────
  if (status === "generating") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-5 px-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-pink-400 animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-white">Membuat foto...</p>
          <p className="text-sm text-white/40 mt-1">Canvas sedang dirender</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl">😵</div>
        <p className="text-white font-bold">{error}</p>
        <button
          onClick={() => router.push("/edit")}
          className="px-6 py-3 rounded-xl bg-pink-500 font-semibold"
        >
          Kembali ke Editor
        </button>
      </div>
    );
  }

  // ── Ready ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 px-4 py-6 gap-6 overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Foto<span className="text-pink-400">mu</span> siap! 🎉
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Download sekarang — foto hanya ada di browser ini
        </p>
      </div>

      {/* Two previews side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Strip */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold text-center">
            Strip.png
          </p>
          <a href={stripDataUrl!} target="_blank" rel="noopener noreferrer">
            <img
              src={stripDataUrl!}
              alt="Strip"
              className="w-full rounded-xl border border-white/10 hover:border-pink-400/50 transition-all"
            />
          </a>
          <button
            onClick={() => downloadFile(stripDataUrl!, "strip-kita.png")}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold transition-all"
          >
            ⬇ Download
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold text-center">
            Hero.png
          </p>
          <a href={heroDataUrl!} target="_blank" rel="noopener noreferrer">
            <img
              src={heroDataUrl!}
              alt="Hero"
              className="w-full rounded-xl border border-white/10 hover:border-pink-400/50 transition-all"
            />
          </a>
          <button
            onClick={() => downloadFile(heroDataUrl!, "hero-kita.png")}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold transition-all"
          >
            ⬇ Download
          </button>
        </div>
      </div>

      {/* Download both */}
      <button
        onClick={downloadBoth}
        className="w-full py-4 rounded-2xl bg-pink-500 hover:bg-pink-400 active:scale-95 transition-all font-bold text-lg"
      >
        ⬇ Download Keduanya
      </button>

      {/* Privacy note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <span className="text-lg mt-0.5">🔒</span>
        <p className="text-xs text-white/40 leading-relaxed">
          Foto kamu tidak dikirim ke server manapun. Semua diproses langsung di
          browser. Setelah kamu klik "Mulai Lagi", semua foto dihapus dari
          memori.
        </p>
      </div>

      {/* Start over — triggers resetAll() */}
      <button
        onClick={handleStartOver}
        className="w-full py-3 rounded-xl border border-white/15 hover:border-white/30 text-sm text-white/50 hover:text-white/80 transition-all"
      >
        🔄 Mulai Lagi
      </button>
    </div>
  );
}
