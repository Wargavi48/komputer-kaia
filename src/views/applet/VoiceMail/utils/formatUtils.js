import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'

dayjs.extend(UTC)

/**
 * Format waktu dalam format mm:ss
 * @param {number} seconds - Waktu dalam detik
 * @returns {string} - Waktu yang diformat
 */
export const formatTime = (seconds) => {
  // Validasi input untuk mencegah Invalid Date
  if (seconds === undefined || seconds === null || isNaN(seconds)) {
    return '00:00'
  }
  return dayjs.unix(seconds).utc().format('mm:ss')
}

/**
 * Utilitas format waktu dan tanggal
 */
export const formatUtils = {
  /**
   * Format tanggal untuk tampilan
   * @param {string} isoDate - Tanggal dalam format ISO
   * @returns {string} - Tanggal yang diformat
   */
  formatDate(isoDate) {
    // Validasi input untuk mencegah Invalid Date
    if (!isoDate) return '-'

    const date = dayjs(isoDate)
    // Cek apakah tanggal valid
    return date.isValid() ? date.format('DD/MM/YYYY HH:mm') : '-'
  },

  /**
   * Format durasi dalam format mm:ss
   * @param {number} seconds - Durasi dalam detik
   * @returns {string} - Durasi yang diformat
   */
  formatDuration(seconds) {
    // Validasi input untuk mencegah error
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return '00:00'
    }

    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0')
    return `${mins}:${secs}`
  },
}
