<script setup>
import { onMounted, ref } from 'vue'

const showText = ref(false)

onMounted(() => {
  setTimeout(() => {
    showText.value = true
  }, 5000)
})
</script>

<template>
  <div
    class="w-screen h-screen fixed z-50 overflow-hidden flex flex-col justify-center items-center bg-black text-orange-700"
  >
    <cite v-if="!showText">
      <p class="text-orange-700 text-center text-2xl">Kaia Operating System v1.0</p>
      <p class="text-orange-700 text-center text-2xl">&copy; 2025 Wargavi48</p>
      <p class="text-orange-700 text-center text-xl mt-8">Written By:</p>
      <div class="flex flex-row justify-center text-xl">
        <table class="table-auto">
          <tbody>
            <tr>
              <td class="p-2 align-top font-bold text-end">Bond</td>
              <td class="p-2 space-y-2">
                <div class="space-x-1">
                  <span class="bi-discord"></span>
                  <span>bondthefifth</span>
                </div>
                <div class="space-x-1">
                  <span class="bi-github"></span>
                  <span>bondanrsantoso</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="p-2 align-top font-bold text-end">Shota / Looptaro</td>
              <td class="p-2 space-y-2">
                <div class="space-x-1">
                  <span class="bi-discord"></span>
                  <span>looptaro</span>
                </div>
                <div class="space-x-1">
                  <span class="bi-twitter"></span>
                  <span>shota_rf</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-orange-700 text-center text-xl mt-8">Infrastructure:</p>
      <div class="flex flex-row justify-center text-xl">
        <table class="table-auto">
          <tbody>
            <tr>
              <td class="p-2 align-top font-bold text-end">Sunny</td>
              <td class="p-2 space-y-2">
                <div class="space-x-1">
                  <span class="bi-discord"></span>
                  <span>sunnymz</span>
                </div>
                <div class="space-x-1">
                  <span class="bi-twitter"></span>
                  <span>sunnymz</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </cite>

    <div v-if="showText">
      <audio class="hidden" autoplay>
        <source src="/ding.webm" type="audio/webm" />
        <source src="/ding.mp3" type="audio/mp3" />
      </audio>
      <p class="text-orange-700 text-center text-2xl">🤍 Sayonaia 💙</p>
      <p class="text-orange-700 text-center text-2xl">It is now safe to turn off your computer</p>
    </div>
  </div>
</template>
