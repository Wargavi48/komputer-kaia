<script setup>
import ClassicIcon from '@/components/ClassicIcon.vue'
import RecorderComponent from '../applet/VoiceMail/components/RecorderComponent.vue'
import { v7 as uuidv7 } from 'uuid'
import { computed, onMounted, ref, watch } from 'vue'
import { audioConverter } from '../applet/VoiceMail/utils/audioConverter'
import AudioPlayer from '../applet/VoiceMail/components/AudioPlayer.vue'
import axios from 'axios'
import ClassicButton from '@/components/ClassicButton.vue'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

dayjs.extend(RelativeTime)

const USER_ID_FIELD = 'voice_user_id'
const userId = ref(null)

const recordingDurationLimit = import.meta.env.VITE_VOICE_DURATION_LIMIT

const audioRecorder = ref(null)
const recordedData = ref(null)
const draftRecordingDataUrl = ref(null)

const apiBaseUrl = import.meta.env.VITE_VOICE_API_URL || window.location.origin
const voicemailApiUrl = new URL('/api/voicemail', apiBaseUrl)
const myVoicemailUrl = computed(() => {
  return new URL(`/api/voicemail/my/${userId.value}`, apiBaseUrl)
})

const isLoading = ref(true)
const myRecordings = ref([])

watch(recordedData, async (newData) => {
  if (newData) {
    draftRecordingDataUrl.value = await audioConverter.blobToBase64(newData.blob)
  }
})

async function fetchMyRecordings() {
  isLoading.value = true
  const response = await axios.get(myVoicemailUrl.value.href)

  myRecordings.value = response.data
  isLoading.value = false
}

watch(userId, (id) => {
  if (id) {
    fetchMyRecordings()
  }
})
const fingerprint = ref(null)

onMounted(() => {
  // Generate unique ID to identify user without requiring auth
  const fpAgent = FingerprintJS.load()

  fpAgent
    .then((fp) => fp.get())
    .then((result) => {
      fingerprint.value = result.visitorId
    })

  const savedUserId = window.localStorage.getItem(USER_ID_FIELD)
  if (savedUserId !== null) {
    userId.value = savedUserId
  } else {
    userId.value = uuidv7()
    window.localStorage.setItem(USER_ID_FIELD, userId.value)
  }
})

const recordingStartTimestamp = ref(null)
const recordingDuration = ref(0)

const countdownInterval = ref(null)
function handleRecordingStart() {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  recordedData.value = null
  recordingDuration.value = 0
  recordingStartTimestamp.value = Date.now()

  countdownInterval.value = setInterval(() => {
    const durationInMs = Date.now() - recordingStartTimestamp.value
    recordingDuration.value = durationInMs / 1000

    if (durationInMs / 1000 >= recordingDurationLimit) {
      audioRecorder.value.stopRecording()
    }
  }, 50)
}

function handleRecordingComplete(data) {
  recordedData.value = data
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    // recordingDuration.value = 0
    recordingStartTimestamp.value = null
  }
}

const uploadLimit = import.meta.env.VITE_VOICE_UPLOAD_LIMIT || 2
const senderName = ref('')
const isSending = ref(false)
async function sendVoicemail() {
  try {
    if (!recordedData.value?.blob) {
      alert('Rekaman pesan suara invalid, ulangi lagi')
      return
    }
    isSending.value = true
    const formData = new FormData()
    formData.append('name', senderName.value)
    formData.append('owner_id', userId.value)
    formData.append('client_fingerprint', fingerprint.value)
    formData.append('duration', recordingDuration.value)

    const fileName = senderName.value.trim().replaceAll(/[^a-zA-Z0-9]+/g, '-') + '.webm'
    const audioFile = new File(
      [audioConverter.base64ToBlob(draftRecordingDataUrl.value)],
      fileName,
      {
        lastModified: Date.now,
      },
    )
    formData.append('audio', audioFile)

    await axios.post(voicemailApiUrl.href, formData)
    recordedData.value = null
    draftRecordingDataUrl.value = null

    fetchMyRecordings()
  } catch (error) {
    if (error.response?.status === 429) {
      alert('Kamu terlalu banyak mengirim voicemail, Maks: ' + uploadLimit + ' per orang')
    } else {
      alert('Terjadi error ketika mengirim voicemail')
    }
    console.error(error)
  } finally {
    isSending.value = false
  }
}

const isLimitReached = computed(() => myRecordings.value.length >= uploadLimit)

