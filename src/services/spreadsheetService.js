export async function getSpreadsheetData() {
  // https://docs.google.com/spreadsheets/d//edit?usp=sharing
  const url =
    'https://docs.google.com/spreadsheets/d/1UPWLSPg5OOwdGlvGdFjw5Jyapc_Szpti1OxkXOcL2XE/gviz/tq?tqx=out:json&gid=1526237845'
  try {
    const response = await fetch(url)
    const text = await response.text()

    const json = JSON.parse(text.substr(47).slice(0, -2))
    const cols = json.table.cols.map((col) => col.label)

    const rows = json.table.rows.map((row) => {
      const obj = {}
      row.c.forEach((cell, idx) => {
        obj[cols[idx] || `col${idx}`] = cell?.v ?? null
      })
      return {
        fanLetter: obj['Fan letter'],
        fanSubmission: obj['Fanart submission'],
        name: obj['Nama/Nickname'],
        timestamp: obj['Timestamp'],
        fubject: obj['Subject'],
      }
    })

    return rows
  } catch (e) {
    console.error('Error fetching spreadsheet data:', e)
    return []
  }
}
