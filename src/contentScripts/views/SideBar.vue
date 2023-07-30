<!-- eslint-disable no-console -->
<script setup lang="ts">
import 'uno.css'
import { onMounted, ref } from 'vue'
import { ElDrawer, ElMessage } from 'element-plus'
import type { VerificationResult } from '~/logic/verification'
import { verifyFuns } from '~/logic/verification'
import { storageConf } from '~/logic/storage'

const activeCollapse = ref([''])
const table = ref(false)
const loading = ref(false)
const verifiedCount = ref(0)
const gridData1: { [key: string]: string | boolean | Element }[] = reactive([])
const gridData2: { [key: string]: string | boolean | Element }[] = reactive([])
let fieldsConf = storageConf.value.fields
const verifiConf = storageConf.value.verification

onMounted(() => {
  fieldsConf = fieldsConfConvert(fieldsConf)
  // const { proxy, ctx } = getCurrentInstance()
  // console.log(proxy)
  // proxy.$refs.drawer.addEventListener('click', (event: any) => { console.log(event) })
  // proxy.$refs.drawer.addEventListener('mousedown', (event: any) => { console.log(event) })
})

document.onkeydown = function (event) {
  console.log(event)
  if (event.code === 'Tab' && (event.target as Element).tagName !== 'INPUT') {
    // Tab事件
    onControlBtnClick()
  }
}

function fieldsConfConvert(fieldsConf: any) {
  const converted: any = {}
  for (const item of fieldsConf)
    converted[item.field_id] = item

  return converted
}

// 根据传入的字段列表，到配置文件中获取字段配置，从页面取值，保存到对象中返回
function getFieldsValue(fields: [string]) {
  console.log(fieldsConf)
  const values: any = {}
  for (const field of fields) {
    const fConf = fieldsConf[field]
    if (fConf.locate_method === 'querySelector') {
      const ele = document.querySelector(fConf.location)
      if (ele === null) {
        console.log(`Field [${fConf.field}]元素未找到，请检查。（${fConf.location}）`)
        values[field] = null
        continue
      }
      if (fConf.get_value_method === 'innerText')
        values[field] = ele.innerText
    }
  }
  return values
}

function getEnvValue() {
  const envValue = {}
  return envValue
}

// 根据字段名，获取定位元素，用于跳转定位
function getLocateEle(field: string) {
  const fConf = fieldsConf[field]
  console.log('uuuuuu')
  console.log(fConf)
  if (fConf.locate_method === 'querySelector') {
    const ele = document.querySelector(fConf.location)
    return ele
  }
}

function onControlBtnClick() {
  if (table.value) {
    table.value = false
    return
  }
  // 只有当前页面是审批详情页时，才打开侧边栏
  const conConfig = storageConf.value.form_container
  if (conConfig.locate_method === 'querySelector') {
    const container = document.querySelector(conConfig.location)
    if (container && getComputedStyle(container).display !== 'none') {
      table.value = true
      return
    }
  }
  ElMessage({
    message: '请处于审批单详情页时再点击此按钮.',
    type: 'warning',
  })
}

