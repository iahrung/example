import request from '@/utils/http'

export interface Recharge {
  id: number
  trano: string
  username: string
  paytype: string
  paytypetitle: string
  oldaccountmoney: string
  amount: string
  newaccountmoney: string
  remark: string
  isauto_text: string
  oddtime: string
  state: number // 0: 未审核, 1: 已审核, -1: 取消申请
}

export interface RechargeStatistics {
  total_amount: string
  total_count: number
  auto_amount: string
  auto_count: number
  manual_amount: string
  manual_count: number
  page_success_amount: string
}

export interface RechargeList {
  list: Recharge[]
  total: number
  statistics?: RechargeStatistics
}

export interface RechargeSearchParams {
  page?: number
  limit?: number
  state?: number | string
  sDate?: string
  eDate?: string
  sAmout?: string
  eAmout?: string
  username?: string
  trano?: string
}

// 获取充值列表
export function fetchRechargeList(params: RechargeSearchParams) {
  // 清理空参数
  const cleanParams: Record<string, string | number> = {
    page: params.page || 1,
    limit: params.limit || 20
  }
  if (params.state !== '' && params.state !== undefined && params.state !== null) cleanParams.state = params.state
  if (params.sDate) cleanParams.sDate = params.sDate
  if (params.eDate) cleanParams.eDate = params.eDate
  if (params.sAmout) cleanParams.sAmout = params.sAmout
  if (params.eAmout) cleanParams.eAmout = params.eAmout
  if (params.username) cleanParams.username = params.username
  if (params.trano) cleanParams.trano = params.trano

  return request.get<{ data: Recharge[]; count: number; statistics?: RechargeStatistics }>({
    url: '/app/admin/finance/recharge-list',
    params: cleanParams,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0,
      statistics: res.statistics
    } as RechargeList
  })
}

// 审核充值
export function approveRecharge(id: number) {
  return request.post({
    url: '/app/admin/finance/recharge-approve',
    data: { id },
    showSuccessMessage: true
  })
}

// 删除充值记录
export function deleteRecharge(id: number) {
  return request.post({
    url: '/app/admin/finance/recharge-delete',
    data: { id },
    showSuccessMessage: true
  })
}
