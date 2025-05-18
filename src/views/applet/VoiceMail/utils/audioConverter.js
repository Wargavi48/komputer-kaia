/**
 * Utilitas untuk konversi audio
 */
export const audioConverter = {
  /**
   * Mengkonversi Blob ke base64 string
   * @param {Blob} blob - Blob yang akan dikonversi
   * @returns {Promise<string>} - Promise yang menghasilkan base64 string
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Hasil reader.result adalah string dengan format "data:audio/webm;base64,DATANYA"
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  },

  /**
   * Mengkonversi base64 string ke Blob
   * @param {string} base64 - Base64 string yang akan dikonversi
   * @returns {Blob} - Blob hasil konversi
   */
  base64ToBlob(base64) {
    // Format base64 adalah "data:audio/webm;base64,DATANYA"
    const parts = base64.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], { type: contentType })
  },
}
