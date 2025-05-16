import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'

dayjs.extend(UTC)

/**
 * Format waktu dalam format mm:ss
 */
export const formatTime = (seconds) => dayjs.unix(seconds).utc().format('mm:ss')

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
    return dayjs(isoDate).format('DD/MM/YYYY HH:mm')
  },

  /**
   * Format durasi dalam format mm:ss
   * @param {number} seconds - Durasi dalam detik
   * @returns {string} - Durasi yang diformat
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  },
}
