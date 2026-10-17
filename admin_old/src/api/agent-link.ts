import request from '@/utils/http'

export interface AgentLink {
  id: number
  username: string
  type: number // 0: 会员, 1: 代理
  type_text?: string
  total_count: number // -1 usually means unlimited
  used_count: number
  template: string
  created_at: string
  url?: string // The actual link usually
}

export interface AgentLinkSearchParams {
  page?: number
  limit?: number
  username?: string
}

export interface AgentLinkList {
  list: AgentLink[]
  total: number
}

// 获取代理注册链接列表
export function fetchAgentLinkList(params: AgentLinkSearchParams) {
  // Construct params manually to avoid filtering out empty string if backend expects it,
  // though for search, usually empty string is fine to filter out or keep.
  // Let's clean it just in case to be safe, similar to bank-info.
  const cleanParams: any = {
    page: params.page || 1,
    limit: params.limit || 20
  }
  if (params.username) cleanParams.username = params.username

  return request.get<any>({
    url: '/app/admin/member/agent-link-list',
    params: cleanParams,
    returnFullResponse: true
  }).then(res => {
    // Adapt backend response format { code: 0, count: 100, data: [...] }
    return {
      list: res.data || [],
      total: res.count || 0
    } as AgentLinkList
  })
}

// 添加/修改代理注册链接
export function saveAgentLink(data: Partial<AgentLink>) {
  return request.post({
    url: '/app/admin/member/agent-link-save',
    data,
    showSuccessMessage: true
  })
}

// 删除代理注册链接
export function deleteAgentLink(id: number) {
  return request.post({
    url: '/app/admin/member/agent-link-delete',
    data: { id },
    showSuccessMessage: true
  })
}
