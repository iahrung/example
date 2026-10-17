import request from '@/utils/http'

// --- Types ---

export interface AdminRole {
  id: number
  name: string
  desc?: string
  status: number
  created_at?: string
  menu_ids?: number[] // For permissions
}

export interface AdminUser {
  id: number
  username: string
  nickname: string
  avatar?: string
  role_id: number
  role_name?: string
  status: number
  created_at?: string
  last_login_time?: string
  last_login_ip?: string
}

export interface AdminLog {
  id: number
  admin_id: number
  username: string
  url: string
  title: string
  content: string
  ip: string
  useragent: string
  created_at: string
}

export interface RoleSearchParams {
  page?: number
  limit?: number
}

export interface AdminSearchParams {
  page?: number
  limit?: number
  username?: string
  role_id?: number
}

export interface LogSearchParams {
  page?: number
  limit?: number
  username?: string
  title?: string
  start_time?: string
  end_time?: string
}

export interface ListResponse<T> {
  list: T[]
  total: number
}

export interface RuleTreeItem {
  id: number
  pid: number
  title: string
  type: number // 0: dir, 1: menu, 2: button
  checked?: boolean // If the endpoint returns checked state directly
  children?: RuleTreeItem[]
}

// --- Permission API ---

// 获取权限树
export function fetchRuleTree(role_id?: number) {
  return request.get<any>({
    url: '/app/admin/api/admin/rule-tree',
    params: { role_id },
    returnFullResponse: true
  }).then(res => {
    // If backend returns { list: [], checked_ids: [] } or similar
    // The prompt says "返回权限树 + 该角色已勾选的权限ID"
    // We'll assume standard format or adapt.
    return res.data || [] 
  })
}

// 获取角色已分配权限ID (Separate endpoint provided in doc)
export function fetchRoleRuleIds(role_id: number) {
  return request.get<number[]>({
    url: '/app/admin/api/admin/role-rule-ids',
    params: { role_id }
  })
}

// 保存角色权限
export function saveRoleRules(data: { role_id: number; rule_ids: number[] }) {
  return request.post({
    url: '/app/admin/api/admin/role-rules',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    showSuccessMessage: true
  })
}

export function fetchRoleList(params: RoleSearchParams) {
  return request.get<any>({
    url: '/app/admin/api/admin/role-list',
    params,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as ListResponse<AdminRole>
  })
}

export function fetchRoleDetail(id: number) {
  return request.get<AdminRole>({
    url: '/app/admin/api/admin/role-detail',
    params: { id }
  })
}

export function createRole(data: Partial<AdminRole>) {
  return request.post({
    url: '/app/admin/api/admin/role-add',
    data,
    showSuccessMessage: true
  })
}

export function updateRole(data: Partial<AdminRole>) {
  return request.post({
    url: '/app/admin/api/admin/role-edit',
    data,
    showSuccessMessage: true
  })
}

export function deleteRole(id: number) {
  return request.post({
    url: '/app/admin/api/admin/role-delete',
    data: { id },
    showSuccessMessage: true
  })
}

export interface RoleOption {
  id: number
  name: string
}

export function fetchRoleOptions() {
  return request.get<RoleOption[]>({
    url: '/app/admin/api/admin/role-options'
  })
}

// --- Admin User API ---

export function fetchAdminList(params: AdminSearchParams) {
  return request.get<any>({
    url: '/app/admin/api/admin/list',
    params,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as ListResponse<AdminUser>
  })
}

export function fetchAdminDetail(id: number) {
  return request.get<AdminUser>({
    url: '/app/admin/api/admin/detail',
    params: { id }
  })
}

export function createAdmin(data: Partial<AdminUser> & { password?: string }) {
  return request.post({
    url: '/app/admin/api/admin/add',
    data,
    showSuccessMessage: true
  })
}

export function updateAdmin(data: Partial<AdminUser> & { password?: string }) {
  return request.post({
    url: '/app/admin/api/admin/edit',
    data,
    showSuccessMessage: true
  })
}

export function deleteAdmin(id: number) {
  return request.post({
    url: '/app/admin/api/admin/delete',
    data: { id },
    showSuccessMessage: true
  })
}

export function updateAdminStatus(id: number, status: number) {
  return request.post({
    url: '/app/admin/api/admin/status',
    data: { id, status },
    showSuccessMessage: true
  })
}

// --- Admin Log API ---

export function fetchLogList(params: LogSearchParams) {
  return request.get<any>({
    url: '/app/admin/api/admin/log-list',
    params,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as ListResponse<AdminLog>
  })
}

export function deleteLog(ids: number[]) {
  return request.post({
    url: '/app/admin/api/admin/log-delete',
    data: { ids },
    showSuccessMessage: true
  })
}

export function clearLog() {
  return request.post({
    url: '/app/admin/api/admin/log-clear',
    showSuccessMessage: true
  })
}
