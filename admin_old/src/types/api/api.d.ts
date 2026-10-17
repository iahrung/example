/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 认证类型（登录、用户信息等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 注意事项
 *
 * - 在 .vue 文件使用需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 * - 使用全局命名空间，无需导入即可使用
 *
 * ## 使用方式
 *
 * ```typescript
 * const params: Api.Auth.LoginParams = { userName: 'admin', password: '123456' }
 * const response: Api.Auth.UserInfo = await fetchUserInfo()
 * ```
 *
 * @module types/api/api
 * @author Art Design Pro Team
 */

declare namespace Api {
  /** 通用类型 */
  namespace Common {
    /** 分页参数 */
    interface PaginationParams {
      /** 当前页码 */
      current: number
      /** 每页条数 */
      size: number
      /** 总条数 */
      total: number
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<PaginationParams, 'current' | 'size'>

    /** 分页响应基础结构 */
    interface PaginatedResponse<T = any> {
      records: T[]
      current: number
      size: number
      total: number
    }

    /** 启用状态 */
    type EnableStatus = '1' | '2'
  }

  /** 认证类型 */
  namespace Auth {
    /** 登录参数 */
    interface LoginParams {
      username: string
      password: string
      captcha?: string
      skip_captcha?: boolean
    }

    /** 登录响应 */
    interface LoginResponse {
      id: number
      username: string
      nickname: string
      avatar: string
      email: string
      mobile: string
      roles: number[]
      access_token: string
      refresh_token: string
      token_type: string
      expires_in: number
    }

    /** 刷新 Token 参数 */
    interface RefreshTokenParams {
      refresh_token: string
    }

    /** 刷新 Token 响应 */
    interface RefreshTokenResponse {
      access_token: string
      expires_in: number
    }

    /** 用户信息 */
    interface UserInfo {
      id: number
      username: string
      nickname: string
      avatar: string
      email: string
      mobile: string
      isSuperAdmin: boolean
      token?: string
      userId?: number
      roles?: string[]
      buttons?: string[]
      /** @deprecated 使用 username 代替 */
      userName?: string
    }
  }

  /** 系统管理类型 */
  namespace SystemManage {
    /** 用户列表 */
    type UserList = Api.Common.PaginatedResponse<UserListItem>

    /** 用户列表项 */
    interface UserListItem {
      id: number
      avatar: string
      status: string
      userName: string
      userGender: string
      nickName: string
      userPhone: string
      userEmail: string
      userRoles: string[]
      createBy: string
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 用户搜索参数 */
    type UserSearchParams = Partial<
      Pick<UserListItem, 'id' | 'userName' | 'userGender' | 'userPhone' | 'userEmail' | 'status'> &
        Api.Common.CommonSearchParams
    >

    /** 角色列表 */
    type RoleList = Api.Common.PaginatedResponse<RoleListItem>

    /** 角色列表项 */
    interface RoleListItem {
      roleId: number
      roleName: string
      roleCode: string
      description: string
      enabled: boolean
      createTime: string
    }

    /** 角色搜索参数 */
    type RoleSearchParams = Partial<
      Pick<RoleListItem, 'roleId' | 'roleName' | 'roleCode' | 'description' | 'enabled'> &
        Api.Common.CommonSearchParams
    >
  }

  /** 统计模块类型 */
  namespace Statistics {
    /** 统计概况数据 */
    interface OverviewStats {
      todayRegister: number
      todayActive: number
      todayRecharge: number
      todayWithdraw: number
      todayBet: number
      todayPrize: number
      todayProfit: number
      platformBalance: number
      onlineCount: number
    }

    /** 趋势图数据 */
    interface TrendData {
      xAxis: string[]
      series: {
        name: string
        data: number[]
      }[]
    }

    /** 实时动态项 */
    interface RealtimeItem {
      type: 'recharge' | 'withdraw' | 'bet' | 'win'
      content: string
      time: string
      amount: number
    }

    /** 盈亏统计参数 */
    interface ProfitParams {
      startDate?: string
      endDate?: string
      lotteryType?: string
      userLevel?: string
    }

    /** 盈亏统计数据 */
    interface ProfitStats {
      totalBet: number
      totalPrize: number
      totalRebate: number
      totalActivity: number
      netProfit: number
      profitRate: number
      dailyData: TrendData
      lotteryData: { name: string; value: number }[]
      costData?: { name: string; value: number }[]
      hourlyData?: TrendData
    }

    /** 用户统计数据 */
    interface UserStats {
      totalUsers: number
      newUsers: number
      activeUsers: number
      rechargeUsers: number
      betUsers: number
      firstRechargeUsers: number
      retention: {
        day1: number
        day7: number
        day30: number
      }
      activeTrend?: TrendData
      valueAnalysis?: any
      deviceDistribution?: any
    }

    /** 团队统计数据 */
    interface TeamStats {
      totalAgents: number
      directMembers: number
      teamMembers: number
      teamRecharge: number
      teamBet: number
      teamProfit: number
      commissionPaid: number
    }

    /** 团队列表项 */
    interface TeamListItem {
      username: string
      totalcount: number
      agentcount: number
      usercount: number
      onlinecount: number
      zdrecharge: number
      sdjiarecharge: number
      sdjianrecharge: number
      withdraw: number
      ctyingkui: number
      touzhu: number
      zhongjiang: number
      huodong: number
      tzyingkui: number
    }

    /** 团队列表查询参数 */
    interface TeamListParams {
      current: number
      size: number
      sDate?: string
      eDate?: string
      username?: string
    }

    /** 彩种统计参数 */
    interface LotteryParams {
      startDate?: string
      endDate?: string
      lotteryType?: string
      playType?: string
    }

    /** 彩种统计数据 */
    interface LotteryStats {
      list: {
        lotteryName: string
        betCount: number
        betAmount: number
        prizeAmount: number
        profitAmount: number
        profitRate: number
        userCount: number
      }[]
      pieData: { name: string; value: number }[]
      barData: TrendData
      hotPlay: {
        xAxis: string[]
        series: { name: string; data: number[]; itemStyle?: any }[]
      }
      peakHours: {
        xAxis: string[]
        series: { name: string; data: number[]; itemStyle?: any }[]
      }
      bigWins: {
        username: string
        lotteryName: string
        playName?: string // 兼容旧字段
        playTitle?: string // 新字段
        prizeAmount: number
        time: string
      }[]
    }

    /** 充提统计数据 */
    interface FinanceStats {
      recharge: {
        totalAmount: number
        totalCount: number
        userCount: number
        avgAmount: number
        firstAmount: number
        firstCount: number
      }
      withdraw: {
        totalAmount: number
        totalCount: number
        userCount: number
        avgAmount: number
        pendingAmount: number
        pendingCount: number
      }
      channels: {
        name: string
        amount: number
        count: number
        successRate: number
      }[]
      trendData: TrendData
      largeTransactions?: any
      channelTrend?: TrendData
    }
  }
}
