// Unsigned upload to Cloudinary (no backend needed)
// We'll set up the account details in Step 6.4

export async function uploadToCloudinary(
  dataUrl: string,
  filename: string
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    // If not configured, just return the dataUrl itself
    // so the QR code still works locally
    console.warn('Cloudinary not configured — using dataURL fallback')
    return dataUrl
  }

  const formData = new FormData()
  formData.append('file', dataUrl)
  formData.append('upload_preset', uploadPreset)
  formData.append('public_id', filename)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Cloudinary upload failed')

  const data = await res.json()
  return data.secure_url as string
}