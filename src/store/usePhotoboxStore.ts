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
  stickers: StickerItem[]
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
  addSticker: (sticker: StickerItem) => void
  updateStickerPosition: (id: string, x: number, y: number) => void
  removeSticker: (id: string) => void
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
  stickers: [],
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

  addSticker: (sticker) =>
    set((state) => ({ stickers: [...state.stickers, sticker] })),

  updateStickerPosition: (id, x, y) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, x, y } : s
      ),
    })),

  removeSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
    })),

  setStripDataUrl: (url) => set({ stripDataUrl: url }),
  setHeroDataUrl: (url) => set({ heroDataUrl: url }),

  setCloudinaryUrls: (strip, hero) =>
    set({ cloudinaryStripUrl: strip, cloudinaryHeroUrl: hero }),

  resetAll: () => set(initialState),
}))