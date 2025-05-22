<script setup>
import ClassicButton from '@/components/ClassicButton.vue'
import { getSpreadsheetData } from '@/services/spreadsheetService'
// import { fakerID_ID as faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import DOMPurify from 'dompurify'
import ClassicIcon from '@/components/ClassicIcon.vue'

dayjs.extend(RelativeTime)

// const fakeEmails = reactive(
//   Array.apply(null, Array(40)).map(() => ({
//     name: faker.person.fullName(),
//     username: faker.internet.username(),
//     subject: faker.word.words({ min: 3, max: 10 }),
//     body: faker.lorem.paragraphs({ min: 1, max: 20 }, '<br> \n'),
//     timestamp: faker.date.recent({ days: 15 }),
//   })),
// )

const emails = reactive([])

/**
 * Parse date value coming from the Google Spreadsheet
 * @param dateString {string} Google docs Date string in `'Date(Y,M,D,H,m,s)'` format
 * @returns {Date}
 */
function parseSpreadsheetDate(dateString) {
  // The date is originally formatted like
  // Date(year,month,day,hour,minute,second)

  const cleaned = dateString.substring(5, dateString.length - 1)
  const [Y, M, D, H, m, s] = cleaned.split(',')

  const date = new Date(Y, M, D, H, m, s)

  return date
}

onMounted(async () => {
  const submission = await getSpreadsheetData()

  for (const item of submission) {
    const sanitizedLetter = DOMPurify.sanitize(item.fanLetter)
    emails.push({
      name: item.name,
      username: item.name,
      subject: item.fubject,
      body: sanitizedLetter.replaceAll('\n', '<br/>'),
      timestamp: parseSpreadsheetDate(item.timestamp),
      attachments: item.fanSubmission,
    })
  }
})

const activeMailIndex = ref(null)

const currentMail = computed(() => {
  if (activeMailIndex.value === null) return null

  return emails[activeMailIndex.value]
})

/**
 * Parse Google drive open link and turn it into google drive preview URL
 * @param attachmentUrl {string} Google Drive file URL in the format of `https://drive.google.com/open?id=[FILE_ID]`
 * @returns {string}
 */
function getDriveEmbeddingURL(attachmentUrl) {
  const url = new URL(attachmentUrl)

  const fileId = url.searchParams.get('id')

  return `https://drive.google.com/file/d/${fileId}/preview`
}

watch(activeMailIndex, () => {
  isAttachmentOpen.value = false
})

const isAttachmentOpen = ref(false)
const attachmentFrame = ref(null)

function handleAttachmentLoad() {
  console.log('Attachment Loaded')

  /**
   * @type {HTMLIFrameElement}
   */
  const iframe = attachmentFrame.value
  iframe.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden">
    <header class="bg-gray-200 shrink-0 p-4 flex flex-row flex-nowrap items-center">
      <ClassicButton
        class="p-1 px-2 group"
        :disabled="activeMailIndex === null || activeMailIndex < 1"
        @click="() => activeMailIndex--"
      >
        <ClassicIcon name="arrow-left" class="w-6 group-disabled:opacity-50"></ClassicIcon>
      </ClassicButton>
      <ClassicButton
        class="p-1 px-2 group"
        :disabled="activeMailIndex === null || activeMailIndex === emails.length - 1"
        @click="() => activeMailIndex++"
      >
        <ClassicIcon name="arrow-right" class="w-6 group-disabled:opacity-50"></ClassicIcon>
      </ClassicButton>
      <ClassicButton
        v-if="activeMailIndex !== null"
        class="px-2 p-1 md:hidden ms-2"
        @click="() => (activeMailIndex = null)"
      >
        <ClassicIcon name="mailbox" class="w-6"></ClassicIcon>
        Inbox
      </ClassicButton>

      <div class="ms-auto">
        <img src="/kanaia.jpg" alt="kanaia profile" class="inline-block w-8 border me-2" />
        <span>
          <b>Kanaia Asa</b>
        </span>
      </div>
    </header>
    <div class="grow-0 bg-gray-200 flex gap-2 flex-row flex-nowrap relative overflow-x-hidden">
      <div
        class="w-full h-full md:w-1/4 md:block border-3 border-inset overflow-y-auto"
        :class="{
          // 'w-full': activeMailIndex === null,
          hidden: activeMailIndex !== null,
        }"
      >
        <!-- <h1 class="text-2xl font-bold">Inbox</h1>
        <hr class="pt-4" /> -->
        <div class="w-full grid grid-cols-1 divide-solid divide-y-1 divide-gray-400 select-none">
          <button
            class="space-y-1 py-2 px-4 block text-start hover:bg-blue-800 hover:text-white"
            :class="{ 'bg-blue-300': activeMailIndex === i }"
            v-for="(email, i) in emails"
            :key="`${i}${email.username}`"
            @click="() => (activeMailIndex = i)"
          >
            <p class="font-bold">
              <span class="bi-paperclip me-1" v-if="email.attachments"></span>
              {{ email.username }}
            </p>
            <p class="text-nowrap truncate">{{ email.subject }}</p>
          </button>
        </div>
      </div>
      <div
        class="w-full h-full border-4 border-inset p-6 hidden md:flex items-center justify-center"
        v-if="activeMailIndex === null"
      >
        Select one mail from your inbox to read
      </div>
      <div
        class="w-full h-full border-4 border-inset overflow-y-auto py-6"
        v-if="activeMailIndex !== null"
      >
        <div class="max-w-7xl mx-auto px-6 lg:px-8 text-lg">
          <div class="flex flex-row flex-nowrap items-end border-b pb-4">
            <div class="space-y-1">
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
              <div v-if="currentMail.attachments" class="flex flex-row gap-2">
                <div class="text-start">Attachment:</div>
                <b>1 Attachment(s)</b>
              </div>
            </div>
            <div class="text-end ms-auto">
              {{ dayjs(currentMail.timestamp).fromNow() }}
            </div>
          </div>

          <div class="py-4 prose-md mx-auto bg-white px-8">
            <!-- Email Body -->
            <div v-html="currentMail.body"></div>

            <!-- <pre>
            {{ JSON.stringify(currentMail, null, 2) }}
          </pre> -->
          </div>
          <div v-if="currentMail.attachments" class="mt-6">
            <h3 class="text-lg font-bold">Attachment(s)</h3>
            <div class="mt-2 relative">
              <ClassicButton @click="() => (isAttachmentOpen = true)" v-if="!isAttachmentOpen">
                <span class="bi-paperclip me-2"></span>
                View 1 Attachment(s)
              </ClassicButton>
              <div
                v-if="isAttachmentOpen"
                class="absolute w-full h-full flex items-center justify-center bg-gray-300"
              >
                <img src="/hourglass.gif" alt="" class="w-8 h-8" />
              </div>
              <iframe
                ref="attachmentFrame"
                @load="handleAttachmentLoad"
                :src="getDriveEmbeddingURL(currentMail.attachments)"
                v-if="isAttachmentOpen"
                class="w-full h-[80vh] relative"
                frameborder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="mt-auto border-4 border-inset bg-gray-300 px-2">
      {{ emails.length }} mails
    </footer>
  </div>
</template>
