<script setup>
import { ref } from 'vue'
import ClassicButton from '@/components/ClassicButton.vue'
import { formatUtils } from '../utils/formatUtils'

const emit = defineEmits(['recording-complete', 'recording-start'])

// Audio & recording state
const mediaRecorder = ref(null)
const isRecording = ref(false)
const recordedBlobUrl = ref(null)
const recordedAudioURL = ref(null)
const recordedChunks = ref([])
const recordingStart = ref(null)
const recordingDuration = ref(0)
let intervalId = null

/**
 * Memulai perekaman audio
 */
const startRecording = async () => {
  try {
    // Minta akses mikrofon
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream)
    recordedChunks.value = []

    // Tangkap data audio saat tersedia
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data)
      }
    }

    // Proses audio saat perekaman berhenti
    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(recordedChunks.value, { type: 'audio/webm' })
      recordedAudioURL.value = URL.createObjectURL(audioBlob)
      // Simpan blob untuk konversi nanti saat menyimpan
      recordedBlobUrl.value = audioBlob
      clearInterval(intervalId)

      // Emit event dengan data rekaman
      emit('recording-complete', {
        blob: recordedBlobUrl.value,
        url: recordedAudioURL.value,
        duration: recordingDuration.value,
      })
    }

    // Mulai perekaman
    mediaRecorder.value.start()
    isRecording.value = true
    recordingStart.value = Date.now()
    emit('recording-start')

    // Update durasi perekaman setiap detik
    intervalId = setInterval(() => {
      recordingDuration.value = Math.floor((Date.now() - recordingStart.value) / 1000)
    }, 1000)
  } catch (err) {
    console.error('Gagal akses mic:', err)
    alert('Mikrofon tidak tersedia atau akses ditolak.')
  }
}

/**
 * Menghentikan perekaman audio
 */
function stopRecording() {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
  }
}

// Expose necessary data and methods
defineExpose({
  isRecording,
  recordedAudioURL,
  recordedBlobUrl,
  recordingDuration,
  stopRecording,
})
</script>

<template>
  <div class="flex items-center mb-3">
    <ClassicButton
      @click="isRecording ? stopRecording() : startRecording()"
      class="text-2xl group mr-3"
    >
      <span
        :class="[
          'group-disabled:opacity-50',
          isRecording ? 'bi-stop-circle-fill text-red-600 animate-pulse' : 'bi-mic-fill',
        ]"
      ></span>
    </ClassicButton>

    <div v-if="isRecording" class="text-sm font-mono text-red-600">
      🔴 Recording: {{ formatUtils.formatDuration(recordingDuration) }}
    </div>

    <slot name="audio-player"></slot>
  </div>
</template>
