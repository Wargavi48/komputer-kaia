<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex flex-col flex-nowrap gap-2 items-center shrink-0">
    <div class="aspect-square relative">
      <div
        class="absolute w-full h-full top-0 left-0 bg-blue-800 opacity-50"
        v-if="props.selected"
      ></div>
      <slot name="icon"></slot>
    </div>
    <p
      class="text-center bg-blue-300"
      :class="{
        'bg-blue-300': !props.selected,
        'bg-blue-800 text-white': props.selected,
      }"
    >
      {{ props.label }}
    </p>
  </div>
</template>
