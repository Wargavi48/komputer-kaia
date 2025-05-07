<template>
  <button class="border-2 min-w-4 px-1 bg-gray-200">
    <slot />
  </button>
</template>

<style scoped>
button {
  border-style: outset;
}
button:active {
  border-style: inset;
}
</style>
