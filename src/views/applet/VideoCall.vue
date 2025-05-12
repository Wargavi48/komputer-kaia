<script setup lang="ts">
import IconPhone from '@/components/icons/IconPhone.vue'
import IconCameraOff from '@/components/icons/IconCameraOff.vue'
import IconMicOff from '@/components/icons/IconMicOff.vue'
import IconMonitorUp from '@/components/icons/IconMonitorUp.vue'
</script>

<template>
  <div
    class="relative overflow-hidden w-full h-screen flex flex-col items-center justify-center bg-gray-900"
  >
    <!-- Konten utama video call, ganti iframe dengan area video -->
    <iframe
      class="w-full h-screen"
      src="https://www.youtube.com/embed/dTE_TbM2jE4?si=xFvHoVsBlnCsDSTz"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
    <!-- Kontrol bawah -->
    <div class="container max-w-xs mx-auto flex justify-between items-center relative py-4">
      <button class="rounded-full bg-gray-700 p-4">
        <IconMonitorUp />
      </button>
      <button class="rounded-full bg-gray-700 p-4">
        <IconCameraOff />
      </button>
      <button class="rounded-full bg-gray-700 p-4">
        <IconMicOff />
      </button>
      <button class="rounded-full bg-red-700 p-4">
        <IconPhone />
      </button>
    </div>
  </div>
</template>

<!-- minWidth: 406,
    minHeight: 742, -->
