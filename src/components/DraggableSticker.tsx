"use client";

import { useRef } from "react";

interface Props {
  id: string;
  emoji: string;
  x: number; // normalized 0-1
  y: number; // normalized 0-1
  size: number;
  containerRef: React.RefObject<HTMLDivElement>;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
}

export default function DraggableSticker({
  id,
  emoji,
  x,
  y,
  size,
  containerRef,
  onMove,
  onRemove,
}: Props) {
  const stickerRef = useRef<HTMLDivElement>(null);

  function getRelativePos(clientX: number, clientY: number) {
    if (!containerRef.current) return { x: 0.5, y: 0.5 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }

  // Mouse drag
  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    const move = (ev: MouseEvent) => {
      const pos = getRelativePos(ev.clientX, ev.clientY);
      onMove(id, pos.x, pos.y);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  // Touch drag (mobile)
  function onTouchStart(e: React.TouchEvent) {
    const move = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      const pos = getRelativePos(touch.clientX, touch.clientY);
      onMove(id, pos.x, pos.y);
    };
    const end = () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);
  }

  return (
    <div
      ref={stickerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="absolute select-none cursor-grab active:cursor-grabbing group"
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        fontSize: `${size}px`,
        transform: "translate(-50%, -50%)",
        touchAction: "none",
        zIndex: 10,
      }}
    >
      {emoji}

      {/* Remove button — shows on hover/tap */}
      <button
        onMouseDown={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black items-center justify-center hidden group-hover:flex"
      >
        ✕
      </button>
    </div>
  );
}
