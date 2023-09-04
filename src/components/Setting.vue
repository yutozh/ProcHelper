<script setup lang="ts">
import VueForm from '@lljj/vue3-form-element'
import type { TabsPaneContext } from 'element-plus'
import { storageSettings } from '~/logic/storage'

const props = defineProps({
  settingName: { type: String, default: '' },
})

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const setting = ref((storageSettings as any)[props.settingName])

const formData = ref({})
const schema = ref({
  type: 'object',
  required: [
    'userName',
    'age',
  ],
  properties: {
    userName: {
      type: 'string',
      title: '用户名',
      default: 'Liu.Jun',
    },
    age: {
      type: 'number',
      title: '年龄',
    },
    bio: {
      'type': 'string',
      'title': '签名',
      'minLength': 10,
      'default': '知道的越多、就知道的越少',
      'ui:options': {
        placeholder: '请输入你的签名',
        type: 'textarea',
        rows: 1,
      },
    },
  },
})
</script>

<template>
  <el-button disabled>
    Default
  </el-button>
  <VueForm
    v-model="formData"
    :schema="schema"
  />
  <h1>Setting: {{ props.settingName }}</h1>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="User" name="first">
      User
    </el-tab-pane>
    <el-tab-pane label="Config" name="second">
      Config
    </el-tab-pane>
    <el-tab-pane label="Role" name="third">
      Role
    </el-tab-pane>
    <el-tab-pane label="Task" name="fourth">
      Task
    </el-tab-pane>
  </el-tabs>
</template>
