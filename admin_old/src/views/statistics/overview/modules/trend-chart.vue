<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>充提趋势</h4>
        <p>近7天数据</p>
      </div>
      <ElRadioGroup v-model="timeRange" size="small">
        <ElRadioButton value="7">7天</ElRadioButton>
        <ElRadioButton value="30">30天</ElRadioButton>
      </ElRadioGroup>
    </div>
    <ArtLineChart
      height="calc(100% - 50px)"
      :data="chartData"
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

  const emit = defineEmits(['update:days'])

  const timeRange = ref('7')

  const chartData = computed(() => {
    if (!props.data) return []
    return props.data.series
  })

  const xAxisData = computed(() => {
    if (!props.data) return []
    return props.data.xAxis
  })

  watch(timeRange, (val) => {
    emit('update:days', Number(val))
  })
</script>
