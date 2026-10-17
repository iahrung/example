<template>
  <div class="app-container p-4">
    <el-card shadow="never">
      <!-- Search Toolbar -->
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
        <el-form-item label="统计时间">
          <div class="flex items-center">
            <el-date-picker
              v-model="queryParams.sDate"
              type="date"
              placeholder="开始日期"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
            <span class="mx-2">-</span>
            <el-date-picker
              v-model="queryParams.eDate"
              type="date"
              placeholder="结束日期"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
          </div>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="输入用户名"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- Data Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column label="用户名" align="center" prop="username" min-width="100" />
        <el-table-column label="总数" align="center" prop="totalcount" width="80" />
        <el-table-column label="代理数" align="center" prop="agentcount" width="80" />
        <el-table-column label="会员数" align="center" prop="usercount" width="80" />
        <el-table-column label="在线数" align="center" prop="onlinecount" width="80" />
        <el-table-column label="自动充值" align="center" prop="zdrecharge" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.zdrecharge) }}
          </template>
        </el-table-column>
        <el-table-column label="手动加款" align="center" prop="sdjiarecharge" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.sdjiarecharge) }}
          </template>
        </el-table-column>
        <el-table-column label="手动减款" align="center" prop="sdjianrecharge" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.sdjianrecharge) }}
          </template>
        </el-table-column>
        <el-table-column label="提款" align="center" prop="withdraw" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.withdraw) }}
          </template>
        </el-table-column>
        <el-table-column label="充提盈亏" align="center" prop="ctyingkui" min-width="100">
          <template #default="scope">
            <span :class="getProfitClass(scope.row.ctyingkui)">
              {{ formatAmount(scope.row.ctyingkui) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="投注" align="center" prop="touzhu" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.touzhu) }}
          </template>
        </el-table-column>
        <el-table-column label="返奖" align="center" prop="zhongjiang" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.zhongjiang) }}
          </template>
        </el-table-column>
        <el-table-column label="活动" align="center" prop="huodong" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.huodong) }}
          </template>
        </el-table-column>
        <el-table-column label="投注盈亏" align="center" prop="tzyingkui" min-width="100">
          <template #default="scope">
            <span :class="getProfitClass(scope.row.tzyingkui)">
              {{ formatAmount(scope.row.tzyingkui) }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-show="total > 0"
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- Footer Statistics -->
      <div class="statistics-bottom mt-4 p-3 bg-gray-50 border-t border-gray-200 text-sm">
        <span>
          页面小计 - 团队总数：
          <strong class="text-blue-500">{{ pageStats.totalCount }}</strong>
        </span>
        <span class="ml-5">
          充提盈亏：
          <strong class="text-blue-500">{{ formatAmount(pageStats.ctProfit) }}</strong>
        </span>
        <span class="ml-5">
          投注盈亏：
          <strong class="text-blue-500">{{ formatAmount(pageStats.tzProfit) }}</strong>
        </span>
        <span class="float-right">
          共 <strong class="text-blue-500">{{ total }}</strong> 条记录
        </span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { fetchTeamList } from '@/api/statistics'
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'StatisticsTeam' })

const loading = ref(false)
const showSearch = ref(true)
const total = ref(0)
const tableData = ref<Api.Statistics.TeamListItem[]>([])

const queryFormRef = ref<FormInstance>()
const queryParams = reactive<Api.Statistics.TeamListParams>({
  current: 1,
  size: 20,
  username: '',
  sDate: '',
  eDate: ''
})

// Page statistics
const pageStats = computed(() => {
  let totalCount = 0
  let ctProfit = 0
  let tzProfit = 0

  tableData.value.forEach(item => {
    totalCount += Number(item.totalcount || 0)
    ctProfit += Number(item.ctyingkui || 0)
    tzProfit += Number(item.tzyingkui || 0)
  })

  return {
    totalCount,
    ctProfit,
    tzProfit
  }
})

/** Get data list */
const getList = async () => {
  loading.value = true
  try {
    const res = await fetchTeamList(queryParams)
    if (res) {
        tableData.value = res.records || []
        total.value = res.total || 0
    }
  } catch (error) {
    console.error('获取团队统计失败:', error)
  } finally {
    loading.value = false
  }
}

/** Search button action */
const handleQuery = () => {
  queryParams.current = 1
  getList()
}

/** Reset button action */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.sDate = ''
  queryParams.eDate = ''
  handleQuery()
}

/** Handle page size change */
const handleSizeChange = (val: number) => {
  queryParams.size = val
  getList()
}

/** Handle page change */
const handleCurrentChange = (val: number) => {
  queryParams.current = val
  getList()
}

/** Format amount */
const formatAmount = (amount: number | string) => {
  return Number(amount || 0).toFixed(2)
}

/** Get profit class */
const getProfitClass = (amount: number | string) => {
  const val = Number(amount)
  if (val > 0) return 'text-green-500'
  if (val < 0) return 'text-red-500'
  return ''
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.statistics-bottom strong {
  /* font-weight: bold; */
}
</style>
