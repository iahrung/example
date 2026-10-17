<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>用户价值分层</h4>
        <p>RFM 模型分析用户分布</p>
      </div>
    </div>
    <ArtBarChart
      height="calc(100% - 50px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showLegend="true"
      :showAxisLine="false"
      barWidth="45%"
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
      itemStyle: {
        color: (params: any) => {
          const colors = ['#F56C6C', '#67C23A', '#409EFF', '#E6A23C', '#909399']
          return colors[params.dataIndex % colors.length]
        }
      }
    }))
  })

  const xAxisData = computed(() => {
    if (!props.data) return []
    return props.data.xAxis
  })
</script>
