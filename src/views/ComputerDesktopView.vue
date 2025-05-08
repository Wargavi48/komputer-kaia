<script setup>
import ClassicButton from '@/components/ClassicButton.vue'
import DraggableWindow from '@/components/DraggableWindow.vue'
import dayjs from 'dayjs'
import { onMounted, reactive, ref } from 'vue'

const clockNow = ref(dayjs().format('HH:mm:dd'))

onMounted(() => {
  setInterval(() => {
    clockNow.value = dayjs().format('HH : mm : ss')
  }, 1000)
})

const apps = [
  {
    icon: '🎶',
    label: 'Music Player',
  },
  {
    icon: '🖼',
    label: 'Photo Viewer',
  },
  {
    icon: '🎥',
    label: 'Video Call',
  },
  {
    icon: '💌',
    label: 'E-Mail',
  },
]

const runningApps = reactive([
  {
    title: 'Switch by Kanaia Asa',
    icon: '🎶',
    active: false,
    maximized: false,
    minimized: false,
  },
  {
    title: 'Photo Viewer',
    icon: '🖼',
    active: false,
    maximized: false,
    minimized: false,
    minWidth: 500,
    minHeight: 700,
    contentUrl: '/applet/photo-viewer',
  },
  {
    title: 'Email',
    icon: '💌',
    active: false,
    maximized: false,
    minimized: false,
    minWidth: 500,
    minHeight: window.innerHeight / 2,
    contentUrl: '/applet/email',
  },
  {
    title: 'Fanbook (External Web embedding demo)',
    icon: '💌',
    active: false,
    maximized: false,
    minimized: false,
    minWidth: 500,
    minHeight: window.innerHeight / 2,
    contentUrl: 'https://online.fliphtml5.com/cxnyj/lrhn/index.html',
  },
])

function handleWindowMaximize(i) {
  runningApps[i].maximized = true
}

function handleWindowMinimize(i) {
  runningApps[i].minimized = true
  runningApps[i].active = false
}

function handleWindowRestore(i) {
  runningApps[i].minimized = false
  runningApps[i].maximized = false
}

function handleClose(i) {
  runningApps.splice(i, 1)
}

function activateWindow(i) {
  for (const app of runningApps) {
    app.active = false
  }
  runningApps[i].active = true
  runningApps[i].minimized = false
}

// const isWindowBeingDragged = ref(false)
// const isMaximized = ref(false)
// const isMinmized = ref(false)

// const runningWindows = reactive([]);
const startMenuOpen = ref(false)

function shutdown() {
  alert('Unfortunately kamu harus klik tombol close tab/browser manual :)')
}

function restart() {
  window.location.reload()
}
</script>

<template>
  <div
    id="desktop-main"
    class="w-screen h-screen overflow-hidden flex flex-col items-stretch z-20 select-none"
  >
    <div
      id="desktop-container"
      style="background-image: url('/we-meet-again.jpeg'); background-size: cover"
      class="w-full h-full bg-blue-300 overflow-hidden relative"
      @click="
        () => {
          startMenuOpen = false
        }
      "
    >
      <DraggableWindow
        v-for="(app, i) in runningApps"
        :key="i"
        @maximize="() => handleWindowMaximize(i)"
        @restore="() => handleWindowRestore(i)"
        @minimize="() => handleWindowMinimize(i)"
        @focused="
          () => {
            activateWindow(i)
          }
        "
        @close="() => handleClose(i)"
        :min-height="app.minHeight"
        :min-width="app.minWidth"
        :maximized="app.maximized"
        :minimized="app.minimized"
        :window-active="app.active"
        :title="app.title"
      >
        <iframe
          v-if="app.contentUrl"
          :src="app.contentUrl"
          class="w-full h-full"
          frameborder="0"
        ></iframe>
        <!-- The youtube embed is a placeholder -->
        <iframe
          v-if="!app.contentUrl"
          class="w-full h-full"
          src="https://www.youtube.com/embed/_ndMYK3eGiY?si=tzxU1hCde6JQOaZ4"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </DraggableWindow>
    </div>

    <div
      v-if="startMenuOpen"
      id="start-menu"
      class="absolute bottom-12 left-2 border-2 w-[200px] max-h-3/4 border-gray-300 border-outset bg-gray-200 p-0 border-outset flex flex-col z-50"
    >
      <div
        class="flex flex-row gap-2 items-center p-2 bg-linear-to-r from-kana-blue to-kana-purple text-xl font-bold"
      >
        <img src="/kanaia.jpg" alt="Kanaia-profile" class="h-10 w-10" />
        <div>Kanaia Asa</div>
      </div>
      <div class="w-full grid grid-cols-1">
        <button
          v-for="(app, i) in apps"
          :key="i"
          class="flex flex-row items-baseline flex-nowrap hover:bg-blue-500 hover:text-white p-1 gap-2 select-none"
        >
          <div class="shrink-0">
            {{ app.icon }}
          </div>
          <div>
            {{ app.label }}
          </div>
        </button>
      </div>
      <hr class="border-inset" />
      <div class="w-full grid grid-cols-1 mt-auto">
        <button
          class="flex flex-row items-baseline flex-nowrap hover:bg-blue-500 hover:text-white p-1 gap-2 select-none"
          @click="restart"
        >
          <div>🔁</div>
          <div>Restart</div>
        </button>
        <button
          class="flex flex-row items-baseline flex-nowrap hover:bg-blue-500 hover:text-white p-1 gap-2 select-none"
          @click="shutdown"
        >
          <div>🟥</div>
          <div>Shutdown</div>
        </button>
      </div>
    </div>

    <div class="w-full border-t">
      <nav
        @click="
          () => {
            startMenuOpen = false
          }
        "
        class="w-screen p-1 bg-gray-200 border-t-2 border-outset flex flex-nowrap gap-2 shrink-0 shadow-lg"
      >
        <!-- This is the 'Taskbar' -->
        <ClassicButton
          @click.stop="
            () => {
              startMenuOpen = !startMenuOpen
            }
          "
          class="border-gray-400 shrink-0"
          >🐟 Start</ClassicButton
        >

        <div class="flex flex-row flex-nowrap w-full grow-0 gap-2">
          <button
            v-for="(app, i) in runningApps"
            :key="i"
            @click="
              () => {
                if (app.active) {
                  handleWindowMinimize(i)
                } else {
                  activateWindow(i)
                }
              }
            "
            class="border-2 px-1 max-w-[20em] min-w-[10em] text-nowrap shrink truncate text-start"
            :class="{
              'bg-white font-bold border-inset': app.active,
              'border-outset': !app.active,
            }"
          >
            {{ app.title }}
          </button>
        </div>

        <div class="border-2 shrink-0 border-gray-300 bg-gray-300 border-inset p-1 ms-auto">
          {{ clockNow }}
        </div>
      </nav>
    </div>
  </div>
</template>
