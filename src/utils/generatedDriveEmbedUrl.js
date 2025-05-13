function extractFileIdFromUrl(driveUrl) {
  // Skip jika driveUrl null atau undefined
  if (!driveUrl) return null

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/, // drive.google.com/file/d/ID
    /id=([a-zA-Z0-9_-]+)/, // ?id=ID
    /https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)\//, // /d/ID/
  ]

  for (const pattern of patterns) {
    const match = driveUrl.match(pattern)
    if (match) return match[1]
  }

  return null
}

export function generateDriveEmbedUrl(driveUrl) {
  const fileId = extractFileIdFromUrl(driveUrl)

  if (!fileId) {
    console.warn('Invalid Google Drive link')
    return {
      embedUrl: '',
      thumbnailUrl: '',
      directGuess: '',
    }
  }

  return {
    embedUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}`,
    directGuess: `https://lh3.googleusercontent.com/d/${fileId}`, // May not always work
  }
}
