<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加会员组' : '编辑会员组'"
    width="500px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="组名称" prop="groupname">
        <ElInput v-model="formData.groupname" placeholder="请输入组名称" />
      </ElFormItem>
      <ElFormItem label="头衔" prop="touhan">
        <ElInput v-model="formData.touhan" placeholder="请输入头衔" />
      </ElFormItem>
      <ElFormItem label="反水设置" prop="fanshui">
        <ElInput v-model="formData.fanshui" placeholder="请输入反水设置" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { MemberGroup, createMemberGroup, updateMemberGroup } from '@/api/member'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'

  interface Props {
    visible: boolean
    type: 'add' | 'edit'
    data?: Partial<MemberGroup>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive<Partial<MemberGroup>>({
    groupname: '',
    touhan: '',
    fanshui: ''
  })

  // 表单验证规则
  const rules: FormRules = {
    groupname: [
      { required: true, message: '请输入组名称', trigger: 'blur' }
    ]
  }

  /**
   * 初始化表单数据
   */
  const initFormData = () => {
    if (props.type === 'edit' && props.data) {
      Object.assign(formData, props.data)
    } else {
      Object.assign(formData, {
        groupname: '',
        touhan: '',
        fanshui: ''
      })
    }
  }

  /**
   * 监听对话框状态变化
   */
  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    }
  )

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          if (dialogType.value === 'add') {
            await createMemberGroup(formData)
            ElMessage.success('添加成功')
          } else {
             // Ensure ID is present for update
             if (props.data?.groupid) {
                await updateMemberGroup({ ...formData, groupid: props.data.groupid })
                ElMessage.success('修改成功')
             }
          }
          dialogVisible.value = false
          emit('submit')
        } catch (error) {
          console.error(error)
        }
      }
    })
  }
</script>
