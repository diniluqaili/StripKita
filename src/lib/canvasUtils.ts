import type { StickerItem } from '@/store/usePhotoboxStore'

// Load a dataURL into an HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ─── Strip.png ───────────────────────────────────────────────────────────────

export async function generateStrip(
  photos: string[],
  frameColor: string,
  caption: string,
  stickers: StickerItem[]
): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // Dimensions
  const W = 400
  const PADDING = 16
  const PHOTO_H = 240
  const GAP = 8
  const CAPTION_H = caption.trim() ? 36 : 0
  const H =
    PADDING +
    photos.length * PHOTO_H +
    (photos.length - 1) * GAP +
    PADDING +
    CAPTION_H

  canvas.width = W
  canvas.height = H

  // Background (frame color)
  ctx.fillStyle = frameColor
  ctx.fillRect(0, 0, W, H)

  // Draw each photo
  const photoImages = await Promise.all(photos.map(loadImage))

  photoImages.forEach((img, i) => {
    const x = PADDING
    const y = PADDING + i * (PHOTO_H + GAP)
    const w = W - PADDING * 2
    const h = PHOTO_H

    // Rounded clip
    roundedRect(ctx, x, y, w, h, 6)
    ctx.clip()

    // Cover-fit the image
    const { sx, sy, sw, sh } = coverFit(img.width, img.height, w, h)
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)

    ctx.restore()
    ctx.save()
  })

  // Caption
  if (caption.trim()) {
    const textColor = isLightColor(frameColor) ? '#333333' : '#ffffff'
    ctx.fillStyle = textColor
    ctx.font = 'bold 15px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      caption,
      W / 2,
      H - CAPTION_H / 2 - PADDING / 2,
      W - PADDING * 2
    )
  }

  // Stickers
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  stickers.forEach((s) => {
    ctx.font = `${s.size}px serif`
    ctx.fillText(s.emoji, s.x * W, s.y * H)
  })

  return canvas.toDataURL('image/png')
}

// ─── Hero.png ────────────────────────────────────────────────────────────────

export async function generateHero(
  photo: string,
  frameColor: string,
  caption: string,
  stickers: StickerItem[]
): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // Instagram square
  const SIZE = 1080
  const PADDING = 60
  const CAPTION_H = caption.trim() ? 80 : 0
  const PHOTO_SIZE = SIZE - PADDING * 2 - CAPTION_H

  canvas.width = SIZE
  canvas.height = SIZE

  // Background
  ctx.fillStyle = frameColor
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Photo
  const img = await loadImage(photo)
  const photoX = PADDING
  const photoY = PADDING
  const photoW = PHOTO_SIZE
  const photoH = PHOTO_SIZE

  ctx.save()
  roundedRect(ctx, photoX, photoY, photoW, photoH, 16)
  ctx.clip()

  const { sx, sy, sw, sh } = coverFit(img.width, img.height, photoW, photoH)
  ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH)
  ctx.restore()

  // Caption
  if (caption.trim()) {
    const textColor = isLightColor(frameColor) ? '#333333' : '#ffffff'
    ctx.save()
    ctx.fillStyle = textColor
    ctx.font = `bold ${Math.floor(SIZE * 0.04)}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      caption,
      SIZE / 2,
      PADDING + PHOTO_SIZE + CAPTION_H / 2,
      SIZE - PADDING * 2
    )
    ctx.restore()
  }

  // Stickers — scale normalized coords to canvas size
  stickers.forEach((s) => {
    ctx.font = `${s.size * 2.5}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(s.emoji, s.x * SIZE, s.y * SIZE)
  })

  return canvas.toDataURL('image/png')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// CSS object-fit: cover math
function coverFit(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number
): { sx: number; sy: number; sw: number; sh: number } {
  const imgRatio = imgW / imgH
  const boxRatio = boxW / boxH

  let sw: number, sh: number, sx: number, sy: number

  if (imgRatio > boxRatio) {
    // Image is wider — crop sides
    sh = imgH
    sw = imgH * boxRatio
    sx = (imgW - sw) / 2
    sy = 0
  } else {
    // Image is taller — crop top/bottom
    sw = imgW
    sh = imgW / boxRatio
    sx = 0
    sy = (imgH - sh) / 2
  }

  return { sx, sy, sw, sh }
}

// Draw a rounded rect path and save ctx state
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Decide if a hex color is light or dark
function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  // Perceived luminance formula
  return r * 0.299 + g * 0.587 + b * 0.114 > 150
}