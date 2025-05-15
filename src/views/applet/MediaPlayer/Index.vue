<script setup>
import { computed, ref, watch } from 'vue'
import Slider from './components/SliderComponent.vue'
import Youtube from 'vue3-youtube'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import ClassicButton from '@/components/ClassicButton.vue'

dayjs.extend(UTC)

const playlist = [
  {
    title: 'Kanayobi',
    artist: 'Kanaia Asa',
    album: 'Kanayobi',
    url: 'https://www.youtube.com/watch?v=dTE_TbM2jE4',
  },
  {
    title: 'Rapsodi',
    artist: 'Kanaia Asa',
    album: 'Rapsodi (Cover)',
    url: 'https://www.youtube.com/watch?v=nsbK62FEHUA',
  },
  {
    title: 'Switch',
    artist: 'Kanaia Asa',
    album: 'Switch (Cover)',
    url: 'https://www.youtube.com/watch?v=_ndMYK3eGiY',
  },
]

const showPlaylist = ref(false)

const activeVideoIndex = ref(-1)
const activeVideo = computed(() => {
  if (activeVideoIndex.value === -1) return null
  return playlist[activeVideoIndex.value]
})

const progress = ref(0)
const scrubbingValue = ref(0)
const isScrubbing = ref(false)

function handleScrubChange(newValue) {
  progress.value = newValue
  isScrubbing.value = false
  if (youtubePlayer.value) {
    youtubePlayer.value.seekTo(newValue, true)
  }
}

function handleScrubbing(newValue) {
  scrubbingValue.value = newValue
}

function handleScrubStart(value) {
  scrubbingValue.value = value
  isScrubbing.value = true
}

const youtubePlayer = ref(null)
const playbackStatus = ref(-1)
const isPlaying = computed(() => playbackStatus.value === 1)
const videoDuration = ref(0)

const pollingInterval = ref(null)

watch(youtubePlayer, (player) => {
  if (player) {
    pollingInterval.value = setInterval(() => {
      progress.value = player.getCurrentTime()
    }, 500)
  } else {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
    }
  }
})

const currentTimestamp = computed(() =>
  dayjs
    .unix(isScrubbing.value ? scrubbingValue.value : progress.value)
    .utc()
    .format('mm:ss'),
)

const formattedDuration = computed(() => dayjs.unix(videoDuration.value).utc().format('mm:ss'))

watch(playbackStatus, (status) => {
  if (status === 0) {
    if (activeVideoIndex.value < playlist.length - 1) {
      // Advance to next video in the playlist when it ended
      activeVideoIndex.value++
    } else {
      activeVideoIndex.value = -1
    }
  }
})

function handlePlaybackStateChanged() {
  const player = youtubePlayer.value

  playbackStatus.value = player.getPlayerState()
  videoDuration.value = player.getDuration()
}

function handlePlayBtnClick() {
  if (activeVideoIndex.value === -1) {
    activeVideoIndex.value++
  } else if (youtubePlayer.value) {
    youtubePlayer.value.playVideo()
  }
}

function handlePauseBtnClick() {
  if (youtubePlayer.value) {
    youtubePlayer.value.pauseVideo()
  }
}

function handleStopBtnClick() {
  activeVideoIndex.value = -1
}

function handleNextBtnClick() {
  if (activeVideoIndex.value === playlist.length - 1) {
    activeVideoIndex.value = -1
  } else {
    activeVideoIndex.value++
  }
}

function handlePrevBtnClick() {
  if (activeVideoIndex.value === -1) {
    activeVideoIndex.value = -1
  } else {
    if (progress.value >= 5) {
      // if the currently playing video went past 5 second, rewind to 0
      youtubePlayer.value.seekTo(0, true)
    } else {
      activeVideoIndex.value--
    }
  }
}
</script>

<template>
  <div class="flex flex-col w-screen h-screen overflow-hidden select-none">
    <div style="height: calc(100vh - 95px)" class="flex grow-0 flex-row flex-nowrap h-full">
      <div class="grow-0 w-full bg-black border-4 border-inset shrink">
        <Youtube
          v-if="activeVideoIndex > -1"
          @state-change="handlePlaybackStateChanged"
          ref="youtubePlayer"
          width="100%"
          height="100%"
          class="w-full h-full"
          :src="activeVideo.url"
          :vars="{
            controls: 0,
            autoplay: 1,
          }"
        ></Youtube>
      </div>
      <div
        v-if="showPlaylist"
        class="bg-gray-400 w-[300px] shrink min-h-0 border-4 border-inset divide-gray-600 h-full overflow-y-auto"
      >
        <div
          v-for="(item, i) in playlist"
          :key="item.url"
          :tabindex="i"
          class="p-2 border-b border-gray-500"
          :class="{
            'bg-gray-300': i === activeVideoIndex,
            'cursor-pointer': i !== activeVideoIndex,
          }"
          @click="
            () => {
              activeVideoIndex = i
            }
          "
        >
          <p class="font-bold">{{ item.title }}</p>
          <p>{{ item.artist || 'N/A' }} / {{ item.album || 'N/A' }}</p>
        </div>
      </div>
    </div>
    <div class="bg-gray-300 p-4 space-y-4 h-[95px] shrink-0">
      <div class="shrink-0 flex flex-row gap-4">
        <div class="shrink-0 font-mono">{{ currentTimestamp }} / {{ formattedDuration }}</div>
        <Slider
          @change="handleScrubChange"
          @scrubbing="handleScrubbing"
          @scrub-start="handleScrubStart"
          class="w-full grow-0"
          :min="0"
          :max="videoDuration"
          :step="1"
          :value="progress"
        ></Slider>
      </div>
      <div class="flex flex-row flex-nowrap gap-1">
        <ClassicButton
          @click="handlePlayBtnClick"
          :disabled="playbackStatus === 1 && activeVideoIndex >= 0"
          class="text-2xl group"
        >
          <span class="group-disabled:opacity-50 bi-play-fill"></span>
        </ClassicButton>
        <ClassicButton
          @click="handlePauseBtnClick"
          :disabled="activeVideoIndex === -1 || playbackStatus === 2"
          class="text-2xl group"
        >
          <span class="group-disabled:opacity-50 bi-pause-fill"></span>
        </ClassicButton>
        <ClassicButton
          @click="handleStopBtnClick"
          :disabled="activeVideoIndex === -1"
          class="text-2xl group"
        >
          <span class="group-disabled:opacity-50 bi-stop-fill"></span>
        </ClassicButton>
        <ClassicButton
          @click="handlePrevBtnClick"
          :disabled="activeVideoIndex < 0"
          class="text-2xl group"
        >
          <span class="group-disabled:opacity-50 bi-rewind-fill"></span>
        </ClassicButton>
        <ClassicButton
          @click="handleNextBtnClick"
          :disabled="activeVideoIndex === playlist.length - 1"
          class="text-2xl group"
        >
          <span class="group-disabled:opacity-50 bi-fast-forward-fill"></span>
        </ClassicButton>
        <div class="ms-auto space-x-1">
          <ClassicButton
            @click="
              () => {
                showPlaylist = !showPlaylist
              }
            "
            class="inline-flex gap-2 items-center px-2"
          >
            <span
              class="text-2xl"
              :class="{
                'bi-chevron-bar-left': !showPlaylist,
                'bi-chevron-bar-right': showPlaylist,
              }"
            ></span>
            <span> Playlist </span>
          </ClassicButton>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <style scoped></style> -->
