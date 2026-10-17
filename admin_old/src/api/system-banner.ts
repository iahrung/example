import request from '@/utils/http'

export interface Banner {
  id: number
  title: string
  type: number // 0: PC, 1: APP (guessed based on 1.md: "PC轮播图", "APP轮播图")
  url: string // Image URL
  link?: string // Click link (optional, not explicitly in 1.md but common)
  listorder?: number
  status: number // 1: enabled, 0: disabled
  created_at?: string
  type_text?: string // e.g., "PC轮播图"
}

export interface BannerSearchParams {
  page?: number
  limit?: number
}

export interface BannerList {
  list: Banner[]
  total: number
}

// 获取轮播图列表
export function fetchBannerList(params: BannerSearchParams) {
  return request.get<any>({
    url: '/app/admin/system/banner-list',
    params: {
      page: params.page || 1,
      limit: params.limit || 20
    },
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as BannerList
  })
}

// 新增轮播图
export function createBanner(data: Partial<Banner>) {
  return request.post({
    url: '/app/admin/system/banner-add',
    data,
    showSuccessMessage: true
  })
}

// 更新轮播图
export function updateBanner(data: Partial<Banner>) {
  return request.post({
    url: '/app/admin/system/banner-edit',
    data,
    showSuccessMessage: true
  })
}

// 删除轮播图
export function deleteBanner(id: number) {
  return request.post({
    url: '/app/admin/system/banner-delete',
    data: { id },
    showSuccessMessage: true
  })
}

// 批量删除
export function deleteAllBanner(ids: number[]) {
  return request.post({
    url: '/app/admin/system/banner-deleteall', // Guessing deleteall still exists or loop delete
    // If not provided in your list, I'll assume it might not exist or I should loop.
    // You listed only banner-delete. 
    // I'll keep deleteall as guessed 'banner-deleteall' or remove it if you confirm it's missing.
    // Let's stick to 'banner-deleteall' for now as it's standard in other modules.
    data: { 'ids[]': ids },
    showSuccessMessage: true
  })
}

// 更新排序 - Not in your list, but usually exists. I'll keep banner-listorder or assume edit handles it.
export function updateBannerOrder(items: { id: number; listorder: number }[]) {
  // If no specific listorder endpoint, maybe use banner-edit?
  // Let's keep guessing banner-listorder for now.
  const data: Record<string, any> = {
    'ids[]': items.map(item => item.id)
  }
  items.forEach(item => {
    data[`listorder[${item.id}]`] = item.listorder
  })
  return request.post({
    url: '/app/admin/system/banner-listorder',
    data,
    showSuccessMessage: true
  })
}

// 更新状态
export function updateBannerStatus(id: number, status: number) {
  return request.post({
    url: '/app/admin/system/banner-status',
    data: { id, status },
    showSuccessMessage: true
  })
}
