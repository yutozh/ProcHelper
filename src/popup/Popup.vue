<script setup lang="ts">
import { storageDemo } from '~/logic/storage'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-gray-700">
    <Logo />
    <span class="font-size-2">Popup</span>
    <SharedSubtitle />

    <button class="btn mt-2" @click="openOptionsPage">
      打开配置页面
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>
