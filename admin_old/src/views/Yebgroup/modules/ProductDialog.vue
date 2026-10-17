<template>
  <ElDialog
    v-model="dialogVisible"
    :title="type === 'add' ? '添加产品' : '编辑产品'"
    width="500px"
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="产品名称" prop="name">
        <ElInput v-model="formData.name" placeholder="请输入产品名称" />
      </ElFormItem>
      <ElFormItem label="类型" prop="type">
        <ElSelect v-model="formData.type" placeholder="请选择类型">
          <ElOption label="随存随取" value="current" />
          <ElOption label="定期" value="fixed" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="日利率" prop="rate">
        <ElInputNumber v-model="formData.rate" :precision="6" :step="0.0001" :min="0" style="width: 100%" />
        <span class="text-gray-400 text-xs ml-2">例如 0.0003 表示 0.03%</span>
      </ElFormItem>
      <ElFormItem label="利率描述" prop="rate_desc">
        <ElInput v-model="formData.rate_desc" placeholder="例如 '年化10.95%'" />
      </ElFormItem>
      <ElFormItem label="周期天数" prop="duration_days">
        <ElInputNumber v-model="formData.duration_days" :min="0" :step="1" style="width: 100%" />
        <span class="text-gray-400 text-xs ml-2">随存随取为0，定期大于0</span>
      </ElFormItem>
      <ElFormItem label="最低存入" prop="min_amount">
        <ElInputNumber v-model="formData.min_amount" :min="0" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="排序" prop="sort">
        <ElInputNumber v-model="formData.sort" :min="0" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSwitch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { createProduct, updateProduct, type YebProduct } from '@/api/yebao'

const props = defineProps<{
  visible: boolean
  type: 'add' | 'edit'
  data: Partial<YebProduct>
}>()

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const formData = ref<Partial<YebProduct>>({
  name: '',
  type: 'current',
  rate: 0,
  rate_desc: '',
  duration_days: 0,
  min_amount: 0,
  sort: 0,
  status: 1
})

const rules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  rate: [{ required: true, message: '请输入日利率', trigger: 'blur' }],
  rate_desc: [{ required: true, message: '请输入利率描述', trigger: 'blur' }]
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.type === 'edit' && props.data) {
        formData.value = { ...props.data }
      } else {
        formData.value = {
          name: '',
          type: 'current',
          rate: 0,
          rate_desc: '',
          duration_days: 0,
          min_amount: 0,
          sort: 0,
          status: 1
        }
      }
    }
  }
)

const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (props.type === 'add') {
          await createProduct(formData.value)
        } else {
          await updateProduct(formData.value)
        }
        ElMessage.success(props.type === 'add' ? '添加成功' : '修改成功')
        emit('submit')
        handleClose()
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
