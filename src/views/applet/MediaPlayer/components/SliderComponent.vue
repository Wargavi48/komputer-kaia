<script setup>
import { ref, watch } from 'vue'

const track = ref(null)

watch(track, (tr) => {
  /**
   * @type {HTMLDivElement}
   */
  const trackElement = tr

  trackElement
})

function handleDragStart() {}
</script>

<template>
  <div class="w-full h-6 relative">
    <div
      ref="track"
      class="w-full bg-gray-400 border-gray-400 border-2 border-inset py-1 relative top-1"
    ></div>
    <div
      class="absolute top-0 left-0 w-4 h-full border-outset border-2 border-gray-400 bg-gray-300"
    ></div>
  </div>
</template>
