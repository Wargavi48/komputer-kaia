<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  filename: { type: String, required: true },
  scale: { type: Number, default: 3 },
  selected: { type: Boolean, default: false },
  unload: { type: Boolean, default: false },
})
const containerRef = ref(null)

function isVisible() {
  /**
   * @type {HTMLDivElement}
   */
  const container = containerRef.value
  const boundingBox = container.getBoundingClientRect()

  return boundingBox.bottom >= 0 && boundingBox.y < window.innerHeight
}

defineExpose({
  isVisible,
})
</script>
<template>
  <div
    ref="containerRef"
    class="space-y-2 relative"
    :class="{
      'w-[32px]': Number(props.scale) === 1,
      'w-[64px]': Number(props.scale) === 2,
      'w-[128px]': Number(props.scale) === 3,
      'w-[256px]': Number(props.scale) === 4,
    }"
  >
    <div class="img-container w-full aspect-square overflow-hidden relative">
      <div
        class="w-full h-full opacity-50 absolute z-20"
        :class="{
          'bg-blue-800': props.selected,
          'bg-transparent': !props.selected,
        }"
      ></div>
      <!-- <img :src="props.src" class="w-full aspect-square object-contain" alt="" /> -->
      <iframe
        v-if="!props.unload"
        :src="props.src"
        class="w-[200%] scale-[50%] aspect-square object-contain origin-top-left absolute z-10"
        frameborder="0"
      />
      <div class="absolute w-full h-full flex flex-row items-center justify-center z-0">
        <img src="/hourglass.gif" class="w-10 h-10" alt="" />
      </div>
    </div>
    <p
      class="truncate"
      :class="{
        'bg-blue-900 text-white': props.selected,
      }"
    >
      {{ filename }}
    </p>
  </div>
</template>

<style scoped></style>
