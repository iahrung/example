import request from '@/utils/http'

// 保持原有的宽松类型以兼容现有代码
type OddsParams = Record<string, unknown>
type OddsData = Record<string, unknown>

/**
 * 获取赔率数据
 */
export function fetchOddsData(params: { typeid: string }) {
  return request.get<OddsData[]>({
    url: '/app/admin/odds/get-data',
    params
  })
}

/**
 * 获取赔率快速修改数据
 */
export function fetchQuickOddsData(params: { typeid: string }) {
  return request.get<OddsData[]>({
    url: '/app/admin/odds/quick-data',
    params
  })
}

/**
 * 保存赔率快速修改数据
 */
export function fetchSaveQuickOdds(data: OddsData) {
  return request.post({
    url: '/app/admin/odds/quick-save',
    data
  })
}

/**
 * 保存赔率数据
 */
export function fetchSaveOdds(data: OddsData) {
  return request.post({
    url: '/app/admin/odds/save',
    data
  })
}
