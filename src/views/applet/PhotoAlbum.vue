<script setup lang="ts">
import ClassicButton from '@/components/ClassicButton.vue'
// import ClassicIcon from '@/components/ClassicIcon.vue'
</script>

<template>
  <div
    class="bg-white w-screen h-screen border-3 border-gray-200 overflow-x-hidden overflow-y-auto"
  >
    <nav
      class="w-full border-b border-outset p-4 bg-gray-200 flex flex-row flex-nowrap items-center"
    >
      <ClassicButton disabled>
        <span class="bi-chevron-left text-xl"></span>
      </ClassicButton>
      <ClassicButton>
        <span class="bi-chevron-right text-xl"></span>
      </ClassicButton>
      <ClassicButton class="ms-2">
        <span class="bi-house text-xl"></span>
      </ClassicButton>

      <div class="flex flex-row items-center ms-auto">
        <ClassicButton>
          <span class="bi-arrow-counterclockwise text-xl"></span>
        </ClassicButton>
        <ClassicButton>
          <span class="bi-arrow-clockwise text-xl"></span>
        </ClassicButton>
        <ClassicButton class="ms-4">
          <span class="bi-download text-xl"></span>
        </ClassicButton>
      </div>
    </nav>
  </div>
</template>
