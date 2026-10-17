<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>用户留存</h4>
        <p>次日/7日/30日留存率</p>
      </div>
    </div>
    <div class="flex flex-col justify-center h-full pb-10 gap-8">
      <div v-for="(item, index) in retentionList" :key="index" class="relative px-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-g-700">{{ item.label }}</span>
          <span class="font-bold text-xl">{{ item.value }}%</span>
        </div>
        <div class="h-3 bg-g-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-1000"
            :class="item.color"
            :style="{ width: item.value + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data?: { day1: number; day7: number; day30: number } | null
  }>()

  const retentionList = computed(() => {
    if (!props.data) return []
    return [
      { label: '次日留存率', value: props.data.day1, color: 'bg-primary' },
      { label: '7日留存率', value: props.data.day7, color: 'bg-success' },
      { label: '30日留存率', value: props.data.day30, color: 'bg-warning' }
    ]
  })
</script>
