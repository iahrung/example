import request from '@/utils/http'

export interface Notice {
  id: number
  title: string
  content: string
  users: string // User IDs, empty for all users
  add_time_text: string
  created_at?: string
}

export interface NoticeSearchParams {
  page?: number
  limit?: number
}

export interface NoticeList {
  list: Notice[]
  total: number
}

// 获取站内信列表
export function fetchNoticeList(params: NoticeSearchParams) {
  return request.get<any>({
    url: '/app/admin/member/notice-list',
    params,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as NoticeList
  })
}

// 添加/修改站内信
export function saveNotice(data: Partial<Notice>) {
  const url = data.id ? '/app/admin/member/notice-edit' : '/app/admin/member/notice-add'
  return request.post({
    url,
    data,
    showSuccessMessage: true
  })
}

// 删除站内信
export function deleteNotice(id: number) {
  return request.post({
    url: '/app/admin/member/notice-delete',
    data: { id },
    showSuccessMessage: true
  })
}
