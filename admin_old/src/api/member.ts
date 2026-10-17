import request from '@/utils/http'

export interface MemberGroup {
  groupid: number
  groupname: string
  touhan: string
  fanshui: string
}

export interface MemberGroupSearchParams {
  page?: number
  limit?: number
  groupname?: string
}

export interface MemberGroupList {
  list: MemberGroup[]
  total: number
}

// 获取会员组列表
export function fetchMemberGroupList(params: MemberGroupSearchParams) {
  return request.get<MemberGroupList>({
    url: '/app/admin/membergroup/list',
    params
  })
}

// 添加会员组
export function createMemberGroup(data: Partial<MemberGroup>) {
  return request.post({
    url: '/app/admin/membergroup/add',
    data,
    showSuccessMessage: true
  })
}

// 修改会员组
export function updateMemberGroup(data: Partial<MemberGroup>) {
  return request.post({
    url: '/app/admin/membergroup/edit',
    data,
    showSuccessMessage: true
  })
}

// 删除会员组
export function deleteMemberGroup(id: number) {
  return request.post({
    url: '/app/admin/membergroup/delete',
    data: { id },
    showSuccessMessage: true
  })
}

// 设置限额 (Save Limit)
export function saveMemberGroupLimit(data: Record<string, unknown>) {
  return request.post({
    url: '/app/admin/membergroup/save-limit',
    data,
    showSuccessMessage: true
  })
}

// 获取限额设置 (Get Limit)
export function getMemberGroupLimit(id: number) {
  return request.get({
    url: '/app/admin/membergroup/get-limit',
    params: { id }
  })
}

export interface Member {
  id: number
  groupid?: number
  groupname: string
  username: string
  userbankname: string
  parent_username: string
  proxy_text: string
  proxy: number
  jinjijilu: string
  balance: number
  point: number
  yebmoney: number
  xima: number
  logintime_text: string
  loginsource: string
  isonline_text: string
  islock: number
  qq?: string
  nickname?: string
  loginip?: string
}

export interface MemberSearchParams {
  page?: number
  limit?: number
  ordertype?: number
  groupid?: number
  proxy?: number
  isnb?: number
  username?: string
  userbankname?: string
  qq?: string
  nickname?: string
  loginip?: string
  isonline?: number
  sDate?: string
  eDate?: string
  sAmount?: string
  eAmount?: string
}

export interface MemberList {
  list: Member[]
  total: number
}

// 获取会员列表
export function fetchMemberList(params: MemberSearchParams) {
  // 过滤掉空字符串参数，避免后端解析错误
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  )
  // Use post method for list as per some legacy systems
  // Or keep get but ensure params are passed correctly.
  // Let's try POST if GET fails? No, error was 500 on list earlier, fixed by params.
  // Now error is on edit.
  return request.get<MemberList>({
    url: '/app/admin/api/member/list',
    params: cleanParams
  })
}

// 修改会员
export function updateMember(data: Partial<Member> & { password?: string }) {
  // Only send known writable fields + id
  const { id, groupid, userbankname, nickname, qq, proxy, password } = data
  
  // Use URLSearchParams for form-urlencoded body
  const params = new URLSearchParams()
  if (id !== undefined) params.append('id', String(id))
  if (groupid !== undefined) params.append('groupid', String(groupid))
  if (userbankname !== undefined) params.append('userbankname', userbankname)
  if (nickname !== undefined) params.append('nickname', nickname || '')
  if (qq !== undefined) params.append('qq', qq || '')
  if (proxy !== undefined) params.append('proxy', String(proxy))
  if (password) params.append('password', password)

  // Use a plain object for data, let the interceptor handle the transformation if needed
  // Or better yet, assume the backend wants JSON with specific structure
  // "参数错误" often means the payload structure or content type is wrong.
  
  // Reverting to simple object but strictly filtered.
  // And removing URLSearchParams to let axios send JSON (default) or form-urlencoded (if configured globally)
  // But wait, we forced x-www-form-urlencoded in interceptor if no content-type.
  // Let's try sending a plain object again, but this time ensure we are not sending any weird types.
  
  const plainPayload: Record<string, string | number | undefined> = {
      id,
      groupid,
      userbankname,
      nickname: nickname || '',
      qq: qq || '',
      proxy
  }
  if (password) plainPayload.password = password

  return request.post({
    url: '/app/admin/api/member/edit',
    data: plainPayload, // Send as object
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    showSuccessMessage: true
  })
}

// 删除会员
export function deleteMember(id: number) {
  return request.post({
    url: '/app/admin/api/member/delete',
    data: { id },
    showSuccessMessage: true
  })
}

// 踢出会员
export function kickMember(id: number) {
  return request.post({
    url: '/app/admin/api/member/kick',
    data: { id },
    showSuccessMessage: true
  })
}

// 添加会员
export function createMember(data: Partial<Member>) {
  return request.post({
    url: '/app/admin/api/member/add',
    data,
    showSuccessMessage: true
  })
}
// 锁定会员
export function lockMember(id: number, islock: number) {
  return request.post({
    url: '/app/admin/api/member/lock',
    data: { id, islock },
    showSuccessMessage: true
  })
}

// 修改金额
export function updateBalance(data: { id: number; balance: number; type: number; remark?: string }) {
  return request.post({
    url: '/app/admin/api/member/edit-balance',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    showSuccessMessage: true
  })
}

// 修改积分
export function updatePoint(data: { id: number; point: number; type: number; remark?: string }) {
  return request.post({
    url: '/app/admin/api/member/edit-point',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    showSuccessMessage: true
  })
}

// 修改洗码
export function updateXima(data: { id: number; xima: number; type: number; remark?: string }) {
  return request.post({
    url: '/app/admin/api/member/edit-xima',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    showSuccessMessage: true
  })
}

// 获取会员详细资料
export function fetchMemberInfo(id: number) {
  return request.get<Member>({
    url: '/app/admin/member/info',
    params: { id }
  })
}

export interface BalanceLogItem {
  id: number
  trano: string
  username: string
  typename: string
  amount: string
  amountbefor: string
  amountafter: string
  remark: string
  oddtime_text: string
}

export interface BalanceLogSearchParams {
  page?: number
  limit?: number
  uid?: number
  type?: string
  sDate?: string
  eDate?: string
  username?: string
  trano?: string
}

export interface BalanceLogList {
  list: BalanceLogItem[]
  total: number
}

// 获取账变记录
export function fetchBalanceLog(params: BalanceLogSearchParams) {
  return request.get<{ data: BalanceLogItem[]; count: number }>({
    url: '/app/admin/member/balance-log-list',
    params,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    } as BalanceLogList
  })
}

// 获取下级会员
export function fetchChildren(params: { parentid: number; page?: number; limit?: number }) {
  return request.get<MemberList>({
    url: '/app/admin/member/list',
    params
  })
}

export interface IpCheckItem {
  loginip: string
  usernames: string
  count: number
  last_login_time: string
}

export interface IpCheckList {
  list: IpCheckItem[]
  total: number
}

// 同IP检测
export function fetchIpCheckList(params: { page?: number; limit?: number }) {
  return request.get<IpCheckList>({
    url: '/app/admin/member/ip-check-data',
    params
  })
}
