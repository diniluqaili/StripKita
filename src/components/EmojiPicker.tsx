"use client";

import dynamic from "next/dynamic";

const Picker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="h-48 flex items-center justify-center text-white/40 text-sm">
      Loading picker...
    </div>
  ),
});

interface Props {
  onEmojiClick: (emoji: string) => void;
}

export default function EmojiPicker({ onEmojiClick }: Props) {
  return (
    <Picker
      onEmojiClick={(data) => onEmojiClick(data.emoji)}
      skinTonesDisabled
      searchDisabled
      height={320}
      width="100%"
      previewConfig={{ showPreview: false }}
    />
  );
}
