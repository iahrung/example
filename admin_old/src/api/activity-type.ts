import request from '@/utils/http'

export interface ActivityType {
  id: number
  name: string // 类型名称
  code: string // 类型代码
  icon?: string
  sort: number
  status: number // 1: enabled, 0: disabled
  remark?: string
  created_at?: string
}

export interface ActivityTypeSearchParams {
  page?: number
  limit?: number
  name?: string
  status?: number
}

export interface ActivityTypeList {
  list: ActivityType[]
  total: number
}

// 获取分类列表
export function fetchActivityTypeList(params: ActivityTypeSearchParams) {
  return request.get<any>({
    url: '/app/admin/api/activity/type-list',
    params,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as ActivityTypeList
  })
}

// 添加分类
export function createActivityType(data: Partial<ActivityType>) {
  return request.post({
    url: '/app/admin/api/activity/type-add',
    data,
    showSuccessMessage: true
  })
}

// 编辑分类
export function updateActivityType(data: Partial<ActivityType>) {
  return request.post({
    url: '/app/admin/api/activity/type-edit',
    data,
    showSuccessMessage: true
  })
}

// 删除分类
export function deleteActivityType(id: number) {
  return request.post({
    url: '/app/admin/api/activity/type-delete',
    data: { id },
    showSuccessMessage: true
  })
}

// 更新状态
export function updateActivityTypeStatus(id: number, status: number) {
  return request.post({
    url: '/app/admin/api/activity/type-status',
    data: { id, status },
    showSuccessMessage: true
  })
}
