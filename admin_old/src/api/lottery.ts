import request from '@/utils/http'

// 保持原有的宽松类型以兼容现有代码
type LotteryParams = Record<string, unknown>
type LotteryData = Record<string, unknown>

// 彩种列表响应类型
export interface LotteryListResponse {
  list: LotteryData[]
  total: number
  stats?: {
    total: number
    active: number
    maintenance: number
    disabled: number
  }
}

// 玩法列表响应类型
export interface PlayListResponse {
  list: LotteryData[]
  data?: LotteryData[]
  total: number
  count?: number
}

/**
 * 获取彩种列表
 */
export function fetchGetLotteryList(params: LotteryParams) {
  return request.get<LotteryListResponse>({
    url: '/app/admin/api/lottery/index',
    params
  })
}

/**
 * 获取彩种详情
 */
export function fetchGetLotteryDetail(id: number) {
  return request.get<LotteryData>({
    url: '/app/admin/api/lottery/detail',
    params: { id }
  })
}

/**
 * 获取启用彩种列表(下拉用)
 */
export function fetchGetActiveLotteryList() {
  return request.get<any>({
    url: '/app/admin/api/lottery/get-lottery-list'
  })
}

/**
 * 保存彩种修改
 */
export function fetchSaveLottery(data: LotteryData) {
  return request.post({
    url: '/app/admin/api/lottery/save',
    data
  })
}

/**
 * 设置彩种状态(启用/停用, 维护/正常)
 */
export function fetchSetLotteryStatus(data: { id: number; field: string; value: number }) {
  return request.post({
    url: '/app/admin/api/lottery/set-status',
    data
  })
}

/**
 * 删除彩种
 */
export function fetchDeleteLottery(id: number) {
  return request.post({
    url: '/app/admin/api/lottery/delete',
    data: { id }
  })
}

// ==================== 玩法管理接口 ====================

/**
 * 获取玩法列表
 */
export function fetchGetPlayList(params: LotteryParams) {
  return request.get<PlayListResponse>({
    url: '/app/admin/api/lottery/play-list',
    params
  })
}

/**
 * 获取玩法详情
 */
export function fetchGetPlayDetail(id: number) {
  return request.get<LotteryData>({
    url: '/app/admin/api/lottery/play-detail',
    params: { id }
  })
}

/**
 * 保存玩法配置
 */
export function fetchSavePlay(data: LotteryData) {
  return request.post({
    url: '/app/admin/api/lottery/play-save',
    data
  })
}

/**
 * 设置玩法状态
 */
export function fetchSetPlayStatus(data: { id: number; isopen: number }) {
  return request.post({
    url: '/app/admin/api/lottery/play-status',
    data
  })
}

// ==================== 预开奖管理接口 ====================

/**
 * 获取预开奖列表
 */
export function fetchGetPreResultList(params: { lottery_name: string }) {
  return request.get<any>({
    url: '/app/admin/api/lottery/pre-result-list',
    params
  })
}

/**
 * 保存预开奖结果
 */
export function fetchSavePreResult(data: LotteryData) {
  return request.post<LotteryData>({
    url: '/app/admin/api/lottery/pre-result-save',
    data
  })
}

/**
 * 获取预开奖历史记录
 */
export function fetchGetPreResultHistory(params: LotteryParams) {
  return request.get<any>({
    url: '/app/admin/api/lottery/pre-result-history',
    params
  })
}

/**
 * 获取预开奖历史列表
 */
export function fetchGetPreResultHistoryList(params: LotteryParams) {
  return request.get<any>({
    url: '/app/admin/api/lottery/pre-result-history-list',
    params
  })
}

// ==================== 开奖管理接口 ====================

/**
 * 获取开奖列表
 */
export function fetchGetResultList(params: LotteryParams) {
  return request.get<any>({
    url: '/app/admin/api/lottery/result-list',
    params
  })
}

/**
 * 添加开奖
 */
export function fetchAddResult(data: LotteryData) {
  return request.post({
    url: '/app/admin/api/lottery/result-add',
    data
  })
}

/**
 * 编辑开奖
 */
export function fetchEditResult(data: LotteryData) {
  return request.post({
    url: '/app/admin/api/lottery/result-edit',
    data
  })
}

/**
 * 重置开奖
 */
export function fetchResetResult(data: { id: number }) {
  return request.post({
    url: '/app/admin/api/lottery/result-reset',
    data
  })
}

/**
 * 删除开奖
 */
export function fetchDeleteResult(data: { id: number }) {
  return request.post({
    url: '/app/admin/api/lottery/result-delete',
    data
  })
}
