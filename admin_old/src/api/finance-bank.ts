import request from '@/utils/http'

export interface SysBank {
  id: number
  bankcode: string
  bankname: string
  banklogo?: string
  imgbg?: string
  state: number // 1: enabled, 0: disabled
  listorder?: number
}

export interface SysBankSearchParams {
  page?: number
  limit?: number
}

export interface SysBankList {
  list: SysBank[]
  total: number
}

// 获取银行列表
export function fetchSysBankList(params: SysBankSearchParams) {
  const queryStr = `page=${params.page || 1}&limit=${params.limit || 20}`
  return request.get<any>({
    url: `/app/admin/finance/sysbank-list?${queryStr}`,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as SysBankList
  })
}

// 新增银行
export function createSysBank(data: Partial<SysBank>) {
  return request.post({
    url: '/app/admin/finance/sysbank-save',
    data,
    showSuccessMessage: true
  })
}

// 更新银行
export function updateSysBank(data: Partial<SysBank>) {
  return request.post({
    url: '/app/admin/finance/sysbank-update',
    data,
    showSuccessMessage: true
  })
}

// 删除银行
export function deleteSysBank(id: number) {
  return request.post({
    url: '/app/admin/finance/sysbank-delete',
    data: { id },
    showSuccessMessage: true
  })
}

// 设置银行状态
export function setSysBankState(id: number, state: number) {
  return request.post({
    url: '/app/admin/finance/sysbank-setstate',
    data: { id, state },
    showSuccessMessage: true
  })
}

// 批量删除 - 参数: ids[] 数组
export function deleteAllSysBank(ids: number[]) {
  return request.post({
    url: '/app/admin/finance/sysbank-deleteall',
    data: { 'ids[]': ids },
    showSuccessMessage: true
  })
}

// 更新排序 - 参数: ids[], listorder[id]=值
export function updateSysBankOrder(items: { id: number; listorder: number }[]) {
  const data: Record<string, any> = {
    'ids[]': items.map(item => item.id)
  }
  items.forEach(item => {
    data[`listorder[${item.id}]`] = item.listorder
  })
  return request.post({
    url: '/app/admin/finance/sysbank-listorder',
    data,
    showSuccessMessage: true
  })
}
