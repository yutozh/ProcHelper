<!-- eslint-disable no-console -->
<script setup lang="ts">
import 'uno.css'
import { ref } from 'vue'
import { ElDrawer } from 'element-plus'
import { verifyFun } from '~/logic/verification'

const activeCollapse = ref([''])
const table = ref(false)
const gridData: { [key: string]: string }[] = reactive([])
const verification = [
  {
    id: 'a',
    name: '测试1',
    locateMethod: 'querySelector',
    location: '#entry-nqv-eoe-vhg',
    verifyMethod: 'hasDigit',
  },
]

function onOpenFun() {
  console.log('okokok')
  for (const item of verification) {
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
        gridData.push({
          name: item.name,
          detail,
        })
        console.log(gridData)
        // if (result) {

        // }
      }
    }
  }
}

function handleResBtnLocate() {

}
</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex items-end font-sans select-none leading-1em">
    <el-button
      class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700"
      @click="table = true"
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
    <el-table :data="gridData" table-layout="fixed">
      <el-table-column property="name" label="检查项" width="150" />
      <el-table-column property="detail" label="结果" />
      <el-table-column property="detail" label="操作" fixed="right">
        <template #default>
          <el-tooltip
            class="box-item"
            effect="light"
            content="定位"
            placement="top"
          >
            <el-button link type="primary" size="small" @click="handleResBtnLocate">
              <material-symbols-location-on-outline class="inline-block m-auto text-lg" />
            </el-button>
          </el-tooltip>

          <el-tooltip
            class="box-item"
            effect="light"
            content="复制检查结果"
            placement="top"
          >
            <el-button link type="primary" size="small">
              <mingcute-copy-2-line class="inline-block m-auto text-lg" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-collapse v-model="activeCollapse">
      <el-collapse-item :title="`已折叠${gridData.length}项无异常结果，点击查看`" name="1">
        <el-table :data="gridData" table-layout="fixed">
          <el-table-column property="name" label="检查项" width="150" />
          <el-table-column property="detail" label="结果" />
          <el-table-column property="detail" label="操作" fixed="right">
            <template #default>
              <el-tooltip
                class="box-item"
                effect="light"
                content="定位"
                placement="top"
              >
                <el-button link type="primary" size="small" @click="handleResBtnLocate">
                  <material-symbols-location-on-outline class="inline-block m-auto text-lg" />
                </el-button>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                effect="light"
                content="复制检查结果"
                placement="top"
              >
                <el-button link type="primary" size="small">
                  <mingcute-copy-2-line class="inline-block m-auto text-lg" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
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
