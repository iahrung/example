<!-- 统计概况页面 -->
<template>
  <div class="statistics-overview">
    <!-- 欢迎横幅 -->
    <WelcomeBanner :data="overviewData" />

    <!-- 核心指标卡片 -->
    <StatCards :data="overviewData!" v-loading="loading" v-if="overviewData" />

    <!-- 图表区域 -->
    <ElRow :gutter="20">
      <ElCol :xl="12" :lg="12" :xs="24">
        <TrendChart :data="rechargeTrendData" @update:days="getRechargeTrend" />
      </ElCol>
      <ElCol :xl="12" :lg="12" :xs="24">
        <BetTrendChart :data="betTrendData" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <UserGrowthChart :data="userGrowthData" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <RealtimeStats :list="realtimeData" />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import WelcomeBanner from './modules/welcome-banner.vue'
  import StatCards from './modules/stat-cards.vue'
  import TrendChart from './modules/trend-chart.vue'
  import BetTrendChart from './modules/bet-trend-chart.vue'
  import UserGrowthChart from './modules/user-growth-chart.vue'
  import RealtimeStats from './modules/realtime-stats.vue'
  import { 
    fetchOverviewStats, 
    fetchRechargeTrend, 
    fetchBetTrend, 
    fetchUserGrowth, 
    fetchRealtimeStats 
  } from '@/api/statistics'

  defineOptions({ name: 'StatisticsOverview' })

  const overviewData = ref<Api.Statistics.OverviewStats | null>(null)
  const rechargeTrendData = ref<Api.Statistics.TrendData | null>(null)
  const betTrendData = ref<Api.Statistics.TrendData | null>(null)
  const userGrowthData = ref<Api.Statistics.TrendData | null>(null)
  const realtimeData = ref<Api.Statistics.RealtimeItem[]>([])
  const loading = ref(false)

  // 获取统计概况
  const getOverviewStats = async () => {
    try {
      loading.value = true
      overviewData.value = await fetchOverviewStats()
    } catch (error) {
      console.error('获取统计概况失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取充提趋势
  const getRechargeTrend = async (days = 7) => {
    try {
      rechargeTrendData.value = await fetchRechargeTrend({ days })
    } catch (error) {
      console.error('获取充提趋势失败:', error)
    }
  }

  // 获取投注趋势
  const getBetTrend = async () => {
    try {
      betTrendData.value = await fetchBetTrend({ days: 7 })
    } catch (error) {
      console.error('获取投注趋势失败:', error)
    }
  }

  // 获取用户增长
  const getUserGrowth = async () => {
    try {
      userGrowthData.value = await fetchUserGrowth()
    } catch (error) {
      console.error('获取用户增长失败:', error)
    }
  }

  // 获取实时动态
  const getRealtimeStats = async () => {
    try {
      realtimeData.value = await fetchRealtimeStats()
    } catch (error) {
      console.error('获取实时动态失败:', error)
    }
  }

  onMounted(() => {
    getOverviewStats()
    getRechargeTrend()
    getBetTrend()
    getUserGrowth()
    getRealtimeStats()
  })
</script>
