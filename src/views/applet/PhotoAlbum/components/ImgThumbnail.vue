<script setup>
const props = defineProps({
  src: { type: String, required: true },
  filename: { type: String, required: true },
  scale: { type: Number, default: 3 },
  selected: { type: Boolean, default: false },
})
</script>
<template>
  <div
    class="space-y-2 relative"
    :class="{
      'w-[32px]': Number(props.scale) === 1,
      'w-[64px]': Number(props.scale) === 2,
      'w-[128px]': Number(props.scale) === 3,
      'w-[256px]': Number(props.scale) === 4,
    }"
  >
    <div class="img-container w-full relative">
      <div
        class="w-full h-full opacity-50 absolute"
        :class="{
          'bg-blue-800': props.selected,
          'bg-transparent': !props.selected,
        }"
      ></div>
      <img :src="props.src" class="w-full aspect-square object-contain" alt="" />
    </div>
    <p
      class="truncate"
      :class="{
        'bg-blue-900 text-white': props.selected,
      }"
    >
      {{ filename }}
    </p>
  </div>
</template>

<style scoped></style>