function onOpenFun() {
  loading.value = true
  verifiedCount.value = 0
  gridData1.splice(0, gridData1.length)
  gridData2.splice(0, gridData2.length)
  console.log('hhhhhhhhhhh')
  console.log(verifyFuns)

  for (const item of verifiConf) {
    verifiedCount.value += 1
    // 获取校验函数
    const vfun = verifyFuns[item.method]
    if (vfun === null) {
      console.log(`方法${item.method}没找到，请检查`)
      continue
    }
    // 获取参数（元素参数、环境参数、配置参数）
    const eleValue = getFieldsValue(item.fields)
    const envValue = getEnvValue()
    const paramValue = item.params
    console.log('?')
    console.log(eleValue, envValue, paramValue)
    // 执行校验函数
    const vresult: VerificationResult = vfun(eleValue, envValue, paramValue)
    // 获取定位信息
    const locateEle = getLocateEle(item.locate_field)
    console.log(vresult)
    gridData1.push({
      verifyObj: item.obj,
      verifyInfo: item.info,
      locateEle,
      result: vresult.result,
      detail: vresult.message,
    })
    gridData2.push({
      verifyObj: item.obj,
      verifyInfo: item.info,
      locateEle,
      result: vresult.result,
      detail: vresult.message,
    })
    // if (result) {

    // }
  }
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

function handleResBtnLocate(grid: string, index: number) {
  let item = null
  if (grid === 'main')
    item = gridData1[index]
  else if (grid === 'hidden')
    item = gridData2[index]
  else
    return

  console.log(item)
  const ele: Element = item.locateEle as Element
  ele.scrollIntoView({ behavior: 'smooth' })
}

function handleResBtnCopy(row: { [key: string]: string }) {
  navigator.clipboard.writeText(row.detail).then(() => {
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  }, () => {
    ElMessage({
      message: '复制失败，请检查浏览器权限',
      type: 'warning',
    })
  })
}
</script>

<template>
  <div @mousedown.stop.prevent>
    <div class="fixed right-0 bottom-0 m-5 z-100 flex items-end font-sans select-none leading-1em">
      <el-button
        class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none teal-600 hover:teal-700"
        @click.stop="onControlBtnClick"
      >
        <pixelarticons-power class="block m-auto text-white text-lg" />
      </el-button>
    </div>

    <ElDrawer
      ref="drawer" v-model="table" title="流程助手" direction="ltr" size="100%" :modal="false"
      :close-on-click-modal="false" :lock-scroll="false" modal-class="drawer-modal"
      @open="onOpenFun"
    >
      <div v-loading="loading" :element-loading-text="`校验中，请等待（${verifiedCount}/${verifiConf.length}）`">
        <el-table :data="gridData1" table-layout="auto" class="prochelper-table" max-height="350">
          <el-table-column property="verifyObj" label="检查项" width="150" />
          <el-table-column property="verifyInfo" label="检查内容" width="150" />
          <el-table-column property="result" label="结果" />
          <el-table-column property="detail" label="详细信息" :show-overflow-tooltip="true" />
          <el-table-column label="操作" fixed="right" width="100">
            <template #default="scope">
              <el-tooltip class="box-item" effect="light" content="定位" placement="top">
                <el-button link type="primary" size="small" @click.prevent="handleResBtnLocate('main', scope.$index)">
                  <material-symbols-location-on-outline class="inline-block m-auto text-lg" />
                </el-button>
              </el-tooltip>

              <el-tooltip class="box-item" effect="light" content="复制检查结果" placement="top">
                <el-button link type="primary" size="small" @click.prevent="handleResBtnCopy(scope.row)">
                  <mingcute-copy-2-line class="inline-block m-auto text-lg" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-collapse v-model="activeCollapse" class="mt-12">
          <el-collapse-item :title="`已折叠${gridData2.length}项无异常结果，点击查看`" name="1">
            <el-table :data="gridData2" table-layout="auto" class="prochelper-table" max-height="350">
              <el-table-column property="verifyObj" label="检查项" width="150" />
              <el-table-column property="verifyInfo" label="检查内容" width="150" />
              <el-table-column property="result" label="结果" />
              <el-table-column property="detail" label="详细信息" :show-overflow-tooltip="true" />
              <el-table-column label="操作" fixed="right" width="100">
                <template #default="scope">
                  <el-tooltip class="box-item" effect="light" content="定位" placement="top">
                    <el-button link type="primary" size="small" @click.prevent="handleResBtnLocate('hidden', scope.$index)">
                      <material-symbols-location-on-outline class="inline-block m-auto text-lg" />
                    </el-button>
                  </el-tooltip>

                  <el-tooltip class="box-item" effect="light" content="复制检查结果" placement="top">
                    <el-button link type="primary" size="small" @click.prevent="handleResBtnCopy(scope.row)">
                      <mingcute-copy-2-line class="inline-block m-auto text-lg" />
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </ElDrawer>
  </div>
</template>

<style>
.drawer-modal {
  width: 35% !important;
}

.el-collapse-item__wrap {
  border-bottom: none !important;
}
</style>
