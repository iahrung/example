<template>
  <div class="statistics-profit">
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
            :shortcuts="shortcuts"
          />
        </ElFormItem>
        <ElFormItem label="彩种类型" class="!mb-0">
          <ElSelect v-model="queryParams.lotteryType" placeholder="全部彩种" class="w-40">
            <ElOption label="全部" value="" />
            <ElOption label="系统彩" value="system" />
            <ElOption label="官方彩" value="official" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem class="!mb-0">
          <ElButton type="primary" @click="handleSearch">查询</ElButton>
          <ElButton @click="resetSearch">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 核心指标 -->
    <ProfitCards :data="profitStats" />

    <!-- 图表区域 -->
    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <ProfitChart :data="profitStats?.dailyData" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <LotteryPie :data="profitStats?.lotteryData" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="8" :lg="8" :xs="24">
        <CostStructure :data="profitStats?.costData" />
      </ElCol>
      <ElCol :xl="16" :lg="16" :xs="24">
        <HourlyProfit :data="profitStats?.hourlyData" />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import ProfitCards from './modules/profit-cards.vue'
  import ProfitChart from './modules/profit-chart.vue'
  import LotteryPie from './modules/lottery-pie.vue'
  import CostStructure from './modules/cost-structure.vue'
  import HourlyProfit from './modules/hourly-profit.vue'
  import { fetchProfitStats } from '@/api/statistics'

  defineOptions({ name: 'StatisticsProfit' })

  const queryParams = reactive({
    dateRange: [] as string[],
    lotteryType: ''
  })

  const profitStats = ref<Api.Statistics.ProfitStats | null>(null)

  const getProfitStats = async () => {
    try {
      profitStats.value = await fetchProfitStats({})
    } catch (error) {
      console.error('获取盈亏统计失败:', error)
    }
  }

  const shortcuts = [
    { text: '最近一周', value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }},
    { text: '最近一个月', value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }},
    { text: '最近三个月', value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }}
  ]

  const handleSearch = () => {
    getProfitStats()
  }

  const resetSearch = () => {
    queryParams.dateRange = []
    queryParams.lotteryType = ''
    getProfitStats()
  }

  onMounted(() => {
    getProfitStats()
  })
</script>
