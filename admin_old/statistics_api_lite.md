# 数据统计模块 API 接口文档 (精简版)

> 本文档对应后台管理系统“数据统计”模块的 4 个核心页面。

## 1. 统计概况 (StatisticsOverview)

**GET** `/app/admin/statistics/overview`
*获取今日核心数据概览*

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

**GET** `/app/admin/statistics/realtime`
*获取实时动态列表*

**GET** `/app/admin/statistics/recharge-trend` (参数: days)
*获取充提趋势图数据*

**GET** `/app/admin/statistics/bet-trend` (参数: days)
*获取投注趋势图数据*

**GET** `/app/admin/statistics/user-growth`
*获取用户增长趋势图数据*

---

## 2. 财务分析 (FinanceAnalysis)

> 包含“资金流水”和“平台盈亏”两个标签页的数据。

### 2.1 资金流水 (Tab 1)

**GET** `/app/admin/statistics/finance`
*获取充值提款综合统计*

**请求参数**: `startDate`, `endDate`

**响应数据**:
*   核心指标卡片 (充值/提现总额、笔数、待审核、差额)
*   通道统计列表 (支付宝/微信等通道的金额、成功率)
*   充提差额趋势图 (每日净流入)
*   大额资金监控列表 (单笔大额充提记录)
*   通道成功率趋势图

### 2.2 平台盈亏 (Tab 2)

**GET** `/app/admin/statistics/profit`
*获取平台盈亏综合统计*

**请求参数**: `startDate`, `endDate`, `lotteryType`

**响应数据**:
*   核心盈亏指标 (投注/中奖/返水/活动/净盈亏/盈亏率)
*   每日盈亏趋势图 (柱状图)
*   彩种盈亏占比 (饼图)
*   成本构成分析 (返水/佣金/活动等占比)
*   时段盈亏分布 (24小时热力图)

---

## 3. 用户运营 (UserOperations)

> 包含“玩家分析”和“代理分析”两个标签页的数据。

### 3.1 玩家分析 (Tab 1)

**GET** `/app/admin/statistics/user`
*获取C端用户统计*

**请求参数**: `startDate`, `endDate`

**响应数据**:
*   用户指标 (注册/活跃/充值/投注/首充)
*   用户留存率 (次日/7日/30日)
*   活跃趋势图 (日活/新增)
*   用户价值分层 (RFM模型分布)
*   访问设备分布 (PC/H5/App占比)

### 3.2 代理分析 (Tab 2)

**GET** `/app/admin/statistics/team`
*获取B端代理统计*

**响应数据**:
*   代理核心指标 (代理数/团队人数/团队充投/佣金)
*   代理层级分布 (各级代理人数占比)
*   佣金发放趋势图
*   团队业绩趋势图
*   代理排行榜 (按业绩/人数排序)

---

## 4. 彩种统计 (StatisticsLottery)

**GET** `/app/admin/statistics/lottery`
*获取游戏产品维度统计*

**请求参数**: `startDate`, `endDate`, `lotteryId`

**响应数据**:
*   彩种详细数据表 (投注/中奖/盈亏/人数)
*   投注金额占比 (饼图)
*   热门玩法排行 (柱状图)
*   投注高峰时段 (24小时趋势)
*   大额中奖榜 (近期大额派奖记录)
