<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <img
    :src="`/icons/${props.name}.png`"
    :alt="props.name"
    class="aspect-square object-contain object-center"
  />
</template>
