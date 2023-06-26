<!-- eslint-disable no-console -->
<script setup lang="ts">
import 'uno.css'
import { ref } from 'vue'
import { ElDrawer, ElMessage } from 'element-plus'
import { verifyFun } from '~/logic/verification'
import { storageConf } from '~/logic/storage'

const activeCollapse = ref([''])
const table = ref(false)
const loading = ref(false)
const verifiedCount = ref(0)
const gridData1: { [key: string]: string }[] = reactive([])
const gridData2: { [key: string]: string }[] = reactive([])
const verification = storageConf.value.verification

function onControlBtnClick() {
  if (table.value) {
    table.value = false
    return
  }
  // 只有当前页面是审批详情页时，才打开侧边栏
  const conConfig = storageConf.value.form_container
  if (conConfig.locate_method === 'querySeletor') {
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
  for (const item of verification) {
    verifiedCount.value += 1
    if (item.locateMethod === 'querySelector') {
      const ele = document.querySelector(item.location)
      console.log(ele)
      if (ele) {
        console.log(verifyFun)
        console.log(verifyFun[item.verifyMethod])
        const vfun = verifyFun[item.verifyMethod]
        if (vfun === null) {
          console.log(`方法${item.verifyMethod}没找到，请检查`)
          continue
        }
        const [result, detail] = vfun(ele.innerHTML)
        console.log(result)
        console.log(detail)
        gridData1.push({
          verifyObj: item.verifyObj,
          verifyInfo: item.verifyInfo,
          locateMethod: item.locateMethod,
          location: item.location,
          result,
          detail,
        })
        gridData2.push({
          verifyObj: item.verifyObj,
          verifyInfo: item.verifyInfo,
          locateMethod: item.locateMethod,
          location: item.location,
          result,
          detail,
        })
        // if (result) {

        // }
      }
    }
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
  if (item.locateMethod === 'querySelector') {
    const ele = document.querySelector(item.location)
    ele?.scrollIntoView({ behavior: 'smooth' })
  }
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
  <div class="fixed right-0 bottom-0 m-5 z-100 flex items-end font-sans select-none leading-1em">
    <el-button
      class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none teal-600 hover:teal-700"
      @click="onControlBtnClick"
    >
      <pixelarticons-power class="block m-auto text-white text-lg" />
    </el-button>
  </div>

  <ElDrawer
    v-model="table"
    title="流程助手"
    direction="ltr"
    size="100%"
    :modal="false"
    :close-on-click-modal="false"
    :lock-scroll="false"
    modal-class="drawer-modal"
    @open="onOpenFun"
  >
    <div
      v-loading="loading"
      :element-loading-text="`校验中，请等待（${verifiedCount}/${verification.length}）`"
    >
      <el-table :data="gridData1" table-layout="fixed" class="prochelper-table">
        <el-table-column property="verifyObj" label="检查项" width="150" />
        <el-table-column property="verifyInfo" label="检查内容" width="150" />
        <el-table-column property="result" label="结果" />
        <el-table-column property="detail" label="详细信息" />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="light"
              content="定位"
              placement="top"
            >
              <el-button link type="primary" size="small" @click.prevent="handleResBtnLocate('main', scope.$index)">
                <material-symbols-location-on-outline class="inline-block m-auto text-lg" />
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              effect="light"
              content="复制检查结果"
              placement="top"
            >
              <el-button link type="primary" size="small" @click.prevent="handleResBtnCopy(scope.row)">
                <mingcute-copy-2-line class="inline-block m-auto text-lg" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-collapse v-model="activeCollapse" class="mt-12">
        <el-collapse-item :title="`已折叠${gridData2.length}项无异常结果，点击查看`" name="1">
          <el-table :data="gridData2" table-layout="fixed" class="prochelper-table">
            <el-table-column property="verifyObj" label="检查项" width="150" />
            <el-table-column property="verifyInfo" label="检查内容" width="150" />
            <el-table-column property="result" label="结果" />
            <el-table-column property="detail" label="详细信息" />
            <el-table-column label="操作" fixed="right" width="100">
              <template #default="scope">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="定位"
                  placement="top"
                >
                  <el-button link type="primary" size="small" @click.prevent="handleResBtnLocate('hidden', scope.$index)">
                    <material-symbols-location-on-outline class="inline-block m-auto text-lg" />
                  </el-button>
                </el-tooltip>

                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="复制检查结果"
                  placement="top"
                >
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
</template>

<style>
.drawer-modal {
    width: 35% !important;
}

.el-collapse-item__wrap {
    border-bottom: none !important;
}
</style>
