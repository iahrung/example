# 数据统计模块 API 接口文档

## 1. 统计概况

### 1.1 获取统计概况数据
**GET** `/app/admin/statistics/overview`

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "todayRegister": 156,        // 今日注册
    "todayActive": 2340,         // 今日活跃
    "todayRecharge": 586920,     // 今日充值
    "todayWithdraw": 325680,     // 今日提现
    "todayBet": 1256800,         // 今日投注
    "todayPrize": 986520,        // 今日派奖
    "todayProfit": 125680,       // 今日盈亏
    "platformBalance": 8956230,  // 平台余额
    "onlineCount": 1286          // 实时在线
  }
}
```

### 1.2 获取充提趋势
**GET** `/app/admin/statistics/recharge-trend`

**请求参数**
| 参数 | 类型 | 说明 |
|---|---|---|
| days | int | 天数 (7/30) |

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "xAxis": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    "series": [
      { "name": "充值金额", "data": [586920, 623450, 512360, 698520, 756890, 823650, 912450] },
      { "name": "提现金额", "data": [325680, 412350, 389650, 456230, 523680, 612350, 698520] }
    ]
  }
}
```

### 1.3 获取投注趋势
**GET** `/app/admin/statistics/bet-trend`

**请求参数**
| 参数 | 类型 | 说明 |
|---|---|---|
| days | int | 天数 (7/30) |

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "xAxis": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    "series": [
      { "name": "投注金额", "data": [1256800, 1356920, 1125680, 1456230, 1623580, 1856920, 2012560] },
      { "name": "派奖金额", "data": [986520, 1056230, 856920, 1125680, 1256890, 1423560, 1568920] }
    ]
  }
}
```

### 1.4 获取用户增长趋势
**GET** `/app/admin/statistics/user-growth`

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "xAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    "series": [
      { "name": "累计用户", "data": [12560, 15680, 19230, 23560, 28960, 35680, 42350, 51260, 62580, 75690, 89560, 105680] },
      { "name": "活跃用户", "data": [8560, 10230, 12560, 15680, 18960, 22350, 26580, 31260, 37890, 45620, 53680, 62350] }
    ]
  }
}
```

### 1.5 获取实时动态
**GET** `/app/admin/statistics/realtime`

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": [
    { "type": "recharge", "content": "用户 test*** 充值成功", "time": "刚刚", "amount": 5000 },
    { "type": "bet", "content": "用户 luck*** 投注幸运28", "time": "1分钟前", "amount": -1000 },
    { "type": "win", "content": "用户 win*** 中奖快三", "time": "2分钟前", "amount": 8500 },
    { "type": "withdraw", "content": "用户 vip*** 提现成功", "time": "3分钟前", "amount": -10000 }
  ]
}
```

---

## 2. 盈亏统计

### 2.1 获取盈亏统计数据
**GET** `/app/admin/statistics/profit`

**请求参数**
| 参数 | 类型 | 说明 |
|---|---|---|
| startDate | string | 开始日期 (YYYY-MM-DD) |
| endDate | string | 结束日期 (YYYY-MM-DD) |
| lotteryType | string | 彩种类型 (可选) |

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "totalBet": 1256800,      // 投注总额
    "totalPrize": 986520,     // 中奖总额
    "totalRebate": 56890,     // 返水总额
    "totalActivity": 12560,   // 活动支出
    "netProfit": 200830,      // 净盈亏
    "profitRate": 15.98,      // 盈亏率
    "dailyData": {            // 每日盈亏趋势
      "xAxis": ["1日", "2日", "3日", ...],
      "series": [{ "name": "净盈亏", "data": [10000, 12000, ...] }]
    },
    "lotteryData": [          // 彩种盈亏占比
      { "name": "幸运28", "value": 1048 },
      { "name": "北京快三", "value": 735 }
    ],
    "costData": [             // 成本构成
      { "name": "返水支出", "value": 56890 },
      { "name": "活动礼金", "value": 12560 },
      { "name": "代理佣金", "value": 8560 }
    ],
    "hourlyData": {           // 时段盈亏分布
      "xAxis": ["0:00", "1:00", ...],
      "series": [{ "name": "盈亏金额", "data": [-500, 2000, ...] }]
    }
  }
}
```

---

## 3. 用户统计

### 3.1 获取用户统计数据
**GET** `/app/admin/statistics/user`

