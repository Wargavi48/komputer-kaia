import { faker } from '@faker-js/faker'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_VOICE_API_URL

function generateFakePhoneNumber(name = 'Unnamed', seed = null) {
  if (seed) {
    faker.seed(seed)
  }

  const vanityString = name
    .replace(/[^A-Za-z0-9]+/g, '')
    .substring(0, 9)
    .toUpperCase()

  const basePhone = faker.helpers.replaceSymbols('(+62) 8##-####-####')

  const phoneNumber = vanityString.padStart(19, basePhone)

  return phoneNumber
}

export async function fetchVoiceMails() {
  const safeVoicemailsUrl = new URL('/api/voicemail/safe', BASE_URL)
  const response = await axios.get(safeVoicemailsUrl.href)

  const voicemails = response.data.map((voicemail) => {
    const seed = voicemail.owner_id.split('-')[0]
    voicemail.phone_number = generateFakePhoneNumber(voicemail.name, parseInt(seed, 16))
    return voicemail
  })

  return voicemails
}
