<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>时段盈亏分布</h4>
        <p>24小时盈亏热力分析</p>
      </div>
    </div>
    <ArtBarChart
      height="calc(100% - 50px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showLegend="true"
      :showAxisLine="false"
      barWidth="60%"
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
          return params.value >= 0 ? '#67C23A' : '#F56C6C'
        }
      }
    }))
  })

  const xAxisData = computed(() => {
    if (!props.data) return []
    return props.data.xAxis
  })
</script>
