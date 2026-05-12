"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePhotoboxStore } from "@/store/usePhotoboxStore";
import { startCamera, stopCamera, captureFrame } from "@/lib/camera";

const TOTAL_SHOTS = 6;
const COUNTDOWN_FROM = 3;
const DELAY_BETWEEN_MS = 1200; // pause between shots

type CameraStatus =
  | "idle" // waiting for user to click Start
  | "countdown" // showing 3-2-1
  | "flash" // white flash on capture
  | "done"; // all 6 shots taken

export default function CameraPage() {
  const router = useRouter();
  const { addPhoto, resetPhotos, capturedPhotos, layout } = usePhotoboxStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [permissionError, setPermissionError] = useState(false);

  // Start camera on mount
  useEffect(() => {
    async function init() {
      if (!videoRef.current) return;
      try {
        const stream = await startCamera(videoRef.current);
        streamRef.current = stream;
      } catch {
        setPermissionError(true);
      }
    }
    init();

    // Cleanup: stop camera when leaving page
    return () => {
      if (streamRef.current) stopCamera(streamRef.current);
    };
  }, []);

  // Navigate away when done
  useEffect(() => {
    if (status === "done") {
      const timer = setTimeout(() => router.push("/select"), 800);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const takeShot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const dataUrl = captureFrame(videoRef.current, canvasRef.current);
    addPhoto(dataUrl);

    // Flash effect
    setStatus("flash");
    setTimeout(() => setStatus("countdown"), 200);
  }, [addPhoto]);

  const startShooting = useCallback(() => {
    resetPhotos();
    setShotsTaken(0);
    setStatus("countdown");
    setCountdown(COUNTDOWN_FROM);

    let shot = 0;
    let count = COUNTDOWN_FROM;

    const tick = () => {
      if (count > 1) {
        count--;
        setCountdown(count);
        setTimeout(tick, 1000);
      } else {
        // Take the shot
        shot++;
        setShotsTaken(shot);
        setStatus("flash");

        if (!videoRef.current || !canvasRef.current) return;
        const dataUrl = captureFrame(videoRef.current, canvasRef.current);
        addPhoto(dataUrl);

        if (shot < TOTAL_SHOTS) {
          // Reset countdown for next shot
          setTimeout(() => {
            count = COUNTDOWN_FROM;
            setCountdown(count);
            setStatus("countdown");
            setTimeout(tick, 1000);
          }, DELAY_BETWEEN_MS);
        } else {
          setTimeout(() => setStatus("done"), 400);
        }
      }
    };

    setTimeout(tick, 1000);
  }, [addPhoto, resetPhotos]);

  if (permissionError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center px-6 gap-6 text-center">
        <div className="text-5xl">📷</div>
        <h2 className="text-xl font-bold">Kamera tidak bisa diakses</h2>
        <p className="text-white/50 text-sm">
          Izinkan akses kamera di browser kamu, lalu refresh halaman ini.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-400 font-semibold transition-all"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video feed */}
      <div className="relative flex-1 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }} // mirror for selfie
        />

        {/* Flash overlay */}
        <div
          className={`
            absolute inset-0 bg-white pointer-events-none transition-opacity duration-100
            ${status === "flash" ? "opacity-80" : "opacity-0"}
          `}
        />

        {/* Countdown overlay */}
        {status === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              key={countdown}
              className="text-9xl font-black text-white drop-shadow-lg"
              style={{ textShadow: "0 0 40px rgba(0,0,0,0.8)" }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* Done overlay */}
        {status === "done" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-white font-bold text-lg">
                Semua foto diambil!
              </p>
              <p className="text-white/60 text-sm mt-1">
                Menuju pilihan foto...
              </p>
            </div>
          </div>
        )}

        {/* Shot counter — top right */}
        {(status === "countdown" || status === "flash") && (
          <div className="absolute top-4 right-4 bg-black/60 rounded-full px-3 py-1">
            <span className="text-white text-sm font-bold">
              {shotsTaken}/{TOTAL_SHOTS}
            </span>
          </div>
        )}

        {/* Film strip thumbnail row — bottom */}
        {shotsTaken > 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
            {capturedPhotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`shot ${i + 1}`}
                className="w-12 h-9 object-cover rounded border-2 border-white/40"
              />
            ))}
            {Array.from({ length: TOTAL_SHOTS - shotsTaken }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-12 h-9 rounded border-2 border-dashed border-white/20"
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center gap-3 px-6 py-5 bg-[#0f0f0f]">
        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_SHOTS }).map((_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full transition-all
                ${i < shotsTaken ? "bg-pink-400 scale-110" : "bg-white/20"}
              `}
            />
          ))}
        </div>

        <p className="text-xs text-white/40">
          {status === "idle" && `Siap mengambil ${TOTAL_SHOTS} foto`}
          {status === "countdown" &&
            `Foto ${shotsTaken + 1} dari ${TOTAL_SHOTS}...`}
          {status === "flash" && `Foto ${shotsTaken} diambil!`}
          {status === "done" && "Selesai!"}
        </p>

        {status === "idle" && (
          <button
            onClick={startShooting}
            className="w-full py-4 rounded-2xl bg-pink-500 hover:bg-pink-400 active:scale-95 transition-all font-bold text-lg"
          >
            Mulai Jepret 📸
          </button>
        )}

        {(status === "countdown" || status === "flash") && (
          <div className="w-full py-4 rounded-2xl bg-white/5 text-center text-white/30 font-medium">
            Jangan gerak...
          </div>
        )}
      </div>
    </div>
  );
}
