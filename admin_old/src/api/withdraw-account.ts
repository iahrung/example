import request from '@/utils/http'

export interface WithdrawAccount {
  id: number
  uid?: number
  username: string
  type: 'bank' | 'usdt' | 'alipay' | 'wechat'
  
  // Backend fields
  bank_name?: string      // For bank
  bank_account?: string   // For bank, alipay, wechat
  account_name?: string   // For bank, alipay, wechat
  usdt_address?: string   // For usdt
  usdt_network?: string   // For usdt

  // Display fields (likely returned by list API)
  account_info?: string   
  is_default: number
  status: number
  created_at_text: string
}

export interface WithdrawAccountSearchParams {
  page?: number
  limit?: number
  username?: string
  type?: string
  status?: string
}

export interface WithdrawAccountList {
  list: WithdrawAccount[]
  total: number
}

// 获取提现账户列表
export function fetchWithdrawAccountList(params: WithdrawAccountSearchParams) {
  return request.get<any>({
    url: '/app/admin/withdraw-account/select',
    params,
    returnFullResponse: true
  }).then(res => {
    // Adapt Layui response format { code: 0, count: 10, data: [...] }
    return {
      list: res.data || [],
      total: res.count || 0
    } as WithdrawAccountList
  })
}

// 添加提现账户
export function createWithdrawAccount(data: Partial<WithdrawAccount>) {
  return request.post({
    url: '/app/admin/withdraw-account/insert',
    data,
    showSuccessMessage: true
  })
}

// 修改提现账户
export function updateWithdrawAccount(data: Partial<WithdrawAccount>) {
  return request.post({
    url: '/app/admin/withdraw-account/update',
    data, // Usually backend expects data + id in body or query. 1.md uses update?id=... for VIEW, but form submit probably POSTs data.
    // 1.md implies: MODULE_PATH + 'update?id=' + obj.data.id for opening the iframe.
    // But for actual update, usually it's a POST to save.
    // Let's assume standard POST update pattern.
    showSuccessMessage: true
  })
}

// 删除提现账户
export function deleteWithdrawAccount(ids: number[]) {
  return request.post({
    url: '/app/admin/withdraw-account/delete',
    data: { ids },
    showSuccessMessage: true
  })
}

// 设为默认账户
export function setDefaultWithdrawAccount(id: number) {
  return request.post({
    url: '/app/admin/withdraw-account/setDefault',
    data: { id },
    showSuccessMessage: true
  })
}
