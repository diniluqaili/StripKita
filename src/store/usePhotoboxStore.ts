import { create } from 'zustand'

export type StripLayout = 3 | 4

export interface StickerItem {
  id: string
  emoji: string
  x: number
  y: number
  size: number
}

export interface PhotoboxState {
  layout: StripLayout
  frameColor: string
  capturedPhotos: string[]
  selectedForStrip: string[]
  selectedForHero: string | null
  caption: string
  heroStickers: StickerItem[]    // ← was: stickers
  stripStickers: StickerItem[]   // ← new
  stripDataUrl: string | null
  heroDataUrl: string | null
  cloudinaryStripUrl: string | null
  cloudinaryHeroUrl: string | null
}

export interface PhotoboxActions {
  setLayout: (layout: StripLayout) => void
  setFrameColor: (color: string) => void
  addPhoto: (dataUrl: string) => void
  resetPhotos: () => void
  setSelectedForStrip: (photos: string[]) => void
  setSelectedForHero: (photo: string) => void
  setCaption: (caption: string) => void
  // Hero stickers
  addHeroSticker: (sticker: StickerItem) => void
  updateHeroStickerPosition: (id: string, x: number, y: number) => void
  removeHeroSticker: (id: string) => void
  // Strip stickers
  addStripSticker: (sticker: StickerItem) => void
  updateStripStickerPosition: (id: string, x: number, y: number) => void
  removeStripSticker: (id: string) => void
  setStripDataUrl: (url: string) => void
  setHeroDataUrl: (url: string) => void
  setCloudinaryUrls: (strip: string, hero: string) => void
  resetAll: () => void
}

const initialState: PhotoboxState = {
  layout: 4,
  frameColor: '#ffffff',
  capturedPhotos: [],
  selectedForStrip: [],
  selectedForHero: null,
  caption: '',
  heroStickers: [],
  stripStickers: [],
  stripDataUrl: null,
  heroDataUrl: null,
  cloudinaryStripUrl: null,
  cloudinaryHeroUrl: null,
}

export const usePhotoboxStore = create<PhotoboxState & PhotoboxActions>((set) => ({
  ...initialState,

  setLayout: (layout) => set({ layout }),
  setFrameColor: (frameColor) => set({ frameColor }),

  addPhoto: (dataUrl) =>
    set((state) => ({
      capturedPhotos: [...state.capturedPhotos, dataUrl],
    })),

  resetPhotos: () => set({ capturedPhotos: [] }),

  setSelectedForStrip: (photos) => set({ selectedForStrip: photos }),
  setSelectedForHero: (photo) => set({ selectedForHero: photo }),

  setCaption: (caption) => set({ caption }),

  // Hero stickers
  addHeroSticker: (sticker) =>
    set((state) => ({ heroStickers: [...state.heroStickers, sticker] })),

  updateHeroStickerPosition: (id, x, y) =>
    set((state) => ({
      heroStickers: state.heroStickers.map((s) =>
        s.id === id ? { ...s, x, y } : s
      ),
    })),

  removeHeroSticker: (id) =>
    set((state) => ({
      heroStickers: state.heroStickers.filter((s) => s.id !== id),
    })),

  // Strip stickers
  addStripSticker: (sticker) =>
    set((state) => ({ stripStickers: [...state.stripStickers, sticker] })),

  updateStripStickerPosition: (id, x, y) =>
    set((state) => ({
      stripStickers: state.stripStickers.map((s) =>
        s.id === id ? { ...s, x, y } : s
      ),
    })),

  removeStripSticker: (id) =>
    set((state) => ({
      stripStickers: state.stripStickers.filter((s) => s.id !== id),
    })),

  setStripDataUrl: (url) => set({ stripDataUrl: url }),
  setHeroDataUrl: (url) => set({ heroDataUrl: url }),

  setCloudinaryUrls: (strip, hero) =>
    set({ cloudinaryStripUrl: strip, cloudinaryHeroUrl: hero }),

  resetAll: () => set(initialState),
}))