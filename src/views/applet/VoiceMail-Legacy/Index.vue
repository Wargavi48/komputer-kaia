<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
/**
 * Voice Mail Recorder & Player
 * Komponen ini memungkinkan pengguna untuk merekam, menyimpan, dan memutar pesan suara.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import ClassicButton from '@/components/ClassicButton.vue'
import RecorderComponent from './components/RecorderComponent.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import SavedVoicemailList from './components/SavedVoicemailList.vue'
import { audioConverter } from '@/utils/audioConverter'

// Form state
const name = ref('')

// Audio & recording state
const recorderRef = ref(null)
const savedVoicemails = ref([])
const recordedAudioData = ref(null)

/**
 * Inisialisasi data dari localStorage saat komponen dimuat
 */
onMounted(() => {
  // Load saved voicemails dari localStorage
  const savedData = localStorage.getItem('savedVoicemails')
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData)

      // Konversi base64 ke URL untuk setiap voicemail
      parsedData.forEach((voicemail) => {
        // Jika menggunakan format lama (url) atau format baru (audioData)
        if (voicemail.audioData) {
          try {
            // Konversi base64 ke Blob
            const blob = audioConverter.base64ToBlob(voicemail.audioData)
            // Buat URL dari Blob
            voicemail.url = URL.createObjectURL(blob)
          } catch (convErr) {
            console.error('Error mengkonversi audio data:', convErr)
            // Jika gagal konversi, set URL ke null
            voicemail.url = null
          }
        } else if (voicemail.url && voicemail.url.startsWith('blob:')) {
          // URL blob lama tidak valid setelah refresh, set ke null
          if (voicemail.audioData) {
            try {
              // Coba buat URL baru dari audioData
              const blob = audioConverter.base64ToBlob(voicemail.audioData)
              voicemail.url = URL.createObjectURL(blob)
            } catch (e) {
              console.error('Error membuat URL baru:', e)
              voicemail.url = null
            }
          } else {
            voicemail.url = null
          }
        }
      })

      savedVoicemails.value = parsedData
    } catch (err) {
      console.error('Error parsing saved voicemails:', err)
      // Jika terjadi error parsing, reset localStorage
      localStorage.removeItem('savedVoicemails')
    }
  }
})

// Bersihkan URL objek saat komponen di-unmount untuk mencegah memory leak
onUnmounted(() => {
  // Revoke semua URL objek yang dibuat
  savedVoicemails.value.forEach((voicemail) => {
    if (voicemail.url && voicemail.url.startsWith('blob:')) {
      URL.revokeObjectURL(voicemail.url)
    }
  })
})

/**
 * Handler untuk event selesai rekaman
 */
const handleRecordingComplete = (data) => {
  recordedAudioData.value = data
}

/**
 * Menyimpan voicemail ke daftar dan localStorage
 */
const saveVoicemail = async () => {
  // Validasi input
  if (!name.value || !recordedAudioData.value?.url) {
    alert('Nama dan rekaman suara harus diisi!')
    return
  }

  // Buat ID unik dengan timestamp menggunakan dayjs untuk konsistensi cross-browser
  const id = Date.now().toString()
  const timestamp = dayjs().toISOString()

  // Konversi Blob ke base64 untuk penyimpanan
  let audioData = null
  try {
    if (recordedAudioData.value.blob) {
      audioData = await audioConverter.blobToBase64(recordedAudioData.value.blob)
    } else {
      alert('Error: Audio tidak tersedia')
      return
    }
  } catch (err) {
    console.error('Error mengkonversi audio:', err)
    alert('Gagal menyimpan audio. Silakan coba lagi.')
    return
  }

  // Buat URL dari audioData untuk pemutaran langsung
  const blob = audioConverter.base64ToBlob(audioData)
  const url = URL.createObjectURL(blob)

  // Tambahkan ke daftar voicemail
  savedVoicemails.value.push({
    id,
    name: name.value,
    audioData, // Simpan base64 string untuk persistensi
    url, // Simpan URL untuk pemutaran langsung
    timestamp,
    duration: recordedAudioData.value.duration,
  })

  // Simpan ke localStorage
  localStorage.setItem('savedVoicemails', JSON.stringify(savedVoicemails.value))

  // Reset form
  name.value = ''
  recordedAudioData.value = null
  if (recorderRef.value) {
    recorderRef.value.recordedAudioURL = null
    recorderRef.value.recordedBlobUrl = null
    recorderRef.value.recordingDuration = 0
  }
}

/**
 * Menghapus voicemail dari daftar dan localStorage
 * @param {string} id - ID voicemail yang akan dihapus
 */
const deleteVoicemail = (id) => {
  // Filter voicemail dengan ID yang tidak sama
  savedVoicemails.value = savedVoicemails.value.filter((vm) => vm.id !== id)

  // Update localStorage
  localStorage.setItem('savedVoicemails', JSON.stringify(savedVoicemails.value))
}
</script>

<template>
  <div class="p-4 w-full h-full">
    <!-- === Recording Section === -->
    <div class="mb-6 p-4 bg-white">
      <RecorderComponent ref="recorderRef" @recording-complete="handleRecordingComplete">
        <template #audio-player>
          <div class="flex-1" v-if="recordedAudioData?.url">
            <AudioPlayer
              :audio-src="recordedAudioData.url"
              :initial-duration="recordedAudioData.duration"
            />
          </div>
        </template>
      </RecorderComponent>

      <!-- Name input and save button -->
      <div class="flex mt-3">
        <input
          v-model="name"
          type="text"
          placeholder="Voice message name"
          class="flex-1 border border-gray-300 px-2 py-1 mr-2"
        />
        <ClassicButton
          @click="saveVoicemail"
          :disabled="!recordedAudioData?.url || !name.trim()"
          class="px-3"
        >
          Save
        </ClassicButton>
      </div>
    </div>

    <!-- === Saved Voicemails List === -->
    <SavedVoicemailList :voicemails="savedVoicemails" @delete="deleteVoicemail" />
  </div>
</template>
