<script setup>
import ClassicButton from '@/components/ClassicButton.vue'
import ClassicIcon from '@/components/ClassicIcon.vue'
import axios from 'axios'
import { onMounted, reactive } from 'vue'
import AudioPlayer from '@/components/AudioPlayer.vue'

const apiURL = new URL('/api/voicemail', import.meta.env.VITE_VOICE_API_URL)

const voicemails = reactive([])

onMounted(async () => {
  const response = await axios.get(apiURL.href)

  voicemails.push(...response.data)
})

/**
 * Set voicemail to allowed or not
 * @param i {number} voicemail index
 * @param isAllowed {boolean} Is Allowed
 */
async function setAllow(i, isAllowed) {
  const allowUrl = new URL(
    `/api/voicemail/${voicemails[i].id}/allow/${isAllowed ? 1 : 0}`,
    import.meta.env.VITE_VOICE_API_URL,
  )

  await axios.put(allowUrl)
  voicemails[i].allowed = isAllowed
}
</script>

<template>
  <div class="min-h-screen w-full bg-brand-blue-dark py-12 px-4">
    <div class="border max-w-5xl mx-auto shadow-classic">
      <div class="border-4 border-outset bg-gray-300">
        <div class="w-full bg-gradient-to-r from-kana-purple to-kana-blue">
          <div class="w-full flex flex-row items-center px-2 py-1 gap-2">
            <ClassicIcon name="cd-audio" class="w-6" />
            <p class="font-bold">Voicemail Recordings</p>
          </div>
        </div>
        <!-- <div class="p-4">
          <input type="text" class="bg-white border p-1" id="" />
        </div> -->
        <div
          class="border-3 border-inset bg-white grid grid-cols-1 divide-solid divide-y divide-gray-400"
        >
          <div v-for="(mail, i) in voicemails" :key="mail.id" class="p-4 space-y-2">
            <div class="flex flex-row gap-3 items-center">
              <p>
                From: <b>{{ mail.name }}</b>
              </p>
              <div class="ms-auto flex flex-row items-center">
                <span class="me-2">Allowed:</span>
                <ClassicButton
                  :disabled="mail.allowed"
                  type="button"
                  @click="() => setAllow(i, true)"
                >
                  <ClassicIcon
                    name="check"
                    class="w-6"
                    :class="{
                      'saturate-0 opacity-50': !mail.allowed,
                    }"
                  />
                </ClassicButton>
                <ClassicButton
                  :disabled="!mail.allowed"
                  type="button"
                  @click="() => setAllow(i, false)"
                >
                  <ClassicIcon
                    name="red-x"
                    class="w-6"
                    :class="{
                      'saturate-0 opacity-50': mail.allowed,
                    }"
                  />
                </ClassicButton>
              </div>
            </div>
            <div class="w-full">
              <AudioPlayer :audio-src="mail.audio_url" :initial-duration="mail.duration" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
