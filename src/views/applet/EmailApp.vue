<script setup>
import ClassicButton from '@/components/ClassicButton.vue'
import { fakerID_ID as faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { computed, reactive, ref } from 'vue'

dayjs.extend(RelativeTime)

const fakeEmails = reactive(
  Array.apply(null, Array(40)).map(() => ({
    name: faker.person.fullName(),
    username: faker.internet.username(),
    subject: faker.word.words({ min: 3, max: 10 }),
    body: faker.lorem.paragraphs({ min: 1, max: 20 }, '<br> \n'),
    timestamp: faker.date.recent({ days: 15 }),
  })),
)

const activeMailIndex = ref(null)

const currentMail = computed(() => {
  if (activeMailIndex.value === null) return null

  return fakeEmails[activeMailIndex.value]
})
</script>

<template>
  <div
    class="w-screen min-h-screen bg-gray-100 flex flex-row flex-nowrap relative overflow-x-hidden"
  >
    <div
      class="w-full lg:w-1/4 lg:block border-r border-outset p-4 lg:h-screen lg:sticky lg:top-0"
      :class="{
        'w-full': activeMailIndex === null,
        hidden: activeMailIndex !== null,
      }"
    >
      <div class="h-full overflow-y-auto">
        <h1 class="text-2xl font-bold">Inbox</h1>
        <hr class="pt-4" />
        <div class="w-full grid grid-cols-1 divide-solid divide-y-1 divide-gray-400 select-none">
          <button
            class="space-y-1 py-2 px-4 block text-start hover:bg-blue-800 hover:text-white"
            :class="{ 'bg-blue-300': activeMailIndex === i }"
            v-for="(email, i) in fakeEmails"
            :key="`${i}${email.username}`"
            @click="() => (activeMailIndex = i)"
          >
            <p class="font-bold">{{ email.username }}</p>
            <p class="text-nowrap truncate">{{ email.subject }}</p>
          </button>
        </div>
      </div>
    </div>
    <div class="w-full py-12" v-if="activeMailIndex !== null">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 text-lg">
        <div class="flex flex-row flex-nowrap items-end border-b pb-4">
          <div class="space-y-1">
            <ClassicButton class="px-3 lg:hidden" @click="() => (activeMailIndex = null)">
              <span class="bi-chevron-left me-2"></span>
              Back
            </ClassicButton>
            <div class="flex flex-row gap-2">
              <div class="text-start">From:</div>
              <b>{{ currentMail.username }}</b>
            </div>
            <div class="flex flex-row gap-2">
              <div class="text-start">To:</div>
              <b>Kanaia Asa</b>
            </div>
            <div class="flex flex-row gap-2">
              <div class="text-start">Subject:</div>
              <b>{{ currentMail.subject }}</b>
            </div>
          </div>
          <div class="text-end ms-auto">
            {{ dayjs(currentMail.timestamp).fromNow() }}
          </div>
        </div>

        <div class="py-4 prose-lg mx-auto bg-white px-8">
          <!-- Email Body -->
          Dear Kanaiaa,
          <div v-html="currentMail.body"></div>
        </div>
      </div>
    </div>
  </div>
</template>
