import request from '@/utils/http'

/**
 * 统计概况相关接口
 */

/** 获取统计概况数据 */
export function fetchOverviewStats() {
  return request.get<Api.Statistics.OverviewStats>({
    url: '/app/admin/api/statistics/overview'
  })
}

/** 获取充提趋势数据 */
export function fetchRechargeTrend(params: { days: number }) {
  return request.get<Api.Statistics.TrendData>({
    url: '/app/admin/api/statistics/recharge-trend',
    params
  })
}

/** 获取投注趋势数据 */
export function fetchBetTrend(params: { days: number }) {
  return request.get<Api.Statistics.TrendData>({
    url: '/app/admin/api/statistics/bet-trend',
    params
  })
}

/** 获取用户增长数据 */
export function fetchUserGrowth() {
  return request.get<Api.Statistics.TrendData>({
    url: '/app/admin/api/statistics/user-growth'
  })
}

/** 获取实时动态 */
export function fetchRealtimeStats() {
  return request.get<Api.Statistics.RealtimeItem[]>({
    url: '/app/admin/api/statistics/realtime'
  })
}

/**
 * 盈亏统计接口
 */
export function fetchProfitStats(params: Api.Statistics.ProfitParams) {
  return request.get<Api.Statistics.ProfitStats>({
    url: '/app/admin/api/statistics/profit',
    params
  })
}

/**
 * 用户统计接口
 */
export function fetchUserStats(params: { startDate?: string; endDate?: string }) {
  return request.get<Api.Statistics.UserStats>({
    url: '/app/admin/api/statistics/user',
    params
  })
}

/**
 * 团队统计接口
 */
export function fetchTeamStats() {
  return request.get<Api.Statistics.TeamStats>({
    url: '/app/admin/api/statistics/team'
  })
}

/**
 * 获取团队列表
 */
export function fetchTeamList(params: Api.Statistics.TeamListParams) {
  return request.get<Api.Common.PaginatedResponse<Api.Statistics.TeamListItem>>({
    url: '/app/admin/api/statistics/team',
    params
  })
}

/**
 * 彩种投注统计接口
 */
export function fetchLotteryStats(params: Api.Statistics.LotteryParams) {
  return request.get<Api.Statistics.LotteryStats>({
    url: '/app/admin/api/statistics/lottery',
    params
  })
}

/**
 * 充值提款统计接口
 */
export function fetchFinanceStats(params: { startDate?: string; endDate?: string }) {
  return request.get<Api.Statistics.FinanceStats>({
    url: '/app/admin/api/statistics/finance',
    params
  })
}
