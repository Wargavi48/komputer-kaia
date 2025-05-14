<script setup>
import Slider from './components/SliderComponent.vue'
</script>

<template>
  <div class="flex flex-col w-screen h-screen overflow-hidden">
    <div class="grow-0 h-full bg-black border-4 border-inset"></div>
    <div class="bg-gray-300 shrink-0 p-4">
      <Slider></Slider>
    </div>
  </div>
</template>
