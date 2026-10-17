<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchSaveLottery, fetchGetLotteryDetail } from '@/api/lottery'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  lotteryId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const formRef = ref()

const form = reactive({
  id: 0,
  title: '',
  name: '',
  typeid: '',
  ftitle: '',
  expecttime: 0,
  ftime: 0,
  qishu: 0,
  issys: 1,
  issd: 0,
  closetime1: '',
  closetime2: '',
  sort: 0,
  isopen: 1
})

const rules = {
  title: [{ required: true, message: '请输入彩种名称', trigger: 'blur' }],
  typeid: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  expecttime: [{ required: true, message: '请输入开奖间隔', trigger: 'blur' }],
  ftime: [{ required: true, message: '请输入封盘时间', trigger: 'blur' }]
}

// 彩种分类选项 (示例数据，实际可从接口获取或常量定义)
const lotteryTypes = [
  { label: '时时彩', value: 'ssc' },
  { label: '快三', value: 'k3' },
  { label: '11选5', value: 'x5' },
  { label: '快乐彩', value: 'keno' },
  { label: '幸运28', value: 'xy28' },
  { label: 'PK10', value: 'pk10' },
  { label: '低频彩', value: 'dpc' },
  { label: '六合彩', value: 'lhc' }
]

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val && props.lotteryId) {
      loadData()
    } else if (val) {
      // Reset form for add mode if needed (though currently only edit is requested)
      resetForm()
    }
  }
)

watch(visible, (val) => {
  emit('update:modelValue', val)
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchGetLotteryDetail(props.lotteryId)
    if (res) {
      Object.assign(form, res)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // Set defaults
  form.id = 0
  form.issys = 1
  form.issd = 0
  form.isopen = 1
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await fetchSaveLottery(form)
        ElMessage.success('保存成功')
        visible.value = false
        emit('success')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? '编辑彩种' : '新增彩种'"
    width="600px"
    append-to-body
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="彩种名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入彩种名称" />
      </el-form-item>

      <el-form-item label="彩种代码" prop="name">
        <el-input v-model="form.name" placeholder="只读" disabled />
      </el-form-item>

      <el-form-item label="所属分类" prop="typeid">
        <el-select v-model="form.typeid" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="item in lotteryTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="彩种简介" prop="ftitle">
        <el-input
          v-model="form.ftitle"
          type="textarea"
          :rows="3"
          placeholder="请输入彩种简介"
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开奖间隔" prop="expecttime">
            <el-input-number v-model="form.expecttime" :min="0" style="width: 100%" />
            <span class="text-gray-400 text-xs ml-2">分钟</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="封盘时间" prop="ftime">
            <el-input-number v-model="form.ftime" :min="0" style="width: 100%" />
            <span class="text-gray-400 text-xs ml-2">秒</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="每日期数" prop="qishu">
            <el-input-number v-model="form.qishu" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据来源">
            <el-switch
              v-model="form.issys"
              :active-value="1"
              :inactive-value="0"
              active-text="系统彩"
              inactive-text="第三方"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手动开奖">
            <el-switch
              v-model="form.issd"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="休市时间1">
            <el-time-picker
              v-model="form.closetime1"
              value-format="HH:mm:ss"
              placeholder="开始时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="休市时间2">
            <el-time-picker
              v-model="form.closetime2"
              value-format="HH:mm:ss"
              placeholder="结束时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>
