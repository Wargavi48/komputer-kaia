<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl py-10 px-5 mx-auto">
    <div v-for="i in 10" :key="i" class="space-y-1">
      <img src="https://picsum.photos/300/200" class="w-full" alt="placeholder" />
      <p class="text-center">By Aergia</p>
    </div>
  </div>
</template>
