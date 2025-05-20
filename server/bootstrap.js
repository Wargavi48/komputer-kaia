import fs from 'node:fs'
import path from 'node:path'
import { Database } from 'bun:sqlite'

import initSQL from './database/init.sql' with { type: 'text' }

// Check database exists

export function init() {
  const databasePath = path.join(__dirname, 'database', 'database.sqlite')

  if (!fs.existsSync(databasePath)) {
    // Database not exists, creating one
    console.info('database.sqlite does not exists, creating...')
    const database = new Database(databasePath, { create: true })
    const statement = database.query(initSQL)
    statement.run()

    database.close()
  }
}
