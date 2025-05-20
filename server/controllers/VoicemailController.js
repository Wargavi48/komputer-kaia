import { Database } from 'bun:sqlite'
import path from 'node:path'
import Bun from 'bun'
import { CORS_HEADERS } from '..'

export class VoicemailController {
  /**
   * Handle store request
   * @param {import('bun').BunRequest} req
   */
  async store(req) {
    const db = new Database(path.join(__dirname, '..', 'database', 'database.sqlite'))
    const body = await req.formData()

    const audio = body.get('audio')
    const oldFilename = audio.name
    const fallbackName =
      Math.round(Math.random() * 9999)
        .toString()
        .padStart(4, '0') + '.webm'

    if (!audio) {
      throw new Error('Audio is required')
    }

    const filename = `${Date.now()}-${oldFilename || fallbackName}`
    const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', filename)

    await Bun.write(uploadPath, audio)

    const audioData = {
      owner_id: body.get('owner_id') || null,
      name: body.get('name') || null,
      audio_url: `/uploads/${filename}`,
      allowed: true,
    }

    const statment = db.prepare(
      'INSERT INTO voicemail (owner_id, name, audio_url, allowed) VALUES (?,?,?,?)',
    )
    statment.run(audioData.owner_id, audioData.name, audioData.audio_url, audioData.allowed)

    db.close()
    return Response.json(audioData, { headers: CORS_HEADERS })
  }

  /**
   * Handle get all request
   * @param {import('bun').BunRequest} req
   */
  async index(req) {
    const db = new Database(path.join(__dirname, '..', 'database', 'database.sqlite'))

    const query = db.query('SELECT * FROM voicemail')

    return Response.json(query.all(), { headers: CORS_HEADERS })
  }
}
