<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 1,
  },
  value: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 0.001,
  },
})

function quantizeValue(normalScalar) {
  const scalar = normalScalar * (props.max - props.min) + props.min
  const quantized = Math.round(scalar / props.step) * props.step

  return Math.max(props.min, Math.min(props.max, quantized))
}

function quantizeNormal(normalScalar) {
  const normalStep = props.step / (props.max - props.min)

  const normalQuantized = Math.round(normalScalar / normalStep) * normalStep
  return Math.max(0, Math.min(1, normalQuantized))
}

const emits = defineEmits(['change', 'scrubStart', 'scrubEnd', 'scrubbing'])
// const value = ref(0)
const normalizedValue = computed(() => {
  const preNormal = (props.value - props.min) / (props.max - props.min)

  return Math.max(0, Math.min(1, preNormal))
})

const track = ref(null)
const trackBoundingBox = computed(() => {
  if (!track.value) return null

  return track.value.getBoundingClientRect()
})

const handle = ref(null)
const handleBoundingBox = computed(() => {
  if (!handle.value) return null

  return handle.value.getBoundingClientRect()
})

const scrubbedValue = ref(0)
const isScrubbing = ref(false)
const handleOffset = computed(() => {
  const handlePos = isScrubbing.value ? scrubbedValue.value : normalizedValue.value

  return `calc(${handlePos * 100}% - ${(handleBoundingBox.value?.width || 0) / 2}px)`
})

/**
 * Handle scrubbing on the track
 * @param e {MouseEvent}
 */
function handleScrubMove(e) {
  if (!e.buttons) return

  const rawPos = e.clientX - trackBoundingBox.value.x
  const clamped = Math.max(
    0,
    Math.min(trackBoundingBox.value.width - handleBoundingBox.value.width, rawPos),
  )
  const normalized = clamped / (trackBoundingBox.value.width - handleBoundingBox.value.width)

  const quantized = quantizeNormal(normalized)
  scrubbedValue.value = quantized
  emits('scrubbing', quantizeValue(normalized))
}

/**
 * Handle wben scrubbing end (i.e. mouseup)
 * @param e {MouseEvent}
 */
function handleScrubEnd(e) {
  const rawScrubValue = (e.clientX - trackBoundingBox.value.x) / trackBoundingBox.value.width
  const newValue = Math.max(props.min, Math.min(props.max, quantizeValue(rawScrubValue)))

  emits('change', newValue)
  emits('scrubEnd')
  isScrubbing.value = false
  scrubbedValue.value = 0
}

/**
 * Handle slider scrubbing start (mousedown)
 * @param e {MouseEvent}
 */
function handleScrubStart(e) {
  scrubbedValue.value = (e.clientX - trackBoundingBox.value.x) / trackBoundingBox.value.width
  isScrubbing.value = true
  emits('scrubStart', quantizeValue(scrubbedValue.value))
}

watch(isScrubbing, (currentlyScrubbing) => {
  if (currentlyScrubbing) {
    window.addEventListener('mousemove', handleScrubMove)
    window.addEventListener('mouseup', handleScrubEnd)
  } else {
    window.removeEventListener('mousemove', handleScrubMove)
    window.removeEventListener('mouseup', handleScrubEnd)
  }
})
</script>

<template>
  <div
    @mousedown="handleScrubStart"
    class="w-full h-6 relative cursor-pointer select-none overflow-x-visible"
  >
    <div
      ref="track"
      class="w-full bg-gray-400 border-gray-400 border-2 border-inset py-1 relative top-1"
    ></div>
    <div
      ref="handle"
      :style="{
        left: handleOffset,
      }"
      class="absolute origin-center top-0 w-4 h-full border-outset border-2 border-gray-400 bg-gray-300"
    ></div>
  </div>
</template>
