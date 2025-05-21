<script setup lang="ts">
import IconPhone from '@/components/icons/IconPhone.vue'
import IconCameraOff from '@/components/icons/IconCameraOff.vue'
import IconMicOff from '@/components/icons/IconMicOff.vue'
import IconMonitorUp from '@/components/icons/IconMonitorUp.vue'
import ClassicButton from '@/components/ClassicButton.vue'
</script>

<template>
  <!-- Konten utama video call -->
  <div class="bg-gray-200 w-full flex flex-col items-center h-screen gap-2 p-1 justify-between">
    <!-- Area video dengan border inset klasik -->
    <div
      class="w-full h-full border-inset border-2 border-gray-400 bg-black overflow-hidden aspect-video"
    >
      <!-- <iframe
        class="w-full h-full"
        src="https://www.youtube.com/embed/dTE_TbM2jE4?si=xFvHoVsBlnCsDSTz"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe> -->
      <video src="/placeholder-aergia.mp4" controls autoplay class="w-full h-full"></video>
    </div>

    <!-- Kontrol video call style klasik -->
    <div class="flex justify-center space-x-2 my-1">
      <ClassicButton class="px-3 py-1 flex items-center text-xs">
        <IconMonitorUp class="mr-1" /> <span>Share</span>
      </ClassicButton>
      <ClassicButton class="px-3 py-1 flex items-center text-xs">
        <IconCameraOff class="mr-1" /> <span>Camera</span>
      </ClassicButton>
      <ClassicButton class="px-3 py-1 flex items-center text-xs">
        <IconMicOff class="mr-1" /> <span>Mic</span>
      </ClassicButton>
      <ClassicButton
        class="px-3 py-1 flex items-center text-xs bg-red-100 hover:bg-red-200 active:bg-red-300"
      >
        <IconPhone class="mr-1" /> <span>End</span>
      </ClassicButton>
    </div>

    <!-- Status bar klasik -->
    <div class="bg-gray-300 border-t border-gray-400 text-xs flex justify-between w-full px-2 py-1">
      <div>Status: Connected</div>
      <div>Duration: 00:00:00</div>
    </div>
  </div>
</template>

<style scoped>
.border-inset {
  border-style: inset;
}
</style>
