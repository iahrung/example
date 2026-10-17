<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchQuickOddsData, fetchSaveQuickOdds } from '@/api/odds'

defineOptions({
  name: 'QuickOdds'
})

const activeTab = ref('k3')
const loading = ref(false)
const tableData = ref<any[]>([])

// Tabs
const tabs = [
  { label: '快三', value: 'k3' },
  { label: '时时彩', value: 'ssc' },
  { label: 'PK10', value: 'pk10' },
  { label: '快乐彩', value: 'keno' },
  { label: '低频彩', value: 'dpc' },
  { label: '六合彩', value: 'lhc' },
  { label: '幸运28', value: 'xy28' }
]

// Load Data
const loadData = async () => {
  loading.value = true
  try {
    const res: any = await fetchQuickOddsData({ typeid: activeTab.value })
    if (res && res.plays) {
        tableData.value = res.plays
    } else if (res && Array.isArray(res.data)) { // Handle wrapper if standard wrapper
        tableData.value = res.data.plays || []
    } else if (res && res.data && res.data.plays) {
        tableData.value = res.data.plays
    } else {
        tableData.value = []
    }
  } catch (error) {
    console.error(error)
    // Error handled by interceptor usually
  } finally {
    loading.value = false
  }
}

// Handle Tab Change
const handleTabChange = (val: any) => {
    activeTab.value = val.paneName
    localStorage.setItem('odds_quick_selected_typeid', activeTab.value)
    loadData()
}

// Save Single Row
const handleSaveRow = async (row: any) => {
    if (!row.playid) return

    const rowData = {
        typeid: activeTab.value,
        playid: row.playid,
        maxprize: row.maxprize,
        minxf: row.minxf
    }

    try {
        await fetchSaveQuickOdds(rowData)
        ElMessage.success('保存成功')
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    const savedType = localStorage.getItem('odds_quick_selected_typeid')
    if (savedType && tabs.some(t => t.value === savedType)) {
        activeTab.value = savedType
    }
    loadData()
})
</script>

<template>
  <div class="p-4">
    <el-card shadow="never">
      <el-tabs v-model="activeTab" type="card" @tab-click="handleTabChange">
        <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value">
          
          <div v-if="loading" class="py-8 text-center text-gray-400">
             加载中...
          </div>

          <el-table v-else :data="tableData" border stripe style="width: 100%">
             <el-table-column prop="title" label="玩法" align="center" min-width="150" />
             
             <el-table-column label="最高奖金" align="center" min-width="150">
                 <template #default="{ row }">
                     <el-input v-model="row.maxprize" class="!w-32 text-center" />
                 </template>
             </el-table-column>
             
             <el-table-column label="最低消费" align="center" min-width="150">
                 <template #default="{ row }">
                     <el-input v-model="row.minxf" class="!w-32 text-center" />
                 </template>
             </el-table-column>
             
             <el-table-column label="操作" align="center" width="120">
                 <template #default="{ row }">
                     <el-button type="primary" size="small" @click="handleSaveRow(row)">保存</el-button>
                 </template>
             </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
