<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import VueForm from '@lljj/vue3-form-element'
import { storageSettings } from '~/logic/storage'

const props = defineProps({
  settingName: { type: String, default: '' },
})


const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const setting = ref(storageSettings.value[props.settingName])
const meta = ref(storageSettings.value["_meta"])
const activeName = ref(Object.keys(storageSettings.value["_meta"])[0])


const currentPage = ref(1)
const pageSize = ref(10)


// 弹出框
let dialogVisible = ref(false)


watch(props, async (newValue, oldValue) => {
  console.log(newValue)
})

// VueForm 配置
const formData = ref({})
let schema = ref({
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

const formProps = ref({
  layoutColumn: 1, // 1 2 3 ，支持 1 2 3 列布局，如果使用inline表单这里配置无效
  inline: false, // 行内表单模式，建议：开启时labelPosition不要配置top, antd不要配置labelCol wrapperCol
  inlineFooter: false, // 如果想要保存按钮和表单元素一行显示，需要配置 true
  labelSuffix: '：', // label后缀
  labelPosition: 'left', // 表单域标签的位置
  isMiniDes: false, // 是否优先mini形式显示描述信息（label文字和描述信息同行显示）
  defaultSelectFirstOption: true, // 单选框必填，是否默认选中第一个
  popover: {}, // 透传给ui 组件库的popver组件，比如element ui Popover，antd a-popover
  labelWidth: '6rem',
  rules: []
})

const formFooter = ref({
  show: true
})

interface User {
  date: string
  name: string
  address: string
}
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}
const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const createBtnClick = () => {
  schema.value = toRaw(meta.value[activeName.value])
  console.log(schema.value)
  console.log(formData.value)
  dialogVisible.value = true
}

const validationSuccess = (formData: any) => {
  console.log(formData)
}
const validationFailed = (errorObj: any) => {
  console.log(errorObj)
}

const submit = (formRefFn: Function) => {
  console.log(formRefFn)
  console.log(formRefFn().validate((err, res) => {
    console.log(">???")
    console.log(err)
    console.log(res)
  }))
}

const validationRule = ({
  field,
  value,
  rootFormData,
  callback
}) => {
  console.log(field)
  return callback();
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="flex content-center ">
        <div class="py-5">
          <span class="c-blue text-xl font-bold">配置管理</span>
          <p class="c-gray text-lg">{{ props.settingName }}</p>
        </div>
      </el-header>
      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane :label="item.$name + ' ' + key" :name="key" v-for="(item, key) in meta">
            <el-row class="flex flex-row-reverse">
              <el-button type="primary" @click="createBtnClick">新建</el-button>
            </el-row>


            <el-table :data="setting[key]" style="width: 100%">
              <el-table-column :label="confKey.toString()" width="180"
                v-for="(confItem, confKey) in meta[key]['properties']">
                <template #default="scope">
                  {{ scope.row[confKey] }}
                </template>
              </el-table-column>
              <el-table-column label="Operations">
                <template #default="scope">
                  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                  <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination class="mt-5" v-model:current-page="currentPage" v-model:page-size="pageSize"
              :page-sizes="[100, 200, 300, 400]" :small="false" :disabled="false" :background="false"
              layout="sizes, prev, pager, next" :total="1000" @current-change="handleCurrentChange" />
            <p>{{ setting[key] }}</p>
            <p>{{ meta[key] }}</p>
            <!-- {{ item.$name }} -->
            <!-- <VueForm v-model="formData" :schema="schema" /> -->
            {{ item.$name }}
            {{ key }}
          </el-tab-pane>
        </el-tabs>
      </el-main>

      <el-dialog v-model="dialogVisible" title="编辑项目" :close-on-click-modal="false">
        {{ formData }}
        <VueForm v-model="formData" :schema="schema" :submit="validationSuccess" :validation-failed:="validationFailed"
          :form-props="formProps" :form-footer="formFooter" :custom-rule="validationRule" :change="validationRule"
          @validate="validationSuccess" :validate-event="false">
          <!-- <template #default="scope">
            <p><el-button @click="submit(scope.formRefFn)" type="primary">点击</el-button></p>
          </template> -->
        </VueForm>
      </el-dialog>
    </el-container>
  </div>


  <head>

  </head>

  <p> {{ props.settingName }}</p>
  <h1>Setting: {{ setting }}</h1>
  <h1>Setting: {{ meta }}</h1>
</template>