**请求参数**
| 参数 | 类型 | 说明 |
|---|---|---|
| startDate | string | 开始日期 |
| endDate | string | 结束日期 |

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "totalUsers": 125680,     // 总用户数
    "newUsers": 156,          // 新增用户
    "activeUsers": 2340,      // 活跃用户
    "rechargeUsers": 896,     // 充值用户
    "betUsers": 1256,         // 投注用户
    "firstRechargeUsers": 32, // 首充用户
    "retention": {            // 留存率
      "day1": 45.2,
      "day7": 28.6,
      "day30": 15.8
    },
    "activeTrend": {          // 活跃趋势
      "xAxis": ["1日", "2日", ...],
      "series": [
        { "name": "活跃用户", "data": [1800, 1900, ...] },
        { "name": "新增用户", "data": [50, 60, ...] }
      ]
    },
    "valueAnalysis": {        // 用户价值分层
      "xAxis": ["高价值", "活跃", "潜力", "流失预警", "流失"],
      "series": [{ "name": "用户数量", "data": [5680, 12560, 8560, 3250, 4560] }]
    },
    "deviceDistribution": [   // 设备分布
      { "name": "H5移动端", "value": 8560 },
      { "name": "iOS App", "value": 3250 }
    ]
  }
}
```

---

## 4. 团队概况

### 4.1 获取团队统计数据
**GET** `/app/admin/statistics/team`

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "totalAgents": 568,           // 代理总数
    "directMembers": 8560,        // 直属下级
    "teamMembers": 125680,        // 团队总人数
    "teamRecharge": 5869200,      // 团队充值
    "teamBet": 12568000,          // 团队投注
    "teamProfit": 2568000,        // 团队盈亏
    "commissionPaid": 586920,     // 佣金支出
    "levelDistribution": [        // 层级分布
      { "name": "一级代理", "value": 156 },
      { "name": "二级代理", "value": 325 }
    ],
    "commissionTrend": {          // 佣金趋势
      "xAxis": ["1日", "2日", ...],
      "series": [{ "name": "佣金支出", "data": [10000, 12000, ...] }]
    },
    "performanceTrend": {         // 业绩趋势
      "xAxis": ["1日", "2日", ...],
      "series": [
        { "name": "团队充值", "data": [100000, 120000, ...] },
        { "name": "团队投注", "data": [200000, 250000, ...] }
      ]
    },
    "rankList": [                 // 代理排行榜
      { "username": "agent888", "teamCount": 1256, "performance": 5896230 },
      { "username": "super666", "teamCount": 986, "performance": 4562300 }
    ]
  }
}
```

---

## 5. 彩种统计

### 5.1 获取彩种统计数据
**GET** `/app/admin/statistics/lottery`

**请求参数**
| 参数 | 类型 | 说明 |
|---|---|---|
| startDate | string | 开始日期 |
| endDate | string | 结束日期 |
| lotteryId | string | 彩种ID (可选) |

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [                     // 详细数据列表
      {
        "lotteryName": "幸运28",
        "betCount": 12560,
        "userCount": 568,
        "betAmount": 586920,
        "prizeAmount": 456230,
        "profitAmount": 130690,
        "profitRate": 22.26
      }
    ],
    "pieData": [                  // 投注占比
      { "name": "幸运28", "value": 5800 },
      { "name": "北京快三", "value": 3600 }
    ],
    "hotPlay": {                  // 热门玩法
      "xAxis": ["大小单双", "特码", "龙虎和"],
      "series": [{ "name": "投注人数", "data": [1560, 1230, 980] }]
    },
    "peakHours": {                // 投注高峰时段
      "xAxis": ["0:00", "1:00", ...],
      "series": [{ "name": "投注金额", "data": [10000, 15000, ...] }]
    },
    "bigWins": [                  // 大额中奖榜
      { "username": "luck888", "lotteryName": "重庆时时彩", "playName": "五星直选", "prizeAmount": 180000, "time": "10:23" }
    ]
  }
}
```

---

## 6. 充值提款

### 6.1 获取充提统计数据
**GET** `/app/admin/statistics/finance`

**请求参数**
| 参数 | 类型 | 说明 |
|---|---|---|
| startDate | string | 开始日期 |
| endDate | string | 结束日期 |

**响应示例**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "cards": {                    // 核心指标
      "rechargeAmount": 586920,
      "rechargeCount": 8560,
      "withdrawAmount": 325680,
      "withdrawCount": 4560,
      "pendingAmount": 56890,
      "netInflow": 261240
    },
    "channels": [                 // 通道统计
      { "name": "支付宝扫码", "count": 2560, "amount": 156890, "rate": 98.5 }
    ],
    "trendData": {                // 充提差额趋势
      "xAxis": ["1日", "2日", ...],
      "series": [{ "name": "资金净流入", "data": [50000, 60000, ...] }]
    },
    "largeTransactions": [        // 大额监控
      { "type": "充值", "username": "vip88888", "amount": 100000, "time": "10:23", "status": "成功" }
    ],
    "channelTrend": {             // 通道成功率趋势
      "xAxis": ["1日", "2日", ...],
      "series": [
        { "name": "支付宝", "data": [98, 99, ...] },
        { "name": "微信", "data": [95, 96, ...] }
      ]
    }
  }
}
```
