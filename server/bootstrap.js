import fs from 'node:fs'
import path from 'node:path'
import { Database } from 'bun:sqlite'

// import initSQL from './database/init.sql' with { type: 'text' }
import Bun, { Glob } from 'bun'

// Check database exists

export async function init() {
  const databasePath = path.join(__dirname, 'database', 'database.sqlite')

  let database = new Database(databasePath)
  const migrationPath = path.join(__dirname, 'database', 'simple-migrations')
  const migrationGlob = new Glob('**/*.sql')

  // Run all Simple Migrations
  // This will run all sql statement ignoring any errors
  for (const file of migrationGlob.scanSync(migrationPath + '/')) {
    try {
      const filePath = path.join(migrationPath, file)
      const sql = await Bun.file(filePath).text()

      const statement = database.query(sql)
      statement.run()
    } catch (error) {
      console.warn(`${file} failed to execute, ignoring...`)
    }
  }
  database.close()
}
