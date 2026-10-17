import request from '@/utils/http'

export interface RewardTier {
  level?: number
  money: string
  percent?: string
  self_percent?: string // For consume/loss
  parent_percent?: string // For consume/loss
}

export interface ActivityRewardConfig {
  recharge: RewardTier[]
  daily_consume: RewardTier[]
  monthly_consume: RewardTier[]
  daily_loss: RewardTier[]
  monthly_loss: RewardTier[]
  agent_bonus: RewardTier[]
  other: {
    bindcard_amount: string
  }
}

export interface GiftRecord {
  id: number
  username: string
  type: string
  amount: string
  before_amount: string
  after_amount: string
  remark: string
  created_at: string
}

// Fetch Settings
export function fetchActivityRewardSettings() {
  return request.get<{ data: ActivityRewardConfig }>({
    url: '/app/admin/api/gift/config',
    returnFullResponse: true
  }).then(res => res.data || {} as ActivityRewardConfig)
}

// Save Settings
export function saveActivityRewardSettings(data: ActivityRewardConfig) {
  return request.post({
    url: '/app/admin/api/gift/save',
    data,
    showSuccessMessage: true
  })
}

// Manual Send
export function sendGift(data: { username: string; amount: number; type: string; remark: string }) {
  return request.post({
    url: '/app/admin/api/gift/send',
    data,
    showSuccessMessage: true
  })
}

// Batch Send
export function batchSendGift(data: { usernames: string[]; amount: number; type: string; remark: string }) {
  return request.post({
    url: '/app/admin/api/gift/batch-send',
    data,
    showSuccessMessage: true
  })
}

// Fetch Records
export function fetchGiftRecords(params: any) {
  return request.get<any>({
    url: '/app/admin/api/gift/records',
    params,
    returnFullResponse: true
  }).then(res => {
    return {
      list: res.data || [],
      total: res.count || 0
    }
  })
}
