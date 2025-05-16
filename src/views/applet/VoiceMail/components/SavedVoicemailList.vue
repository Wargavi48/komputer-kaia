<script setup>
import { ref, reactive } from 'vue'
import ClassicButton from '@/components/ClassicButton.vue'
import Slider from '@/components/SliderComponent.vue'
import { formatTime, formatUtils } from '../utils/formatUtils'

defineProps({
  voicemails: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['delete'])

/**
 * Menghapus voicemail dari daftar dan localStorage
 * @param {string} id - ID voicemail yang akan dihapus
 */
const deleteVoicemail = (id) => {
  // Konfirmasi penghapusan
  if (!confirm('Yakin ingin menghapus voicemail ini?')) return

  // Emit event ke parent
  emit('delete', id)
}

/**
 * Membuat state untuk player voicemail yang disimpan
 * @param {string} id - ID voicemail
 * @returns {Object} - State object untuk player
 */
function createSavedVoicemailPlayerState(id) {
  return reactive({
    id,
    audioRef: null,
    isPlaying: false,
    progress: 0,
    isScrubbing: false,
    scrubbingValue: 0,
    duration: 0,
  })
}

// State untuk player voicemail yang disimpan
const savedPlayerStates = ref({})

/**
 * Inisialisasi state player untuk voicemail
 * @param {string} id - ID voicemail
 */
function initSavedPlayerState(id) {
  if (!savedPlayerStates.value[id]) {
    savedPlayerStates.value[id] = createSavedVoicemailPlayerState(id)
  }
}

/**
 * Toggle play/pause untuk voicemail yang disimpan
 * @param {string} id - ID voicemail
 */
function toggleSavedPlay(id) {
  const state = savedPlayerStates.value[id]
  if (!state || !state.audioRef) return

  // Pastikan audio sudah dimuat sebelum mencoba memutar
  if (state.audioRef.readyState < 2) {
    // Jika belum dimuat, tambahkan event listener untuk memutar setelah dimuat
    const playWhenReady = () => {
      state.audioRef
        .play()
        .then(() => {
          state.isPlaying = true
        })
        .catch((err) => {
          console.error('Error memutar audio:', err)
          state.isPlaying = false
        })
      state.audioRef.removeEventListener('canplay', playWhenReady)
    }

    state.audioRef.addEventListener('canplay', playWhenReady)
    // Muat ulang untuk memicu event canplay
    state.audioRef.load()
    return
  }

  if (state.audioRef.paused) {
    state.audioRef
      .play()
      .then(() => {
        state.isPlaying = true
      })
      .catch((err) => {
        console.error('Error memutar audio:', err)
        state.isPlaying = false
      })
  } else {
    state.audioRef.pause()
    state.isPlaying = false
  }
}

/**
 * Handler dan utilitas untuk saved audio player
 */
const savedPlayerUtils = {
  // Audio handlers
  audioHandlers: {
    handleLoadedMetadata(id) {
      const state = savedPlayerStates.value[id]
      if (state && state.audioRef) {
        state.duration = state.audioRef.duration
      }
    },

    handleTimeUpdate(id) {
      const state = savedPlayerStates.value[id]
      if (state && !state.isScrubbing && state.audioRef) {
        state.progress = state.audioRef.currentTime
      }
    },
  },

  // Scrub handlers
  scrubHandlers: {
    handleStart(id, val) {
      const state = savedPlayerStates.value[id]
      if (state) {
        state.isScrubbing = true
        state.scrubbingValue = val
      }
    },

    handleScrubbing(id, val) {
      const state = savedPlayerStates.value[id]
      if (state) {
        state.scrubbingValue = val
      }
    },

    handleChange(id, val) {
      const state = savedPlayerStates.value[id]
      if (state) {
        state.isScrubbing = false
        if (state.audioRef) {
          state.audioRef.currentTime = val
          state.progress = val
        }
      }
    },
  },

  // Time utilities
  timeUtils: {
    getTimestamp(id) {
      const state = savedPlayerStates.value[id]
      if (!state) return '00:00'

      return formatTime(state.isScrubbing ? state.scrubbingValue : state.progress)
    },

    getDuration(id) {
      const state = savedPlayerStates.value[id]
      if (!state) return '00:00'

      return formatTime(state.duration)
    },
  },
}
</script>

<template>
  <div v-if="voicemails.length > 0" class="mt-6">
    <h3 class="text-lg font-semibold mb-2">Voice Messages List</h3>
    <div class="space-y-3">
      <div
        v-for="voicemail in voicemails"
        :key="voicemail.id"
        class="p-3 border border-gray-300 bg-white"
      >
        <div class="flex justify-between items-center mb-1">
          <div class="font-medium">{{ voicemail.name }}</div>
          <ClassicButton @click="deleteVoicemail(voicemail.id)" class="text-sm px-1">
            <span class="bi-trash"></span>
          </ClassicButton>
        </div>

        <div class="text-xs text-gray-500 mb-2">
          <span>{{ formatUtils.formatDate(voicemail.timestamp) }}</span>
        </div>

        <!-- Classic style audio player for saved voicemail -->
        <div class="border-2 border-gray-300 p-2 bg-gray-50 rounded shadow-inner border-inset">
          <audio
            :ref="
              (el) => {
                if (el) {
                  initSavedPlayerState(voicemail.id)
                  savedPlayerStates[voicemail.id].audioRef = el
                }
              }
            "
            preload="metadata"
            :src="voicemail.url || null"
            @loadedmetadata="savedPlayerUtils.audioHandlers.handleLoadedMetadata(voicemail.id)"
            @timeupdate="savedPlayerUtils.audioHandlers.handleTimeUpdate(voicemail.id)"
            class="hidden"
          ></audio>

          <div class="flex items-start gap-4">
            <ClassicButton @click="toggleSavedPlay(voicemail.id)" class="px-2">
              <span
                :class="
                  savedPlayerStates[voicemail.id]?.isPlaying ? 'bi-pause-fill' : 'bi-play-fill'
                "
              ></span>
            </ClassicButton>
            <div class="grow space-y-2">
              <Slider
                class="w-full grow-0"
                :min="0"
                :max="savedPlayerStates[voicemail.id]?.duration || 0"
                :step="1"
                :value="
                  savedPlayerStates[voicemail.id]?.isScrubbing
                    ? savedPlayerStates[voicemail.id]?.scrubbingValue
                    : savedPlayerStates[voicemail.id]?.progress
                "
                @scrub-start="
                  (val) => savedPlayerUtils.scrubHandlers.handleStart(voicemail.id, val)
                "
                @scrubbing="
                  (val) => savedPlayerUtils.scrubHandlers.handleScrubbing(voicemail.id, val)
                "
                @change="(val) => savedPlayerUtils.scrubHandlers.handleChange(voicemail.id, val)"
              />

              <div class="font-mono text-xs">
                {{ savedPlayerUtils.timeUtils.getTimestamp(voicemail.id) }} /
                {{ savedPlayerUtils.timeUtils.getDuration(voicemail.id) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
