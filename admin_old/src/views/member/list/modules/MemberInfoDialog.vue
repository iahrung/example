<template>
  <ElDialog
    v-model="visible"
    title="会员资料"
    width="600px"
  >
    <ElDescriptions :column="2" border>
      <ElDescriptionsItem label="会员ID">{{ member.id }}</ElDescriptionsItem>
      <ElDescriptionsItem label="用户名">{{ member.username }}</ElDescriptionsItem>
      <ElDescriptionsItem label="真实姓名">{{ member.userbankname }}</ElDescriptionsItem>
      <ElDescriptionsItem label="会员组">{{ member.groupname }}</ElDescriptionsItem>
      <ElDescriptionsItem label="上级">{{ member.parent_username }}</ElDescriptionsItem>
      <ElDescriptionsItem label="类型">{{ member.proxy_text }}</ElDescriptionsItem>
      <ElDescriptionsItem label="余额">{{ Number(member.balance || 0).toFixed(3) }}</ElDescriptionsItem>
      <ElDescriptionsItem label="积分">{{ member.point }}</ElDescriptionsItem>
      <ElDescriptionsItem label="余额宝">{{ Number(member.yebmoney || 0).toFixed(3) }}</ElDescriptionsItem>
      <ElDescriptionsItem label="洗码余额">{{ Number(member.xima || 0).toFixed(3) }}</ElDescriptionsItem>
      <ElDescriptionsItem label="登录时间">{{ member.logintime_text }}</ElDescriptionsItem>
      <ElDescriptionsItem label="登录来源">{{ member.loginsource }}</ElDescriptionsItem>
      <ElDescriptionsItem label="在线状态">{{ member.isonline_text }}</ElDescriptionsItem>
      <ElDescriptionsItem label="账号状态">{{ member.islock === 1 ? '冻结' : '正常' }}</ElDescriptionsItem>
    </ElDescriptions>
    <template #footer>
      <ElButton @click="visible = false">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Member } from '@/api/member'

const props = defineProps<{
  modelValue: boolean
  member: Partial<Member>
}>()

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
