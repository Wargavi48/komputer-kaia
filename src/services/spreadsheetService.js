/**
 * Service untuk mengelola data dari Google Spreadsheet
 * Menyediakan fungsi untuk mengambil dan memproses data dari spreadsheet
 */

/**
 * Mengambil data dari Google Spreadsheet dan mengubahnya menjadi format yang lebih mudah digunakan
 * @returns {Promise<Array>} Array berisi data yang sudah diproses dari spreadsheet
 */
export async function getSpreadsheetData() {
  const url = import.meta.env.VITE_SPREADSHEETS_URL

  try {
    // Mengambil data dari URL spreadsheet
    const response = await fetchSpreadsheetData(url)
    // Memproses data mentah menjadi format JSON
    const jsonData = parseSpreadsheetResponse(response)
    // Mengubah data JSON menjadi array objek yang lebih mudah digunakan
    const processedData = transformSpreadsheetData(jsonData)

    return processedData
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error)
    return []
  }
}

/**
 * Mengambil data mentah dari URL spreadsheet
 * @param {string} url - URL spreadsheet yang akan diambil datanya
 * @returns {string} Data mentah dari spreadsheet dalam bentuk teks
 */
async function fetchSpreadsheetData(url) {
  const response = await fetch(url)
  return await response.text()
}

/**
 * Memproses respons teks dari spreadsheet menjadi objek JSON
 * @param {string} responseText - Teks respons dari spreadsheet
 * @returns {Object} Data spreadsheet dalam format JSON
 */
function parseSpreadsheetResponse(responseText) {
  // Google Spreadsheet mengembalikan respons dengan awalan yang perlu dihapus
  // dan akhiran yang juga perlu dihapus untuk mendapatkan JSON yang valid
  const jsonParsingStartIndex = 47
  const jsonText = responseText.substr(jsonParsingStartIndex).slice(0, -2)

  return JSON.parse(jsonText)
}

/**
 * Mengubah data JSON dari spreadsheet menjadi array objek yang lebih mudah digunakan
 * @param {Object} jsonData - Data spreadsheet dalam format JSON
 * @returns {Array} Array berisi objek dengan properti yang sudah dinormalisasi
 */
function transformSpreadsheetData(jsonData) {
  // Mendapatkan label kolom dari data JSON
  const columnLabels = jsonData.table.cols.map((col) => col.label)

  // Mengubah setiap baris data menjadi objek dengan properti yang sesuai
  return jsonData.table.rows.map((row) => {
    // Membuat objek sementara dengan semua kolom dari spreadsheet
    const rowData = {}
    row.c.forEach((cell, columnIndex) => {
      const columnName = columnLabels[columnIndex] || `col${columnIndex}`
      rowData[columnName] = cell?.v ?? null
    })

    // Mengembalikan objek dengan properti yang sudah dinormalisasi
    return {
      fanLetter: rowData['Fan letter'],
      fanSubmission: rowData['Fanart submission'],
      name: rowData['Nama/Nickname'],
      timestamp: rowData['Timestamp'],
      fubject: rowData['Subject'], // Typo? Mungkin seharusnya 'subject'
    }
  })
}
