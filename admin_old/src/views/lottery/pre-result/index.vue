<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
import { fetchGetActiveLotteryList, fetchGetPreResultList, fetchSavePreResult } from '@/api/lottery'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'PreResult'
})

// 类型定义
interface LotteryItem {
  name: string
  title: string
  typeid: string
  issys: number // 1为系统彩
}

interface IssueItem {
  expect: string
  opencode: string
  opentime: string
  admin: string
  // 辅助字段，用于前端编辑
  codes: string[] 
}

interface PreResultResponse {
  lottery: {
    name: string
    title: string
    typeid: string
  }
  issues: IssueItem[]
}

const router = useRouter()
const loading = ref(false)
const lotteryList = ref<LotteryItem[]>([])
const currentLottery = ref('')
const tableData = ref<IssueItem[]>([])
const currentLotteryInfo = ref<PreResultResponse['lottery'] | null>(null)

// 彩种类型映射
const typeNames: Record<string, string> = {
  'ssc': '时时彩',
  'k3': '快三',
  '11x5': '11选5',
  'x5': '11选5',
  'pk10': 'PK10',
  'xy28': '幸运28',
  'lhc': '六合彩',
  'dpc': '低频彩',
  'keno': '快乐彩'
}

// 获取彩种配置（球数和范围）
const getBallConfig = (typeid: string) => {
  let count = 5
  let range: string[] = []

  switch (typeid) {
    case 'ssc': // 0-9
      count = 5
      range = Array.from({ length: 10 }, (_, i) => i.toString())
      break
    case 'k3': // 1-6
      count = 3
      range = Array.from({ length: 6 }, (_, i) => (i + 1).toString())
      break
    case '11x5': // 01-11
    case 'x5':
      count = 5
      range = Array.from({ length: 11 }, (_, i) => (i + 1).toString().padStart(2, '0'))
      break
    case 'pk10': // 01-10
      count = 10
      range = Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0'))
      break
    case 'lhc': // 01-49
      count = 7
      range = Array.from({ length: 49 }, (_, i) => (i + 1).toString().padStart(2, '0'))
      break
    case 'xy28': // 3个球 0-9
      count = 3
      range = Array.from({ length: 10 }, (_, i) => i.toString())
      break
    default: // 默认 5个 0-9
      count = 5
      range = Array.from({ length: 10 }, (_, i) => i.toString())
  }
  return { count, range }
}

// 计算属性：按类型分组的彩种列表
const groupedLotteries = computed(() => {
  const groups: Record<string, LotteryItem[]> = {}
  lotteryList.value.forEach(item => {
    // 只显示系统彩 (issys == 1)
    if (item.issys == 1) {
      const type = item.typeid || 'other'
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(item)
    }
  })
  return groups
})

onMounted(() => {
  loadLotteries()
})

async function loadLotteries() {
  try {
    const res = await fetchGetActiveLotteryList()
    // 适配接口返回结构，兼容 res.data 或直接返回数组的情况
    // 根据 1.md 的 ajax 逻辑，res.data 是数组
    const list = Array.isArray(res) ? res : (res.data || [])
    lotteryList.value = list
    
    // 自动选择第一个系统彩
    const firstSys = list.find((item: any) => item.issys == 1)
    if (firstSys) {
      currentLottery.value = firstSys.name
      handleLotteryChange()
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取彩种列表失败')
  }
}

async function handleLotteryChange() {
  if (!currentLottery.value) return
  
  loading.value = true
  try {
    const res = await fetchGetPreResultList({ lottery_name: currentLottery.value })
    // 兼容接口返回
    const data = res.data || (res.lottery ? res : null)
    
    if (data) {
      currentLotteryInfo.value = data.lottery
      // 处理 issues 数据，初始化 codes 数组
      tableData.value = (data.issues || []).map((issue: any) => {
        const config = getBallConfig(data.lottery.typeid)
        let codes: string[] = []
        if (issue.opencode) {
          codes = issue.opencode.split(',')
        }
        // 补齐 codes 以匹配 count，用于渲染下拉框
        if (codes.length < config.count) {
             const diff = config.count - codes.length;
             for(let i=0; i<diff; i++) codes.push('');
        } else if (codes.length > config.count) {
             codes = codes.slice(0, config.count);
        }

        return {
          ...issue,
          codes
        }
      })
    } else {
      tableData.value = []
      currentLotteryInfo.value = null
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('加载预开奖数据失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

async function handleSave(row: IssueItem) {
  // 验证是否所有球都已选择
  if (row.codes.some(c => !c)) {
    ElMessage.warning('请选择完整的开奖号码')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要修改期号 ${row.expect} 的开奖结果吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 构造后端需要的 opencode1, opencode2... 格式
    const opencodeData: Record<string, string> = {}
    // 按照旧系统逻辑，即使只有5个球，也要传到 opencode20
    for (let i = 0; i < 20; i++) {
        if (i < row.codes.length) {
            opencodeData[`opencode${i + 1}`] = row.codes[i];
        } else {
             opencodeData[`opencode${i + 1}`] = '';
        }
    }

    const postData = {
      expect: row.expect,
      name: currentLotteryInfo.value?.name,
      opentime: row.opentime,
      ...opencodeData
    }

    const res = await fetchSavePreResult(postData)
    
    if (res.code === 0) {
         ElMessage.success(res.msg || '保存成功')
        // 更新本地显示状态 (管理员名)
        row.admin = 'admin' 
    } else {
         ElMessage.error(res.msg || '保存失败')
    }
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

function goToHistory() {
  router.push('/lottery/pre-result-history')
}
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <!-- 顶部工具栏 -->
    <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700">彩种:</span>
        <el-select 
          v-model="currentLottery" 
          placeholder="请选择彩种" 
          class="!w-64"
          filterable
          @change="handleLotteryChange"
        >
          <el-option-group
            v-for="(items, type) in groupedLotteries"
            :key="type"
            :label="typeNames[type] || '其他'"
          >
            <el-option
              v-for="item in items"
              :key="item.name"
              :label="item.title"
              :value="item.name"
            />
          </el-option-group>
        </el-select>
      </div>

      <div>
        <el-button type="primary" plain @click="goToHistory">
          <el-icon class="mr-1"><Clock /></el-icon> 修改历史
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="hover" :body-style="{ padding: '0' }">
      <el-table 
        v-loading="loading" 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%"
      >
        <el-table-column label="彩种" width="150" align="center">
          <template #default>
            <span class="font-medium text-gray-700">{{ currentLotteryInfo?.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="expect" label="期号" width="150" align="center" />
        
        <el-table-column label="开奖号码" min-width="450">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2 items-center py-2 px-2">
              <div 
                v-for="(_, index) in row.codes" 
                :key="index"
                class="relative"
              >
                <el-select 
                  v-model="row.codes[index]" 
                  size="small" 
                  class="!w-20"
                  :placeholder="`第${index + 1}球`"
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="val in getBallConfig(currentLotteryInfo?.typeid || '').range"
                    :key="val"
                    :label="val"
                    :value="val"
                  />
                </el-select>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="opentime" label="开奖时间" width="180" align="center" />
        
        <el-table-column prop="admin" label="管理人" width="120" align="center">
          <template #default="{ row }">
             <el-tag v-if="row.admin" size="small" effect="plain">{{ row.admin }}</el-tag>
             <span v-else class="text-gray-300">-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="danger" 
              size="small" 
              @click="handleSave(row)"
            >
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-select .el-input__wrapper) {
  padding: 0 8px;
}
</style>
