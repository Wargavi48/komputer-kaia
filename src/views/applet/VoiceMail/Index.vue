<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import AudioPlayer from '@/components/AudioPlayer.vue'
import ClassicButton from '@/components/ClassicButton.vue'
import ClassicIcon from '@/components/ClassicIcon.vue'
import { fetchVoiceMails } from '@/services/voiceMailService'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import UTC from 'dayjs/plugin/utc'
import { computed, onMounted, ref } from 'vue'

dayjs.extend(RelativeTime)
dayjs.extend(UTC)

const voicemails = ref([])
const isLoading = ref(true)
const error = ref(false)

const selectedIndex = ref(null)
const selectedVoicemail = computed(() => {
  if (selectedIndex.value === null) return null

  return voicemails.value[selectedIndex.value]
})

onMounted(async () => {
  isLoading.value = true
  error.value = null
  try {
    voicemails.value = await fetchVoiceMails()
  } catch (err) {
    error.value = err

    console.log(err)
  } finally {
    isLoading.value = false
  }
})
</script>
<template>
  <div class="w-full h-screen flex flex-col select-none">
    <div class="w-full grow-0 h-full overflow-y-auto border-4 border-inset">
      <div class="divide-gray-400 divide-solid divide-y grid grid-cols-1">
        <button
          v-for="(voicemail, i) in voicemails"
          :key="voicemail.id"
          class="text-start flex flex-row p-4 hover:bg-blue-800 hover:text-white hover:cursor-pointer"
          :class="{
            'bg-gray-400': selectedIndex === i,
          }"
          @click="selectedIndex = i"
        >
          <div class="w-full grow-0">
            <p class="w-full truncate font-bold text-lg">
              {{ voicemail.name }}
            </p>
            <p class="opacity-75">
              {{ voicemail.phone_number }}
            </p>
          </div>
          <div class="ms-auto shrink-0 text-end">
            <p>{{ Math.round(voicemail.duration) }} second(s)</p>
            <p class="opacity-75">{{ dayjs.utc(voicemail.created_at).fromNow() }}</p>
          </div>
        </button>
      </div>
    </div>
    <div v-if="selectedIndex !== null" class="w-full p-4 shrink-0">
      <div class="flex flex-row w-full gap-2">
        <ClassicButton :disabled="selectedIndex === 0" @click="selectedIndex--" class="group mt-9">
          <ClassicIcon name="arrow-left" class="group-disabled:opacity-50" />
        </ClassicButton>
        <div class="w-full grow-0 space-y-2">
          <div class="flex flex-row gap-2">
            <p class="font-bold text-lg">
              {{ selectedVoicemail.name }}
            </p>
            <p class="opacity-75 ms-auto">
              {{ dayjs.utc(selectedVoicemail.created_at).fromNow() }}
            </p>
          </div>
          <AudioPlayer
            class="w-full grow-0"
            :audio-src="selectedVoicemail.audio_url"
            :initial-duration="selectedVoicemail.duration"
            autoplay
          />
        </div>
        <ClassicButton
          :disabled="selectedIndex === voicemails.length - 1"
          @click="selectedIndex++"
          class="group mt-9"
        >
          <ClassicIcon name="arrow-right" class="group-disabled:opacity-50" />
        </ClassicButton>
      </div>
    </div>
    <footer class="flex flex-row flex-nowrap">
      <div class="shrink-0 border-3 border-inset bg-gray-300 px-1 overflow-hidden">
        <ClassicIcon name="satellite-dish" class="w-4" :class="{ 'animate-pulse': isLoading }" />
      </div>
      <div class="border-3 grow border-inset px-1 bg-gray-300 truncate">
        <span class="me-1">Status:</span>
        <span v-if="!isLoading && !error">Connected</span>
        <span v-if="isLoading">Connecting...</span>
        <span v-if="error">Unable to Connect to voicemail service</span>
      </div>
      <div v-if="!isLoading" class="border-3 shrink-0 border-inset px-1 bg-gray-300 truncate">
        {{ voicemails.length }} voicemails
      </div>
    </footer>
  </div>
</template>
