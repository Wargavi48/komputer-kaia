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

  windowPos.x = Math.max(0, windowPos.x)
  windowPos.y = Math.max(0, windowPos.y)

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
            boxShadow: props.windowActive ? '10px 10px rgba(0,0,0,0.2)' : 'unset',
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
        <div
          @mousedown="handleDragStart"
          ref="dragHandle"
          class="shrink w-full overflow-ellipsis flex flex-row flex-nowrap gap-1 items-center"
        >
          <template v-if="$slots.icon">
            <slot name="icon"></slot>
          </template>
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
        <div class="ml-auto shrink-0 flex flex-row flex-nowrap gap-1">
          <!-- Button container -->
          <ClassicButton
            @click="
              () => {
                emits('minimize')
              }
            "
            class="font-bold overflow-hidden relative border-gray-300 flex items-center aspect-square"
          >
            <span class="bi-dash-lg top-2 relative leading-4"></span>
          </ClassicButton>
          <ClassicButton
            @click="
              () => {
                emits(props.maximized ? 'restore' : 'maximize')
              }
            "
            class="font-bold border-gray-300 flex items-center aspect-square"
          >
            <span
              class="leading-4"
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
            class="font-bold border-gray-300 flex items-center aspect-square"
          >
            <span class="bi-x-lg leading-4"></span>
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
