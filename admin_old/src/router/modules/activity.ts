import { AppRouteRecord } from '@/types/router'

export const activityRoutes: AppRouteRecord = {
  path: '/activity',
  name: 'Activity',
  component: 'Layout',
  meta: {
    title: '活动管理',
    icon: 'ri:gift-2-line',
    sort: 20
  },
  children: [
    {
      path: 'list',
      name: 'ActivityList',
      component: '/activity/index',
      meta: {
        title: '活动列表',
        icon: 'ri:list-check'
      }
    },
    {
      path: 'reward',
      name: 'ActivityReward',
      component: '/activity/reward/index',
      meta: {
        title: '活动奖励配置',
        icon: 'ri:gift-line'
      }
    },
    {
      path: 'type',
      name: 'ActivityType',
      component: '/activity/type/index',
      meta: {
        title: '活动分类',
        icon: 'ri:list-settings-line'
      }
    }
  ]
}
