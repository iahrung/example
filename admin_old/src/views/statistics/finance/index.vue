<template>
  <div class="statistics-finance">
    <!-- 筛选栏 -->
    <div class="art-card p-5 mb-5 max-sm:mb-4">
      <ElForm :inline="true" :model="queryParams" class="flex flex-wrap gap-2">
        <ElFormItem label="时间范围" class="!mb-0">
          <ElDatePicker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
        <ElFormItem class="!mb-0">
          <ElButton type="primary" @click="handleSearch">查询</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 核心指标 -->
    <FinanceCards :data="financeStats" />

    <!-- 图表区域 -->
    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <FinanceTrend :data="financeStats?.trendData" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <ChannelTable :data="financeStats" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="12" :lg="12" :xs="24">
        <LargeTransaction :data="financeStats?.largeTransactions" />
      </ElCol>
      <ElCol :xl="12" :lg="12" :xs="24">
        <ChannelTrend :data="financeStats?.channelTrend" />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import FinanceCards from './modules/finance-cards.vue'
  import FinanceTrend from './modules/finance-trend.vue'
  import ChannelTable from './modules/channel-table.vue'
  import LargeTransaction from './modules/large-transaction.vue'
  import ChannelTrend from './modules/channel-trend.vue'
  import { fetchFinanceStats } from '@/api/statistics'

  defineOptions({ name: 'StatisticsFinance' })

  const queryParams = reactive({
    dateRange: []
  })

  const financeStats = ref<Api.Statistics.FinanceStats | null>(null)

  const getFinanceStats = async () => {
    try {
      // 这里可以处理 dateRange 参数
      financeStats.value = await fetchFinanceStats({})
    } catch (error) {
      console.error('获取充提统计失败:', error)
    }
  }

  const handleSearch = () => {
    getFinanceStats()
  }

  onMounted(() => {
    getFinanceStats()
  })
</script>
