<template>
  <div class="statistics-user">
    <!-- 核心指标 -->
    <UserCards :data="userStats" />

    <!-- 图表区域 -->
    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <ActiveChart :data="userStats?.activeTrend" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <RetentionCard :data="userStats?.retention" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <UserValueAnalysis :data="userStats?.valueAnalysis" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <DeviceDistribution :data="userStats?.deviceDistribution" />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import UserCards from './modules/user-cards.vue'
  import ActiveChart from './modules/active-chart.vue'
  import RetentionCard from './modules/retention-card.vue'
  import UserValueAnalysis from './modules/user-value-analysis.vue'
  import DeviceDistribution from './modules/device-distribution.vue'
  import { fetchUserStats } from '@/api/statistics'

  defineOptions({ name: 'StatisticsUser' })

  const userStats = ref<Api.Statistics.UserStats | null>(null)

  const getUserStats = async () => {
    try {
      userStats.value = await fetchUserStats({})
    } catch (error) {
      console.error('获取用户统计失败:', error)
    }
  }

  onMounted(() => {
    getUserStats()
  })
</script>