const isDeleting = ref(false)
async function deleteRecording(i) {
  if (!confirm('Hapus pesan suara? Pesan suara yang dihapus tidak dapat dikembalikan')) return

  const selected = myRecordings.value[i]
  isDeleting.value = true
  try {
    const { id } = selected

    await axios.delete(voicemailApiUrl.href + '/' + id)
    fetchMyRecordings()
  } catch (error) {
    alert('Terjadi error saat menghapus pesan suara')
    console.error(error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center bg-brand-blue-dark overflow-x-hidden"
  >
    <div class="space-y-2 m-10 relative z-20">
      <div class="border border-black max-w-5xl min-w-sm shadow-classic">
        <div class="border-4 border-outset bg-gray-300 w-full">
          <div
            class="w-full bg-linear-to-r from-kana-blue to-kana-purple font-bold px-2 p-1 flex flex-row gap-3 items-center relative z-10"
          >
            <ClassicIcon name="telephone" class="w-6" />
            <p>Voicemail Recorder</p>
          </div>
          <div class="p-4">
            <div class="flex flex-row gap-4" v-if="isLimitReached">
              <ClassicIcon name="warning" class="w-10" />
              <p>
                Anda Sudah mencapai batas perekaman pesan suara. Silakan hapus rekaman lama untuk
                merekam pesan baru
              </p>
            </div>
            <RecorderComponent
              v-if="!isLimitReached && !isLoading"
              ref="audioRecorder"
              @recording-start="handleRecordingStart"
              @recording-complete="handleRecordingComplete"
            >
              <template #audio-player>
                <div
                  class="flex-1 space-y-2"
                  v-if="draftRecordingDataUrl && recordedData && !recordingStartTimestamp"
                >
                  <AudioPlayer
                    :audio-src="draftRecordingDataUrl"
                    :initial-duration="recordedData.duration"
                  />
                </div>
                <div
                  v-if="!draftRecordingDataUrl && !recordingStartTimestamp"
                  class="flex flex-row items-center gap-2"
                >
                  <ClassicIcon name="hand-left" />
                  <p>Tekan tombol untuk merekam pesan suara</p>
                </div>
              </template>
            </RecorderComponent>
            <form
              autocomplete="off"
              @submit.prevent="
                () => {
                  sendVoicemail()
                }
              "
              class="space-y-2"
              v-if="recordedData"
            >
              <div class="space-y-1">
                <label for="name" class="block">Nama</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Kania Anisa"
                  v-model="senderName"
                  class="border py-1 px-2 bg-white w-full"
                  required
                />
              </div>
              <ClassicButton :disabled="isSending" class="w-full py-1" type="submit">
                <span v-if="!isSending">Kirim</span>
                <span v-if="isSending">Mengirim Pesan Suara...</span>
              </ClassicButton>
            </form>
            <div class="border w-full overflow-hidden" v-if="recordingStartTimestamp">
              <!-- Progress Bar -->
              <div
                class="bg-blue-700 h-4"
                :style="{
                  width: `${(recordingDuration / recordingDurationLimit) * 100}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="border border-black max-w-5xl min-w-sm shadow-classic">
        <div class="border-4 border-outset bg-gray-300">
          <div class="w-full bg-kana-blue-pale px-2 py-1">
            <div class="w-full flex flex-row gap-2">
              <ClassicIcon name="cd-audio" class="w-6" />
              <p>My Voicemails</p>
            </div>
          </div>
          <div class="w-full bg-gray-300 p-2">
            <p class="text-center italic" v-if="!myRecordings || myRecordings.length === 0">
              Kamu belum mengirimkan pesan suara
            </p>
            <div class="space-y-2">
              <div
                v-for="(recording, i) in myRecordings"
                class="bg-white space-y-2 px-4 py-2 border border-inset"
                :key="recording.id"
              >
                <div class="flex flex-row">
                  <p class="text-sm">{{ dayjs.utc(recording.created_at).fromNow() }}</p>
                  <ClassicButton
                    @click="() => deleteRecording(i)"
                    :disabled="isDeleting"
                    type="button"
                    class="ms-auto"
                  >
                    <span class="bi-trash"></span>
                  </ClassicButton>
                </div>
                <AudioPlayer
                  class="!border-0 bg-transparent"
                  :audio-src="recording.audio_url"
                  :initial-duration="recording.duration || recordingDurationLimit"
                ></AudioPlayer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border border-black max-w-3xl mx-10 my-4 min-w-sm relative z-20">
      <div class="w-full border-4 border-outset">
        <div class="px-2 py-1 bg-kana-blue-pale w-full">
          <div class="w-full flex flex-row gap-2">
            <ClassicIcon name="notepad" class="w-6" />
            <p>Notepad</p>
          </div>
        </div>
        <div class="border-4 border-inset bg-white w-full p-4 space-y-2">
          <h1 class="text-2xl font-bold">Voicemail untuk Kanaia Asa</h1>
          <p>
            Dalam rangka graduation Kanaia Asa, Wargavi48 memberikan kesempatan spesial buat para
            fans untuk menyampaikan pesan terakhir kepada Kana lewat voicemail! Kamu bisa merekam
            pesan suara berdurasi maksimal {{ recordingDurationLimit }} detik sebagai bentuk
            dukungan dan salam perpisahan.
          </p>
          <h2 class="text-xl font-bold">Ketentuan:</h2>
          <ol class="list-decimal ps-4">
            <li>Durasi maksimal record {{ recordingDurationLimit }} detik</li>
            <li>Batas maksimum {{ uploadLimit }} pesan suara per orang</li>
            <li>Isi rekaman pesan suara tidak boleh mengandung SARA</li>
            <li>
              Rekaman Pesan suara mungkin diperiksa oleh tim moderator sebelum disampaikan kepada
              Kanaia
            </li>
            <li>
              Moderator berhak dan dapat menghapus rekaman Anda karena alasan apapun, keputusan
              moderator bersifat final
            </li>
            <li>
              Dengan mengirim pesan suara, Anda setuju untuk suara anda diperdengarkan secara publik
              dan setuju dengan ketentuan-ketentuan yang disebutkan di atas
            </li>
          </ol>
        </div>
      </div>
    </div>
    <img src="/logo-memori-asa.png" alt="logo memori asa" class="fixed right-4 bottom-4 w-60 z-0" />
  </div>
</template>
