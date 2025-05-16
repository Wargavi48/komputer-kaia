<script setup>
import { ref, reactive, computed } from 'vue'
import Slider from '@/components/SliderComponent.vue'
import ClassicButton from '@/components/ClassicButton.vue'
import { formatTime } from '../utils/formatUtils'

const props = defineProps({
  audioSrc: {
    type: String,
    required: true,
  },
  initialDuration: {
    type: Number,
    default: 0,
  },
})

const audioRef = ref(null)

// Playback state
const playerState = reactive({
  isPlaying: false,
  progress: 0,
  isScrubbing: false,
  scrubbingValue: 0,
  duration: props.initialDuration,
})

/**
 * Format waktu saat ini dalam format mm:ss
 */
const currentTimestamp = computed(() =>
  formatTime(playerState.isScrubbing ? playerState.scrubbingValue : playerState.progress),
)

/**
 * Format durasi total dalam format mm:ss
 */
const formattedDuration = computed(() => formatTime(playerState.duration))

/**
 * Toggle play/pause audio player
 */
function togglePlay() {
  const player = audioRef.value
  if (!player) return

  if (player.paused) {
    player.play()
    playerState.isPlaying = true
  } else {
    player.pause()
    playerState.isPlaying = false
  }
}

/**
 * Handler untuk event audio player
 */
const audioHandlers = {
  handleLoadedMetadata() {
    if (audioRef.value) playerState.duration = audioRef.value.duration
  },

  handleTimeUpdate() {
    if (!playerState.isScrubbing && audioRef.value) {
      playerState.progress = audioRef.value.currentTime
    }
  },
}

/**
 * Handler untuk scrubbing pada audio player
 */
const scrubHandlers = {
  handleScrubStart(val) {
    playerState.isScrubbing = true
    playerState.scrubbingValue = val
  },

  handleScrubbing(val) {
    playerState.scrubbingValue = val
  },

  handleScrubChange(val) {
    playerState.isScrubbing = false
    if (audioRef.value) {
      audioRef.value.currentTime = val
      playerState.progress = val
    }
  },
}
</script>

<template>
  <!-- Classic style audio player -->
  <div class="border-2 border-gray-300 p-2 bg-gray-50 rounded shadow-inner border-inset">
    <audio
      ref="audioRef"
      :src="audioSrc"
      @loadedmetadata="audioHandlers.handleLoadedMetadata"
      @timeupdate="audioHandlers.handleTimeUpdate"
      class="hidden"
    ></audio>

    <div class="flex items-start gap-4">
      <ClassicButton @click="togglePlay" class="px-2">
        <span :class="playerState.isPlaying ? 'bi-pause-fill' : 'bi-play-fill'"></span>
      </ClassicButton>
      <div class="grow space-y-2">
        <Slider
          class="w-full grow-0"
          :min="0"
          :max="playerState.duration"
          :step="1"
          :value="playerState.isScrubbing ? playerState.scrubbingValue : playerState.progress"
          @scrub-start="scrubHandlers.handleScrubStart"
          @scrubbing="scrubHandlers.handleScrubbing"
          @change="scrubHandlers.handleScrubChange"
        />

        <div class="font-mono text-xs">{{ currentTimestamp }} / {{ formattedDuration }}</div>
      </div>
    </div>
  </div>
</template>
