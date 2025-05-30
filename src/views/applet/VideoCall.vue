<script setup>
import IconPhone from '@/components/icons/IconPhone.vue'
import IconCameraOff from '@/components/icons/IconCameraOff.vue'
import IconMicOff from '@/components/icons/IconMicOff.vue'
import IconMonitorUp from '@/components/icons/IconMonitorUp.vue'
import ClassicButton from '@/components/ClassicButton.vue'
import Youtube from 'vue3-youtube'
import { ref, watch } from 'vue'
import Slider from '@/components/SliderComponent.vue'
import ClassicIcon from '@/components/ClassicIcon.vue'

const videoSource = 'https://www.youtube.com/watch?v=aI982MIbMCc'
const youtubePlayer = ref(null)
const isMuted = ref(false)
const volume = ref(50)

watch(isMuted, (isNowMuted, wasMuted) => {
  if (isNowMuted === wasMuted || !youtubePlayer.value) return

  if (isNowMuted) {
    youtubePlayer.value.mute()
    // window.localStorage.setItem(SETTING_PREFER_MUTED, 1)
  } else {
    youtubePlayer.value.unMute()
    // window.localStorage.removeItem(SETTING_PREFER_MUTED)
  }
})

watch(volume, (current, old) => {
  if (current == old || !youtubePlayer.value) return

  youtubePlayer.value.setVolume(current)

  // window.localStorage.setItem(SETTING_MEDIA_VOLUME, current)
})

const isInCall = ref(false)
const isConnecting = ref(false)
const isEnded = ref(false)

watch(isConnecting, (status) => {
  if (status) {
    setTimeout(() => {
      isInCall.value = true
      isConnecting.value = false
    }, 4000)
  }
})

function handlePlaybackStateChanged() {
  const player = youtubePlayer.value

  if (player.getPlayerState() === 0) {
    // Status 0 means the video is ended, see https://developers.google.com/youtube/iframe_api_reference#Playback_status
    isEnded.value = true
  }
}

function handleEndButtonClick() {
  if (confirm('Leave #TerimaKasihKana?')) {
    isEnded.value = true
  }
}
</script>

<template>
  <!-- Konten utama video call -->
  <div class="w-full h-screen flex items-center justify-center" v-if="isEnded">
    <div class="space-y-2">
      <p class="text-center"><b>#TerimaKasihKana</b> has concluded</p>
      <p class="text-center">Thank you for participating</p>
      <ClassicButton
        @click="
          () => {
            isInCall = false
            isEnded = false
          }
        "
        class="w-full"
        >Back to Menu</ClassicButton
      >
    </div>
  </div>
  <div v-if="!isInCall && !isEnded" class="w-full h-screen flex flex-col overflow-hidden relative">
    <div
      v-if="isConnecting"
      class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.2)] flex items-center justify-center"
    >
      <div class="p-4 border-4 border-outset bg-gray-100 flex flex-nowrap gap-2 items-center">
        <ClassicIcon name="satellite-dish" class="w-8 animate-pulse" />
        <p>Joining <b>#TerimaKasihKana</b>...</p>
      </div>
    </div>
    <div class="flex flex-row flex-nowrap p-4">
      <ClassicIcon name="video-camera" class="me-4" />
      <h1 class="font-bold text-3xl leading-tight">FishTime</h1>
      <div class="ms-auto flex flex-row flex-nowrap items-center gap-3">
        <p>Logged in as: Kanaia Asa</p>
        <img src="/kanaia.jpg" alt="kanaia profile" class="inline-block w-8 border me-2" />
      </div>
    </div>
    <div class="w-full border-3 border-inset bg-white h-full p-2">
      <ClassicButton
        @click="
          () => {
            isConnecting = true
          }
        "
        class="w-full flex text-start p-4 !px-4"
      >
        <div>
          <h2 class="font-bold text-xl">#TerimaKasihKana</h2>
          <p>22 People in call</p>
        </div>
        <div class="ms-auto">
          <em>Click to join</em>
        </div>
      </ClassicButton>
    </div>
  </div>
  <div
    class="bg-gray-200 w-full flex flex-col items-center h-screen gap-2 p-1 justify-between"
    v-if="isInCall && !isEnded"
  >
    <!-- Area video dengan border inset klasik -->
    <div
      class="w-full h-full border-inset border-2 border-gray-400 bg-black overflow-hidden aspect-video relative"
    >
      <div class="w-full h-full absolute z-10 bg-transparent"></div>
      <Youtube
        @state-change="handlePlaybackStateChanged"
        ref="youtubePlayer"
        width="100%"
        height="100%"
        class="w-full h-full z-0"
        :src="videoSource"
        :vars="{
          controls: 0,
          autoplay: 1,
          showinfo: false,
        }"
      ></Youtube>
      <!-- <iframe
        class="w-full h-full"
        src="https://www.youtube.com/embed/dTE_TbM2jE4?si=xFvHoVsBlnCsDSTz"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe> -->
      <video src="/placeholder-aergia.mp4" controls autoplay class="w-full h-full"></video>
    </div>

    <!-- Kontrol video call style klasik -->
    <div class="flex justify-center space-x-2 my-1 relative w-full">
      <ClassicButton class="px-3 py-1 flex items-center text-xs">
        <IconMonitorUp class="mr-1" /> <span>Share</span>
      </ClassicButton>
      <ClassicButton class="px-3 py-1 flex items-center text-xs">
        <IconCameraOff class="mr-1" /> <span>Camera</span>
      </ClassicButton>
      <ClassicButton class="px-3 py-1 flex items-center text-xs">
        <IconMicOff class="mr-1" /> <span>Mic</span>
      </ClassicButton>
      <ClassicButton
        @click="handleEndButtonClick"
        class="px-3 py-1 flex items-center text-xs bg-red-100 hover:bg-red-200 active:bg-red-300"
      >
        <IconPhone class="mr-1" /> <span>End</span>
      </ClassicButton>
      <div class="absolute right-2 gap-2 flex flex-row items-center flex-nowrap w-36">
        <ClassicButton
          @click="
            () => {
              isMuted = !isMuted
            }
          "
          class="text-2xl group shrink-0"
        >
          <span v-if="isMuted" class="bi-volume-mute-fill group-disabled:opacity-50"></span>
          <template v-if="!isMuted">
            <span v-if="volume < 25" class="bi-volume-off-fill group-disabled:opacity-50"></span>
            <span
              v-if="volume >= 25 && volume < 66"
              class="bi-volume-down-fill group-disabled:opacity-50"
            ></span>
            <span v-if="volume >= 66" class="bi-volume-up-fill group-disabled:opacity-50"></span>
          </template>
        </ClassicButton>
        <Slider
          :min="0"
          :max="100"
          :step="1"
          :value="volume"
          @change="
            (v) => {
              volume = v
            }
          "
          @scrub-start="
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

    <!-- Status bar klasik -->
    <div class="bg-gray-300 border-t border-gray-400 text-xs flex justify-between w-full px-2 py-1">
      <div>Status: Connected</div>
      <div>Duration: 00:00:00</div>
    </div>
  </div>
</template>

<style scoped>
.border-inset {
  border-style: inset;
}
</style>
