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

const CORS_RESPONSE = () => new Response('OK', { headers: CORS_HEADERS })

init()
const voicemaiController = new VoicemailController()

const server = Bun.serve({
  port,
  routes: {
    '/api/voicemail': {
      POST: voicemaiController.store,
      GET: voicemaiController.index,
      OPTIONS: CORS_RESPONSE,
    },
    '/api/voicemail/:id': {
      DELETE: voicemaiController.delete,
      OPTIONS: CORS_RESPONSE,
    },
    '/api/voicemail/:id/allow/:allowed': {
      PUT: voicemaiController.updateStatus,
      PATCH: voicemaiController.updateStatus,
      OPTIONS: CORS_RESPONSE,
    },
    '/api/voicemail/safe': {
      GET: voicemaiController.getSafe,
      OPTIONS: CORS_RESPONSE,
    },
    '/api/voicemail/my/:owner_id': {
      GET: voicemaiController.getMy,
      OPTIONS: CORS_RESPONSE,
    },
    '/api/me': (req, server) => {
      const remoteAddress = server.requestIP(req)
      const forwardedFor = req.headers.get('X-Forwarded-For')
      const nginxRealIP = req.headers.get('X-Real-IP')

      return Response.json({ ip_addr: remoteAddress, forwardedFor, nginxRealIP })
    },
  },
  fetch() {
    return CORS_RESPONSE()
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
