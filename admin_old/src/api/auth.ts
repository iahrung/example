import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/app/admin/account/login',
    data: params
  })
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo() {
  return request.get<Api.Auth.UserInfo>({
    url: '/app/admin/account/info'
  })
}

/**
 * 刷新 Token
 * @param params 刷新参数
 * @returns 新的 access_token
 */
export function fetchRefreshToken(params: Api.Auth.RefreshTokenParams) {
  return request.post<Api.Auth.RefreshTokenResponse>({
    url: '/app/admin/account/refreshToken',
    params
  })
}

/**
 * 退出登录
 */
export function fetchLogout() {
  return request.post({
    url: '/app/admin/account/logout'
  })
}
