"use client";

import { usePhotoboxStore } from "@/store/usePhotoboxStore";

export default function SelectPage() {
  const { capturedPhotos } = usePhotoboxStore();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {capturedPhotos.length} foto diambil
      </h1>
      <div className="grid grid-cols-3 gap-2">
        {capturedPhotos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`photo ${i}`}
            className="w-full aspect-video object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
