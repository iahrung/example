<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>大额资金监控</h4>
        <p>单笔超过 50,000 的充提记录</p>
      </div>
    </div>
    <div class="h-full overflow-hidden pb-8">
      <ElTable :data="tableData" style="width: 100%" height="100%">
        <ElTableColumn prop="type" label="类型" width="80" align="center">
          <template #default="{ row }">
            <ElTag :type="row.type === '充值' ? 'success' : 'warning'" size="small">
              {{ row.type }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="username" label="用户账号" show-overflow-tooltip />
        <ElTableColumn prop="amount" label="金额" align="right">
          <template #default="{ row }">
            <span class="font-medium">¥{{ row.amount.toLocaleString() }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="time" label="时间" align="right" width="100" />
        <ElTableColumn prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <span :class="getStatusClass(row.status)">{{ row.status }}</span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 需要扩展 FinanceStats 类型或者单独定义 LargeTransaction 类型
  // 暂时假设 FinanceStats 中没有 largeTransactions 字段，需要后端补充或者前端单独请求
  // 这里假设 data 中会包含 largeTransactions
  const props = defineProps<{
    data?: any[] // 暂时用 any，后续完善类型
  }>()

  const tableData = computed(() => props.data || [])

  const getStatusClass = (status: string) => {
    if (status === '成功') return 'text-success'
    if (status === '审核中') return 'text-warning'
    return 'text-g-500'
  }
</script>
