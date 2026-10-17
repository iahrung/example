<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>成本构成分析</h4>
        <p>平台支出占比</p>
      </div>
    </div>
    <ArtRingChart
      height="calc(100% - 50px)"
      :data="pieData"
      :showLegend="true"
      :radius="['40%', '70%']"
      :center="['50%', '50%']"
    />
  </div>
</template>

<script setup lang="ts">
  // 暂时假设 ProfitStats 中会增加 costData 字段，或者单独传递
  const props = defineProps<{
    data?: { name: string; value: number }[]
  }>()

  const pieData = computed(() => {
    if (!props.data) return []
    const colors = ['#E6A23C', '#F56C6C', '#409EFF', '#909399', '#67C23A']
    return props.data.map((item, index) => ({
      ...item,
      itemStyle: { color: colors[index % colors.length] }
    }))
  })
</script>
