<script setup>
const props = defineProps({
  is: { default: 'button' },
})
</script>
<template>
  <component
    :is="props.is"
    class="border-2 min-w-4 px-1 bg-gray-200 active:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
  >
    <slot />
  </component>
</template>

<style scoped>
button {
  border-style: outset;
}
button:active {
  border-style: inset;
}
</style>
