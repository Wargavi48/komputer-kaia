<script setup>
import bootMsg from '@/assets/boot.txt?raw'
import { onMounted, ref } from 'vue'

const lines = bootMsg.split('\n')

const baseDuration = 10
const variance = 15

/**
 * Handle enter animation/transition
 * @param el {HTMLPreElement}
 * @param i {number}
 */
function onEnter(el) {
  const i = el.dataset.index
  setTimeout(
    () => {
      el.classList.remove('opacity-0')
    },
    i * (baseDuration + variance) + Math.round(Math.random() * variance),
  )
}

const perStageDuration = 2000

const stage = ref(-1)
onMounted(() => {
  stage.value++
  setTimeout(
    () => {
      stage.value++
    },
    Math.round(Math.random() * 2000) + perStageDuration,
  )
})
</script>

<template>
  <div v-if="stage < 1" class="w-screen h-screen fixed bg-black z-50 leading-none">
    <TransitionGroup :css="false" @enter="onEnter">
      <pre
        v-for="(line, i) in lines"
        :key="i"
        :data-index="i"
        v-show="stage === 0"
        class="font-mono text-green-500 leading-none m-0 h-4 opacity-0"
      >
      {{ line }}
    </pre
      >
    </TransitionGroup>
  </div>
  <div
    class="w-screen h-screen fixed bg-black z-50 text-white flex justify-center items-center"
    :class="{
      'opacity-0': stage < 1,
    }"
  >
    <div class="flex flex-col gap-2 items-center">
      <img src="/wargavi.png" alt="" />
      <div class="border border-white w-[400px] relative overflow-hidden">
        <div class="bg-blue-800 h-6 w-18 animate-bar"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bar {
  animation: 2s steps(10, end) slide infinite;
}
@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400px);
  }
}
</style>
