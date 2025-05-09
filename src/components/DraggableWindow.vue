<script setup>
import { computed, reactive, ref, watch } from 'vue'
import ClassicButton from './ClassicButton.vue'

const props = defineProps({
  maximized: { type: Boolean, default: false },
  minimized: { type: Boolean, default: false },
  windowActive: { type: Boolean, default: false },
  title: { type: String, default: 'Untitled' },
  minWidth: { type: Number, default: 400 },
  minHeight: { type: Number, default: 200 },
})

const dragHandle = ref(null)
const windowFrame = ref(null)

const windowPos = reactive({
  x: Math.random() * (window.innerWidth / 3),
  y: Math.random() * (window.innerWidth / 4),
})

const initialMousePosition = reactive({
  x: 0,
  y: 0,
})

// For performance sake only update this when dragging
const currentMousePosition = reactive({
  x: 0,
  y: 0,
})

const moveOffset = computed(() => {
  return {
    x: currentMousePosition.x - initialMousePosition.x,
    y: currentMousePosition.y - initialMousePosition.y,
  }
})

const isDragging = ref(false)
const emits = defineEmits([
  'close',
  'maximize',
  'minimize',
  'restore',
  'dragStart',
  'dragEnd',
  'focused',
])

function handleDragStart(e) {
  initialMousePosition.x = e.screenX
  initialMousePosition.y = e.screenY
  currentMousePosition.x = e.screenX
  currentMousePosition.y = e.screenY

  isDragging.value = true
}

function handleDragWindow(e) {
  if (props.maximized) {
    return
  }
  currentMousePosition.x = e.screenX
  currentMousePosition.y = e.screenY
}

function handleDragEnd() {
  windowPos.x += moveOffset.value.x
  windowPos.y += moveOffset.value.y
  initialMousePosition.x = 0
  initialMousePosition.y = 0
  currentMousePosition.x = 0
  currentMousePosition.y = 0

  isDragging.value = false
}

watch(isDragging, (nowDragging) => {
  if (nowDragging) {
    emits('dragStart')
    window.addEventListener('mousemove', handleDragWindow)
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('mouseleave', handleDragEnd)
  } else {
    emits('dragEnd')
    window.removeEventListener('mousemove', handleDragWindow)
    window.removeEventListener('mouseup', handleDragEnd)
    window.removeEventListener('mouseleave', handleDragEnd)
  }
})

const isWindowHeldDown = ref(false)
</script>

<template>
  <div
    ref="windowFrame"
    :style="
      !props.maximized && !props.minimized
        ? {
            left: `${windowPos.x}px`,
            top: `${windowPos.y}px`,
            transformOrigin: '0 0',
            transform: isDragging ? `translate(${moveOffset.x}px, ${moveOffset.y}px)` : 'none',
            minWidth: `${props.minWidth}px`,
            minHeight: `${props.minHeight}px`,
          }
        : null
    "
    @mousedown="
      () => {
        emits('focused')
        isWindowHeldDown = true
      }
    "
    @mouseup="
      () => {
        isWindowHeldDown = false
      }
    "
    @mouseenter="
      (e) => {
        if (e.buttons === 0 || !e.buttons) {
          isWindowHeldDown = false
        }
      }
    "
    class="window-outer-frame border border-gray-800 flex flex-col overflow-auto w-[0px] h-[0px]"
    :class="{
      'z-50': !props.minimized && props.windowActive,
      'w-full h-full relative': props.maximized,
      'absolute resize': !props.maximized,
      'shadow-2xl': props.windowActive,
      'z-0': !props.windowActive,
    }"
  >
    <div class="window-frame border-4 bg-gray-200 p-0 w-full h-full flex flex-col">
      <div
        class="w-full flex flex-row flex-nowrap p-1 text-sm shrink-0"
        :class="{
          'bg-linear-to-r from-kana-blue to-kana-purple': props.windowActive,
          'bg-kana-blue-pale': !props.windowActive,
        }"
      >
        <!-- Title bar -->
        <div @mousedown="handleDragStart" ref="dragHandle" class="shrink w-full overflow-ellipsis">
          <!-- Title Bar text here -->
          <p
            class="px-2 !select-none text-nowrap text-ellipsis"
            :class="{
              'font-bold': props.windowActive,
            }"
          >
            {{ props.title }}
          </p>
        </div>
        <div class="ml-auto shrink-0">
          <!-- Button container -->
          <ClassicButton
            @click="
              () => {
                emits('minimize')
              }
            "
            class="font-bold"
          >
            __
          </ClassicButton>
          <ClassicButton
            @click="
              () => {
                emits(props.maximized ? 'restore' : 'maximize')
              }
            "
            class="font-bold"
          >
            <span
              :class="{
                'bi-fullscreen': !props.maximized,
                'bi-fullscreen-exit': props.maximized,
              }"
            ></span>
          </ClassicButton>
          <ClassicButton
            @click="
              () => {
                emits('close')
              }
            "
            class="font-bold"
          >
            <span class="bi-x-lg"></span>
          </ClassicButton>
        </div>
      </div>

      <div
        class="grow overflow-auto relative"
        :class="{
          'pointer-events-none': isDragging,
        }"
      >
        <!-- window content here -->
        <div
          v-if="isDragging || !props.windowActive || isWindowHeldDown"
          class="absolute z-50 w-full h-full top-0 left-0"
        >
          <!-- Content shield -->
          <!-- This here to prevent glitches when dragging window component -->
          <!-- Especially if it contains an iframe -->
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.window-frame {
  border-style: outset;
}
</style>
