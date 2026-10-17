import request from '@/utils/http'

export interface BankInfo {
  id: number
  username: string
  accountname: string
  bankname: string
  bankbranch: string
  bankaddress: string
  banknumber: string
  state: number // 0: 审核中, 1: 已审, 2: 驳回
  created_at_text?: string
}

export interface BankSearchParams {
  page?: number
  limit?: number
  state?: number | string
  username?: string
  accountname?: string
}

export interface BankList {
  list: BankInfo[]
  total: number
}

// 获取银行信息列表
export function fetchBankList(params: BankSearchParams) {
  // Construct params, preserving empty strings if that's what backend expects
  const cleanParams: any = {
    page: params.page || 1,
    limit: params.limit || 20,
    username: params.username || '',
    accountname: params.accountname || '',
    state: params.state !== undefined && params.state !== null ? params.state : ''
  }

  return request.get<any>({
    url: '/app/admin/member/bank-list',
    params: cleanParams,
    headers: {
      'X-Requested-With': 'XMLHttpRequest' // Force JSON response from legacy backend
    },
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as BankList
  })
}

// 修改银行信息
export function updateBank(data: Partial<BankInfo>) {
  return request.post({
    url: '/app/admin/member/bank-edit',
    data,
    showSuccessMessage: true
  })
}

// 删除银行信息
export function deleteBank(id: number) {
  return request.post({
    url: '/app/admin/member/bank-delete',
    data: { id },
    showSuccessMessage: true
  })
}
