<script setup>
import { onMounted, ref } from 'vue'

const showText = ref(false)

onMounted(() => {
  setTimeout(() => {
    showText.value = true
  }, 1000)
})
</script>

<template>
  <div
    class="w-screen h-screen fixed z-50 overflow-hidden flex flex-col justify-center items-center bg-black"
  >
    <div v-if="showText">
      <p class="text-orange-700 text-center text-2xl">🤍 Sayonaia 💙</p>
      <p class="text-orange-700 text-center text-2xl">It is now safe to turn off your computer</p>
    </div>
  </div>
</template>
