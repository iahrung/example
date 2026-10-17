<template>
  <div class="statistics-lottery">
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
        <ElFormItem label="彩种选择" class="!mb-0">
          <ElSelect v-model="queryParams.lotteryId" placeholder="全部彩种" class="w-40">
            <ElOption label="全部" value="" />
            <ElOption label="幸运28" value="1" />
            <ElOption label="北京快三" value="2" />
            <ElOption label="重庆时时彩" value="3" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem class="!mb-0">
          <ElButton type="primary" @click="handleSearch">查询</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <!-- 图表区域 -->
    <ElRow :gutter="20">
      <ElCol :xl="8" :lg="8" :xs="24">
        <BetPie :data="lotteryStats?.pieData" />
      </ElCol>
      <ElCol :xl="16" :lg="16" :xs="24">
        <BetTimeAnalysis :data="lotteryStats?.peakHours" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <LotteryTable :data="lotteryStats?.list" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <ElRow :gutter="20">
          <ElCol :span="24">
            <HotPlay :data="lotteryStats?.hotPlay" />
          </ElCol>
          <ElCol :span="24">
            <BigWinList :data="lotteryStats?.bigWins" />
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import LotteryTable from './modules/lottery-table.vue'
  import BetPie from './modules/bet-pie.vue'
  import HotPlay from './modules/hot-play.vue'
  import BetTimeAnalysis from './modules/bet-time-analysis.vue'
  import BigWinList from './modules/big-win-list.vue'
  import { fetchLotteryStats } from '@/api/statistics'

  defineOptions({ name: 'StatisticsLottery' })

  const queryParams = reactive({
    dateRange: [],
    lotteryId: ''
  })

  const lotteryStats = ref<Api.Statistics.LotteryStats | null>(null)

  const getLotteryStats = async () => {
    try {
      lotteryStats.value = await fetchLotteryStats({})
    } catch (error) {
      console.error('获取彩种统计失败:', error)
    }
  }

  const handleSearch = () => {
    getLotteryStats()
  }

  onMounted(() => {
    getLotteryStats()
  })
</script>
