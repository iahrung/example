import { AppRouteRecord } from '@/types/router'
import { lotteryManageRoutes } from './lottery-manage'
import { dashboardRoutes } from './dashboard'
import { templateRoutes } from './template'
import { widgetsRoutes } from './widgets'
import { examplesRoutes } from './examples'
import { systemRoutes } from './system'
import { articleRoutes } from './article'
import { resultRoutes } from './result'
import { exceptionRoutes } from './exception'
import { safeguardRoutes } from './safeguard'
import { helpRoutes } from './help'

import { memberRoutes } from './member'
import { financeRoutes } from './finance'
import { activityRoutes } from './activity'
import { liveRoutes } from './live'
import { yebaoRoutes } from './yebao'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  ...lotteryManageRoutes,
  dashboardRoutes,
  memberRoutes,
  financeRoutes,
  activityRoutes,
  liveRoutes,
  yebaoRoutes,
  templateRoutes,
  widgetsRoutes,
  examplesRoutes,
  systemRoutes,
  articleRoutes,
  resultRoutes,
  exceptionRoutes,
  safeguardRoutes,
  ...helpRoutes
]
