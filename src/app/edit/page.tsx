"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePhotoboxStore } from "@/store/usePhotoboxStore";
import DraggableSticker from "@/components/DraggableSticker";
import EmojiPicker from "@/components/EmojiPicker";

type Tab = "hero" | "strip";

export default function EditPage() {
  const router = useRouter();
  const {
    selectedForHero,
    selectedForStrip,
    frameColor,
    caption,
    heroStickers, // ← updated
    stripStickers, // ← updated
    setCaption,
    addHeroSticker, // ← updated
    addStripSticker, // ← updated
    updateHeroStickerPosition, // ← updated
    updateStripStickerPosition, // ← updated
    removeHeroSticker, // ← updated
    removeStripSticker, // ← updated
  } = usePhotoboxStore();

  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [showPicker, setShowPicker] = useState(false);
  const heroContainerRef = useRef<HTMLDivElement>(null!);
  const stripContainerRef = useRef<HTMLDivElement>(null!);

  // Guard: if no photos selected, send back
  if (!selectedForHero || selectedForStrip.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl">🎞️</div>
        <p className="text-white/60">Belum ada foto dipilih.</p>
        <button
          onClick={() => router.push("/select")}
          className="px-6 py-3 rounded-xl bg-pink-500 font-semibold"
        >
          Kembali ke Pilihan
        </button>
      </div>
    );
  }

  function handleAddEmoji(emoji: string) {
    const newSticker = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      size: 36,
    };
    if (activeTab === "hero") {
      addHeroSticker(newSticker);
    } else {
      addStripSticker(newSticker);
    }
    setShowPicker(false);
  }

  function handleDone() {
    router.push("/download");
  }

  const activeRef = activeTab === "hero" ? heroContainerRef : stripContainerRef;

  return (
    <div className="max-w-md mx-auto w-full min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Hias Foto</h1>
          <button
            onClick={handleDone}
            className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-sm font-bold transition-all"
          >
            Selesai →
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["hero", "strip"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                setShowPicker(false);
              }}
              className={`
                px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                ${
                  activeTab === t
                    ? "bg-pink-500 text-white"
                    : "bg-white/10 text-white/50 hover:bg-white/15"
                }
              `}
            >
              {t === "hero" ? "🌟 Hero" : "🎞 Strip"}
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {/* ── Hero tab ── */}
        {activeTab === "hero" && (
          <div className="flex flex-col gap-3">
            {/* Hero canvas preview */}
            <div
              ref={heroContainerRef}
              className="relative w-full aspect-square rounded-2xl overflow-hidden"
              style={{ backgroundColor: frameColor }}
            >
              {/* Photo — fills most of the square with padding for frame */}
              <div className="absolute inset-[8%] rounded-lg overflow-hidden">
                <img
                  src={selectedForHero}
                  alt="hero"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              {/* Caption bar at bottom */}
              {caption.trim() && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2 text-center text-sm font-bold"
                  style={{
                    color:
                      frameColor === "#ffffff" ||
                      frameColor === "#fff0a0" ||
                      frameColor === "#b2d8b2"
                        ? "#333"
                        : "#fff",
                  }}
                >
                  {caption}
                </div>
              )}

              {/* Stickers */}
              {/* Stickers — hero only */}
              {heroStickers.map((s) => (
                <DraggableSticker
                  key={s.id}
                  {...s}
                  containerRef={heroContainerRef}
                  onMove={updateHeroStickerPosition}
                  onRemove={removeHeroSticker}
                />
              ))}
            </div>

            {/* Caption input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Tulis sesuatu..."
                maxLength={60}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-pink-400 transition-colors"
              />
              <p className="text-xs text-white/25 text-right">
                {caption.length}/60
              </p>
            </div>
          </div>
        )}

        {/* ── Strip tab ── */}
        {activeTab === "strip" && (
          <div className="flex flex-col gap-3 items-center">
            {/* Strip preview */}
            <div
              ref={stripContainerRef}
              className="relative rounded-2xl overflow-hidden"
              style={{
                backgroundColor: frameColor,
                width: "55%",
                padding: "8px",
              }}
            >
              <div className="flex flex-col gap-2">
                {selectedForStrip.map((url, i) => (
                  <div
                    key={i}
                    className="w-full rounded overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img
                      src={url}
                      alt={`strip ${i + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                ))}

                {/* Caption at bottom of strip */}
                {caption.trim() && (
                  <p
                    className="text-center text-[10px] font-bold py-1"
                    style={{
                      color:
                        frameColor === "#ffffff" ||
                        frameColor === "#fff0a0" ||
                        frameColor === "#b2d8b2"
                          ? "#333"
                          : "#fff",
                    }}
                  >
                    {caption}
                  </p>
                )}
              </div>

              {/* Stickers on strip */}
              {/* Stickers — strip only */}
              {stripStickers.map((s) => (
                <DraggableSticker
                  key={s.id}
                  {...s}
                  containerRef={stripContainerRef}
                  onMove={updateStripStickerPosition}
                  onRemove={removeStripSticker}
                />
              ))}
            </div>

            <p className="text-xs text-white/30 text-center">
              Stiker yang kamu tambahkan muncul di kedua file
            </p>
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="px-4 py-3 border-t border-white/10 flex flex-col gap-2">
        {/* Sticker button */}
        <button
          onClick={() => setShowPicker((v) => !v)}
          className={`
            w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
            ${
              showPicker
                ? "bg-pink-500/20 border border-pink-500/50 text-pink-300"
                : "bg-white/10 hover:bg-white/15 text-white"
            }
          `}
        >
          <span className="text-lg">😊</span>
          {showPicker ? "Tutup Stiker" : "Tambah Stiker / Emoji"}
        </button>

        {/* Sticker count */}
        {/* Sticker count */}
        {(activeTab === "hero" ? heroStickers : stripStickers).length > 0 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-white/30">
              {(activeTab === "hero" ? heroStickers : stripStickers).length}{" "}
              stiker ditambahkan
            </p>
            <button
              onClick={() => {
                if (activeTab === "hero") {
                  heroStickers.forEach((s) => removeHeroSticker(s.id));
                } else {
                  stripStickers.forEach((s) => removeStripSticker(s.id));
                }
              }}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            >
              Hapus semua
            </button>
          </div>
        )}
      </div>

      {/* Emoji picker bottom sheet */}
      {showPicker && (
        <div className="border-t border-white/10 bg-[#1a1a1a]">
          <EmojiPicker onEmojiClick={handleAddEmoji} />
        </div>
      )}
    </div>
  );
}
