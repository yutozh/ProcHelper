<script lang="ts">
import 'uno.css'
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0,
      info: [],
    }
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    // eslint-disable-next-line no-console
    console.log(`The initial count is ${this.count}.`)
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件处理器绑定
  methods: {
    increment() {
      this.count++
    },
  },
}
</script>

<template>
  <div class="flex items-center ml-2">
    <!-- 让uno引入相应的class样式，供外层元素使用 -->
    <!-- <span class="inline-block v-mid "></span>  -->
    <span class="inline-flex items-center" hidden />

    <el-popover
      width="auto" popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;
                    max-width: 600px;"
    >
      <template #reference>
        <material-symbols-info-outline-rounded class="m-auto text-lg" />
      </template>
      <template #default>
        <div class="rich-conent" style="display: flex; flex-direction: column">
          <div v-for="item in info" :key="item" class="mb-2 mt-2">
            <span class="rich-content__name mt-2 font-bold">
              {{ (item as any).title }}
            </span>
            <span class="rich-content__desc ml-2">
              {{ (item as any).content }}
            </span>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- <div class="fixed right-0 bottom-0 m-5 z-100 flex items-end font-sans select-none leading-1em">
      <div
        class="bg-white text-gray-800 rounded-lg shadow w-max h-min"
        p="x-4 y-2"
        m="y-auto r-2"
        transition="opacity duration-300"
        :class="show ? 'opacity-100' : 'opacity-0'"
      >
        <h1 class="text-lg">
          Vitesse WebExt
        </h1>
        <SharedSubtitle />
      </div>
      <button
        class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
        bg="teal-600 hover:teal-700"
        @click="toggle()"
      >
        <pixelarticons-power class="block m-auto text-white text-lg" />
      </button>
      <button @click="increment">
        Count is: {{ count }}
      </button>
    </div> -->
  </div>
</template>
