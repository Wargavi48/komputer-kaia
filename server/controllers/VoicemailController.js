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
    try {
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
        duration: body.get('duration'),
      }

      const statment = db.prepare(
        'INSERT INTO voicemail (owner_id, name, audio_url, allowed, duration) VALUES (?,?,?,?,?)',
      )
      statment.run(
        audioData.owner_id,
        audioData.name,
        audioData.audio_url,
        audioData.allowed,
        audioData.duration,
      )

      db.close()
      return Response.json(audioData, { headers: CORS_HEADERS })
    } catch (error) {
      return Response.json({
        message: 'error',
        error: error.message,
      })
    }
  }

  /**
   * Handle get all request
   * @param {import('bun').BunRequest} req
   */
  async index(req) {
    const db = new Database(path.join(__dirname, '..', 'database', 'database.sqlite'))

    const query = db.query(
      'SELECT * FROM voicemail WHERE deleted_at IS NULL ORDER BY created_at ASC',
    )

    return Response.json(query.all(), { headers: CORS_HEADERS })
  }

  /**
   * Handle get all safe voicemails
   * @param {import('bun').BunRequest} req
   */
  async getSafe(req) {
    const db = new Database(path.join(__dirname, '..', 'database', 'database.sqlite'))

    const query = db.query(
      'SELECT * FROM voicemail WHERE allowed = true && deleted_at IS NULL ORDER BY created_at ASC',
    )

    return Response.json(query.all(), { headers: CORS_HEADERS })
  }

  /**
   * Handle get safe voicemails of a particular owner
   * @param {import('bun').BunRequest} req
   */
  async getMy(req) {
    const ownerId = req.params.owner_id
    const db = new Database(path.join(__dirname, '..', 'database', 'database.sqlite'))

    const query = db.query(
      'SELECT * FROM voicemail WHERE allowed = true AND owner_id = ? AND deleted_at IS NULL ORDER BY created_at ASC',
    )

    return Response.json(query.all(ownerId), { headers: CORS_HEADERS })
  }

  /**
   * handle delete request
   * @param {import('bun').BunRequest} req
   */
  async delete(req) {
    const id = req.params.id
    const db = new Database(path.join(__dirname, '..', 'database', 'database.sqlite'))

    const query = db.query('SELECT * FROM voicemail WHERE id = ? AND deleted_at IS NULL')

    const voiceMail = query.get(id)
    if (voiceMail === null) {
      return Response.json(
        {
          message: 'Not Found',
        },
        { status: 404, headers: CORS_HEADERS },
      )
    }

    const prepared = db.prepare('UPDATE voicemail SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?')
    prepared.run(id)

    return Response.json(
      {
        message: 'deleted',
        data: voiceMail,
      },
      { headers: CORS_HEADERS },
    )
  }

  /**
   * Handle allow/disallow Request
   * @param {import('bun').BunRequest} req
   */
  async updateStatus(req) {
    const id = req.params.id
    const allowed = Number(req.params.allowed)

    const db = new Database(path.join(__dirname, '..', 'database', 'database.sqlite'))

    const query = db.query('SELECT * FROM voicemail WHERE id = ? AND deleted_at IS NULL')

    const voiceMail = query.get(id)
    if (voiceMail === null) {
      return Response.json(
        {
          message: 'Not Found',
        },
        { status: 404, headers: CORS_HEADERS },
      )
    }

    const prepared = db.prepare('UPDATE voicemail SET allowed = ? WHERE id = ?')
    prepared.run(Boolean(allowed), id)

    return Response.json(
      {
        message: 'updated',
        data: query.get(id),
      },
      { headers: CORS_HEADERS },
    )
  }
}
