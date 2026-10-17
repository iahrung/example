<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>充提差额趋势</h4>
        <p>近30天资金净流入统计</p>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 50px)"
      :data="chartData as any"
      :xAxisData="xAxisData"
      :showLegend="true"
      :smooth="true"
      :showArea="true"
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
      itemStyle: { color: '#67C23A' },
      areaStyle: { color: 'rgba(103, 194, 58, 0.2)' }
    }))
  })

  const xAxisData = computed(() => {
    if (!props.data) return []
    return props.data.xAxis
  })
</script>
