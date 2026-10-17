import request from '@/utils/http'

// 保持原有的宽松类型以兼容现有代码
type GameParams = Record<string, unknown>
type GameData = Record<string, unknown>

/**
 * 获取游戏记录(注单)列表
 */
export function fetchGameRecordList(params: GameParams) {
  return request.get<GameData>({
    url: '/app/admin/game/record-list',
    params
  })
}

/**
 * 撤单
 */
export function fetchCancelBet(data: { id: number }) {
  return request.post({
    url: '/app/admin/game/cancel',
    data
  })
}

/**
 * 获取注单异常检测列表
 */
export function fetchAnomalyRecordList(params: GameParams) {
  return request.get<GameData>({
    url: '/app/admin/game/check-anomaly-list',
    params
  })
}
