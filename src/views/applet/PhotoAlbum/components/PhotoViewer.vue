<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  nextPath: { type: String, required: false },
  prevPath: { type: String, required: false },
})

const imageLoaded = ref(false)

function handlePhotoLoad() {
  imageLoaded.value = true
}

watch(props, () => {
  imageLoaded.value = false
})
</script>

<template>
  <div class="w-full h-full grow-0 flex flex-col overflow-y-hidden relative bg-gray-200">
    <div
      class="h-full border-3 border-inset shrink grow-0 bg-black relative flex flex-col justify-center"
    >
      <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <img src="/hourglass.gif" class="w-10 h-10" v-if="!imageLoaded" alt="" />
      </div>
      <!-- <iframe
        @load="handlePhotoLoad"
        :src="props.src"
        class="w-full h-full"
        frameborder="0"
      ></iframe> -->
      <img
        :key="props.src"
        @load="handlePhotoLoad"
        :src="props.src"
        class="w-full h-full object-contain"
        :class="{
          'opacity-0': !imageLoaded,
        }"
        alt=""
      />
    </div>
  </div>
</template>
