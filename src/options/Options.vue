<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GeneralConf from '~/components/GeneralConf.vue'
import UpDownLoad from '~/components/UpDownLoad.vue'
import Setting from '~/components/Setting.vue'
import NotFound from '~/components/NotFound.vue'
import { storageSettings } from '~/logic/storage'

const routes: { [key: string]: Component } = {
  '': GeneralConf,
  'io': UpDownLoad,
  'setting': Setting,
}
const settings = ref(storageSettings.value)
const currentPath = ref(window.location.hash)

const currentView = computed(() => {
  const hashValue = currentPath.value.slice(1).split('/')[1] // 获取split(/) 后的第2个值
  return routes[hashValue || ''] || NotFound
})

const currentProps = computed(() => {
  const settingName = currentPath.value.slice(1).split('/')[2] // 获取split(/) 后的第3个值
  return { settingName }
})

onMounted(() => {
  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
  })
})
</script>

<template>
  <el-row>
    <el-col :span="4" class="h-full">
      <div class="grid-content ep-bg-purple">
        <div class="mt-10 ml-5">
          <Logo />
        </div>
        <nav class="nav flex flex-col">
          <div class="mt">
            <a href="#/" target="_self">通用</a>
          </div>
          <div class="mt">
            <a href="#/io" target="_self">导入/导出</a>
          </div>
          <div v-for="setting in settings._order" :key="setting" class="mt">
            <a :href="`#/setting/${setting}`" target="_self">
              {{ setting }}
            </a>
          </div>
        </nav>
      </div>
    </el-col>
    <el-col :span="20">
      <el-button>
        test
      </el-button>
      <el-input>
        p
      </el-input>
      <component :is="currentView" v-bind="currentProps" />
      <!-- <div class="grid-content ep-bg-purple-light">
        <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
          <img src="/assets/icon.svg" class="icon-btn mx-2 text-2xl" alt="extension icon">
          <div>配置页面</div>
          <SharedSubtitle />

          <input v-model="storageDemo" class="border border-gray-400 rounded px-2 py-1 mt-2">

          <div class="mt-4">
            Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
          </div>
        </main>
      </div> -->
    </el-col>
  </el-row>
</template>
