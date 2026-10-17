<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>热门玩法排行</h4>
        <p>投注人数最多的玩法</p>
      </div>
    </div>
    <ArtBarChart
      height="calc(100% - 50px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showLegend="false"
      :showAxisLine="true"
      barWidth="40%"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data?: Api.Statistics.TrendData | null
  }>()

  const chartData = computed(() => {
    if (!props.data) return []
    return props.data.series.map(item => ({
      ...item,
      itemStyle: { color: '#409EFF' }
    }))
  })

  const xAxisData = computed(() => {
    if (!props.data) return []
    return props.data.xAxis
  })
</script>
