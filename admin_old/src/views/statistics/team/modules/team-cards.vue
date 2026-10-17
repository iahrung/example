<template>
  <ElRow :gutter="20" class="flex flex-wrap">
    <ElCol v-for="(item, index) in statList" :key="index" :sm="12" :md="8" :lg="4">
      <div class="art-card relative flex flex-col justify-center h-32 px-5 mb-5 max-sm:mb-4">
        <span class="text-g-600 text-sm">{{ item.label }}</span>
        <div class="flex items-baseline mt-2">
          <span v-if="item.prefix" class="text-lg text-g-700 mr-1">{{ item.prefix }}</span>
          <ArtCountTo
            class="text-2xl font-bold"
            :target="item.value"
            :duration="1500"
            :separator="item.separator"
          />
          <span v-if="item.suffix" class="text-sm text-g-600 ml-1">{{ item.suffix }}</span>
        </div>
        <div class="flex items-center mt-2" v-if="item.change !== undefined">
          <span class="text-xs text-g-500">环比</span>
          <span class="ml-1 text-xs font-semibold text-success"> +{{ item.change }}% </span>
        </div>
        <div
          class="absolute top-0 bottom-0 right-4 m-auto size-11 rounded-xl flex-cc"
          :class="item.iconBg"
        >
          <ArtSvgIcon :icon="item.icon" class="text-lg" :class="item.iconClass" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data?: Api.Statistics.TeamStats | null
  }>()

  interface StatItem {
    label: string
    value: number
    prefix?: string
    suffix?: string
    separator?: string
    change?: number
    icon: string
    iconBg: string
    iconClass: string
  }

  const statList = computed<StatItem[]>(() => {
    if (!props.data) return []
    
    return [
      {
        label: '代理总数',
        value: props.data.totalAgents,
        suffix: '人',
        change: 5.2,
        icon: 'ri:shield-user-line',
        iconBg: 'bg-primary/10',
        iconClass: 'text-primary'
      },
      {
        label: '直属下级',
        value: props.data.directMembers,
        suffix: '人',
        change: 8.6,
        icon: 'ri:user-follow-line',
        iconBg: 'bg-success/10',
        iconClass: 'text-success'
      },
      {
        label: '团队总人数',
        value: props.data.teamMembers,
        suffix: '人',
        change: 12.3,
        icon: 'ri:team-line',
        iconBg: 'bg-warning/10',
        iconClass: 'text-warning'
      },
      {
        label: '团队充值',
        value: props.data.teamRecharge,
        prefix: '¥',
        separator: ',',
        change: 15.6,
        icon: 'ri:wallet-3-line',
        iconBg: 'bg-info/10',
        iconClass: 'text-info'
      },
      {
        label: '团队投注',
        value: props.data.teamBet,
        prefix: '¥',
        separator: ',',
        change: 22.5,
        icon: 'ri:game-line',
        iconBg: 'bg-purple-500/10',
        iconClass: 'text-purple-500'
      },
      {
        label: '佣金支出',
        value: props.data.commissionPaid,
        prefix: '¥',
        separator: ',',
        change: 10.2,
        icon: 'ri:hand-coin-line',
        iconBg: 'bg-danger/10',
        iconClass: 'text-danger'
      }
    ]
  })
</script>
