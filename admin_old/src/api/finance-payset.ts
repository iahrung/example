import request from '@/utils/http'

export interface PaySet {
  id: number
  paytype: string
  paytypetitle: string
  ftitle?: string
  isonline: number // 1: yes, 0: no
  state: number // 1: enabled, 0: disabled
  // Add other fields if necessary from edit form
  listorder?: number
}

export interface PaySetSearchParams {
  page?: number
  limit?: number
}

export interface PaySetList {
  list: PaySet[]
  total: number
}

// 获取充值方式列表
export function fetchPaySetList(params: PaySetSearchParams) {
  return request.get<any>({
    url: '/app/admin/finance/payset-list',
    params: {
      page: params.page || 1,
      limit: params.limit || 20
    },
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as PaySetList
  })
}

// 新增充值方式
export function createPaySet(data: Partial<PaySet>) {
  return request.post({
    url: '/app/admin/finance/payset-save',
    data,
    showSuccessMessage: true
  })
}

// 更新充值方式
export function updatePaySet(data: Partial<PaySet>) {
  return request.post({
    url: '/app/admin/finance/payset-update',
    data,
    showSuccessMessage: true
  })
}

// 删除充值方式
export function deletePaySet(id: number) {
  return request.post({
    url: '/app/admin/finance/payset-delete',
    data: { id },
    showSuccessMessage: true
  })
}

// 设置充值方式状态
export function setPaySetState(id: number, state: number) {
  return request.post({
    url: '/app/admin/finance/payset-setstate',
    data: { id, state },
    showSuccessMessage: true
  })
}

// 批量删除
export function deleteAllPaySet(ids: number[]) {
  return request.post({
    url: '/app/admin/finance/payset-deleteall',
    data: { 'ids[]': ids },
    showSuccessMessage: true
  })
}

// 更新排序
export function updatePaySetOrder(items: { id: number; listorder: number }[]) {
  const data: Record<string, any> = {
    'ids[]': items.map(item => item.id)
  }
  items.forEach(item => {
    data[`listorder[${item.id}]`] = item.listorder
  })
  return request.post({
    url: '/app/admin/finance/payset-listorder',
    data,
    showSuccessMessage: true
  })
}
