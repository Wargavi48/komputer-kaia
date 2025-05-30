<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Slider from '@/components/SliderComponent.vue'
import ClassicButton from '@/components/ClassicButton.vue'
import { formatTime } from '@/utils/formatUtils'

const props = defineProps({
  audioSrc: {
    type: String,
    required: true,
  },
  initialDuration: {
    type: Number,
    default: 0,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
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
    if (audioRef.value) {
      // Chromium returns Infinity for Base64 audio duration
      // Use initialDuration as fallback
      const duration = audioRef.value.duration
      playerState.duration =
        duration === Infinity || isNaN(duration) ? props.initialDuration : duration
    }
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

const volume = ref(0.5)

watch(volume, (v) => {
  setVolume(v)
})

function setVolume(v) {
  if (audioRef.value) {
    /**
     * @type {HTMLAudioElement}
     */
    const audioPlayer = audioRef.value
    audioPlayer.volume = v
  }
}

onMounted(() => {
  setVolume(volume.value)
})
</script>

<template>
  <!-- Classic style audio player -->
  <div class="border-2 border-gray-300 p-2 bg-gray-50 rounded shadow-inner border-inset">
    <audio
      ref="audioRef"
      :autoplay="props.autoplay"
      :loop="props.loop"
      :src="audioSrc"
      @loadedmetadata="audioHandlers.handleLoadedMetadata"
      @timeupdate="audioHandlers.handleTimeUpdate"
      @play="
        () => {
          playerState.isPlaying = true
        }
      "
      @ended="
        () => {
          playerState.isPlaying = false
        }
      "
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

        <div class="flex flex-row items-center">
          <div class="font-mono text-xs shrink-0">
            {{ currentTimestamp }} / {{ formattedDuration }}
          </div>

          <span class="ms-auto bi-volume-off-fill" v-if="volume < 0.25"></span>
          <span class="ms-auto bi-volume-down-fill" v-if="volume >= 0.25 && volume < 0.66"></span>
          <span class="ms-auto bi-volume-up-fill" v-if="volume > 0.66"></span>
          <Slider
            class="ms-4 max-w-[80px]"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @change="
              (v) => {
                volume = v
              }
            "
            @scrubbing="
              (v) => {
                volume = v
              }
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
