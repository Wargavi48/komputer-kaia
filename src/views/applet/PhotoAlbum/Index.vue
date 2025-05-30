<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import ClassicButton from '@/components/ClassicButton'
import { computed, ref, onMounted, useTemplateRef, watch } from 'vue'
import { reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ImgThumbnail from './components/ImgThumbnail.vue'
import PhotoViewer from './components/PhotoViewer.vue'
// import ClassicIcon from '@/components/ClassicIcon.vue'

// Data foto diambil secara dinamis dari service
import { getLocalPhotoList } from '@/services/photoAlbumService'

const images = reactive([])

const baseUrlPath = '/applet/photo-album'

const route = useRoute()
const router = useRouter()

const photoIndex = computed(() => Number(route.params.photo || -1))
const selectedImage = computed(() => images[photoIndex.value] || null)

// const canGoBack = computed(() => window.history.state?.back)
// const canGoForward = computed(() => window.history.state?.forward)

const scale = ref(4)

const lastSelectedIndex = ref(null)

/**
 * Select an item
 * @param index {number}
 */
function selectItem(index) {
  clearSelection()
  if (!images[index]) {
    return
  }
  images[index].selected = true
  lastSelectedIndex.value = index
}

function clearSelection() {
  for (const img of images) {
    img.selected = false
  }
}

/**
 * Add selected index to selectedIndices
 * @param index {number}
 */
function toggleSelection(index) {
  images[index].selected = !images[index].selected
  lastSelectedIndex.value = index
}

function selectUpTo(index) {
  const initialIndex = lastSelectedIndex.value || 0
  const min = Math.min(initialIndex, index)
  const max = Math.max(initialIndex, index)

  clearSelection()
  for (let i = min; i <= max; i++) {
    images[i].selected = true
  }
}

const isFullscreen = ref(false)
const outermostContainer = ref(null)

function fullscreenChange() {
  console.log('Fullscreen state changed', document.fullscreenElement)
  if (document.fullscreenElement) {
    isFullscreen.value = true
  } else {
    isFullscreen.value = false
  }
}

function toggleFullscreen() {
  if (isFullscreen.value) {
    document.exitFullscreen()
  } else {
    outermostContainer.value.requestFullscreen()
  }
}

const iconRefs = useTemplateRef('iconRefs')

function exitFullscreen() {
  document.exitFullscreen()
}

// Mengambil data foto saat komponen dimount
onMounted(async () => {
  try {
    const photoData = await getLocalPhotoList()
    // Update reactive array dengan data yang diambil dari service
    images.push(
      ...photoData.map((p) => {
        p.visible = false
        return p
      }),
    )
  } catch (error) {
    console.error('Gagal mengambil data foto:', error)
  }
})

watch(iconRefs, (icons) => {
  if (icons.length > 0) {
    checkIconVisible()
  }
})

function checkIconVisible() {
  let i = 0
  for (const icon of iconRefs.value) {
    images[i].visible = icon.isVisible()
    i++
  }
}
</script>

<template>
  <div
    ref="outermostContainer"
    @fullscreenchange="fullscreenChange"
    class="bg-white relative w-screen h-screen border-3 border-gray-200 overflow-x-hidden flex flex-col select-none"
  >
    <nav class="w-full p-4 bg-gray-200 flex flex-row flex-nowrap items-center shrink-0">
      <!-- <ClassicButton
        @click="
          () => {
            router.back()
          }
        "
        :disabled="!canGoBack"
      >
        <span class="bi-chevron-left text-xl"></span>
      </ClassicButton>
      <ClassicButton @click="() => router.forward()" :disabled="!canGoForward">
        <span class="bi-chevron-right text-xl"></span>
      </ClassicButton> -->
      <ClassicButton
        :as="RouterLink"
        :to="baseUrlPath"
        @click="exitFullscreen"
        class="border-gray-300"
      >
        <span class="bi-house text-xl"></span>
      </ClassicButton>

      <!-- <div class="flex flex-row items-center ms-auto">
        <ClassicButton>
          <span class="bi-arrow-counterclockwise text-xl"></span>
        </ClassicButton>
        <ClassicButton>
          <span class="bi-arrow-clockwise text-xl"></span>
        </ClassicButton>
        <ClassicButton class="ms-4">
          <span class="bi-download text-xl"></span>
        </ClassicButton>
      </div> -->
    </nav>
    <PhotoViewer v-if="selectedImage !== null" :src="selectedImage.url"></PhotoViewer>
    <div
      class="h-full grow-0 overflow-y-auto w-full flex flex-col"
      v-if="selectedImage == null"
      @click="() => clearSelection()"
    >
      <div
        class="flex flex-row flex-wrap justify-start items-start border-2 border-inset gap-4 p-4 h-full grow-0 overflow-y-auto"
        @scrollend="checkIconVisible"
      >
        <ImgThumbnail
          v-for="(img, i) in images"
          ref="iconRefs"
          :unload="!img.visible"
          @click.stop="
            (e) => {
              if (e.shiftKey) {
                selectUpTo(i)
              } else if (e.ctrlKey) {
                toggleSelection(i)
              } else {
                selectItem(i)
              }
            }
          "
          @dblclick="
            () => {
              router.push(`/applet/photo-album/${i}`)
            }
          "
          :filename="img.filename"
          :key="img.filename"
          :src="img.url"
          :scale="scale"
          :selected="img.selected"
        ></ImgThumbnail>
        <!-- <div v-for="img in images" :key="img.filename" class="space-y-2 w-[200px]">
          <img :src="img.url" alt="" class="aspect-square w-full object-contain" />
          <p>{{ img.filename }}</p>
        </div> -->
      </div>
    </div>
    <footer class="shrink-0 w-full bg-gray-200 border-t-2 border-outset">
      <div v-if="selectedImage" class="space-y-2 p-4 pt-2">
        <p class="text-center">
          {{ selectedImage.filename }}
        </p>
        <component
          :is="selectedImage.creditsUrl ? 'a' : 'p'"
          :href="selectedImage.creditsUrl"
          class="text-center block"
          target="_blank"
          :class="{
            'underline text-blue-800': selectedImage.creditsUrl,
          }"
          >By {{ selectedImage.name }}</component
        >
        <div class="flex items-center flex-row justify-center gap-4 relative">
          <ClassicButton
            class="border-gray-300"
            :class="{
              'bg-gray-400 text-gray-600': photoIndex <= 0,
            }"
            :to="photoIndex > 0 ? `${baseUrlPath}/${photoIndex - 1}` : ''"
            :as="RouterLink"
          >
            <span class="bi-caret-left-fill text-2xl"></span>
          </ClassicButton>
          <p>
            {{ photoIndex + 1 }}
            /
            {{ images.length }}
          </p>
          <ClassicButton
            class="border-gray-300"
            :class="{
              'bg-gray-400 text-gray-600': photoIndex >= images.length - 1,
            }"
            :as="RouterLink"
            :to="photoIndex < images.length - 1 ? `${baseUrlPath}/${photoIndex + 1}` : ''"
          >
            <span class="bi-caret-right-fill text-2xl"></span>
          </ClassicButton>
          <ClassicButton @click="toggleFullscreen" class="border-gray-300 absolute right-0">
            <span
              class="text-2xl"
              :class="{
                'bi-fullscreen': !isFullscreen,
                'bi-fullscreen-exit': isFullscreen,
              }"
            ></span>
          </ClassicButton>
        </div>
      </div>
      <div v-if="selectedImage === null" class="flex flex-row">
        <!-- <div
          class="ms-auto m-1 border-2 border-gray-200 border-inset bg-gray-300 p-1 flex flex-row items-center"
        >
          <label class="me-2">Zoom: </label>
          <input type="range" name="foo" min="2" step="1" max="5" v-model="scale" class="w-40" />
        </div> -->
      </div>
    </footer>
  </div>
</template>
