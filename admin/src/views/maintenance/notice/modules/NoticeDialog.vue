<template>
  <ElDialog
    v-model="visible"
    :title="title"
    width="800px"
    @closed="handleClosed"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <ElFormItem label="标题" prop="title">
        <ElInput v-model="form.title" placeholder="请输入公告标题" />
      </ElFormItem>
      <ElFormItem label="内容" prop="content">
        <WangEditor v-model="form.content" style="height: 400px" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">
        确定
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { createNotice, updateNotice, Notice } from '@/api/maintenance-notice'
import WangEditor from '@/components/core/forms/art-wang-editor/index.vue'

const props = defineProps<{
  modelValue: boolean
  type: 'add' | 'edit'
  data?: Notice
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const title = computed(() => (props.type === 'add' ? '添加公告' : '编辑公告'))
const formRef = ref()
const loading = ref(false)

const form = reactive({
  id: 0,
  title: '',
  content: ''
})

const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

watch(
  () => props.data,
  (val) => {
    if (val && props.type === 'edit') {
      form.id = val.id
      form.title = val.title
      form.content = val.content
    } else {
      form.id = 0
      form.title = ''
      form.content = ''
    }
  },
  { immediate: true }
)

const handleClosed = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.id = 0
  form.title = ''
  form.content = ''
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        if (props.type === 'add') {
          await createNotice({ title: form.title, content: form.content })
        } else {
          await updateNotice({ id: form.id, title: form.title, content: form.content })
        }
        emit('submit')
        visible.value = false
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
