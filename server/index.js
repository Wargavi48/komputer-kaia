import Bun from 'bun'
import { Database } from 'bun:sqlite'
import path from 'node:path'
import { init } from './bootstrap'
import { VoicemailController } from './controllers/VoicemailController'

const port = process.env.SERVER_PORT || 9888

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
}

const CORS_RESPONSE = () => new Response('OK', { headers: {} })

init()
const voicemaiController = new VoicemailController()

const server = Bun.serve({
  port,
  routes: {
    '/api/voicemail': {
      POST: voicemaiController.store,
      GET: voicemaiController.index,
    },
  },
  fetch() {
    return new Response('OK')
  },
})

console.log('Server listening on ' + port)

function cleanup() {
  // db.close()
}

process.on('beforeExit', (code) => {
  cleanup()
  console.log(`Process beforeExit event with code: ${code}`)
})

process.on('exit', (code) => {
  cleanup()
  console.log(`Process exit event with code: ${code}`)
})

process.on('SIGINT', () => {
  cleanup()
  console.log('Received SIGINT. Cleaning up...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  cleanup()
  console.log('Received SIGTERM. Cleaning up...')
  process.exit(0)
})
