export async function startCamera(
  videoEl: HTMLVideoElement
): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',      // front camera on mobile
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  })
  videoEl.srcObject = stream
  await videoEl.play()
  return stream
}

export function stopCamera(stream: MediaStream) {
  stream.getTracks().forEach((track) => track.stop())
}

export function captureFrame(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement
): string {
  const ctx = canvasEl.getContext('2d')!
  canvasEl.width = videoEl.videoWidth
  canvasEl.height = videoEl.videoHeight

  // Mirror the image (selfie cameras are mirrored in preview,
  // so we flip the canvas to match what user sees)
  ctx.translate(canvasEl.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(videoEl, 0, 0)

  return canvasEl.toDataURL('image/jpeg', 0.92)
}