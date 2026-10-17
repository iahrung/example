import request from '@/utils/http'

export interface Robot {
  id: number
  username: string
  balance: number | string
  groupid: number
  isonline: number | string // 1 or '在线' etc.
  isonline_raw?: number // if needed
  regtime: string
}

export interface RobotSearchParams {
  page?: number
  limit?: number
  username?: string
}

export interface RobotList {
  list: Robot[]
  total: number
}

// 获取机器人列表
export function fetchRobotList(params: RobotSearchParams) {
  return request.get<RobotList>({
    url: '/app/admin/robot/setting',
    params
  })
}

// 添加机器人
export function createRobot(data: Partial<Robot>) {
  return request.post({
    url: '/app/admin/robot/add-robot',
    data, // Assuming the backend expects form data or json. 1.md implies a page load, but we want an API. 
          // If the backend isn't ready for API calls for 'add', I might need to adjust.
          // But typically in this migration, we assume there's an endpoint or we use the same one.
          // The old code used `layer.open({ content: '/app/admin/robot/add-robot' })` which loads a page.
          // That page likely has a form that posts to somewhere.
          // Without backend access, I'll assume standard pattern: POST to `add-robot` or `save-robot`.
          // If `add-robot` returns HTML, this will fail.
          // However, I must implement the UI. I'll assume the API exists or will be made to match this.
    showSuccessMessage: true
  })
}

// 删除机器人
export function deleteRobot(id: number) {
  return request.post({
    url: '/app/admin/robot/delete-robot',
    data: { id },
    showSuccessMessage: true
  })
}
