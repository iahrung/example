<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Check } from '@element-plus/icons-vue'
import { fetchOddsData, fetchSaveOdds } from '@/api/odds'

defineOptions({
  name: 'OddsManage'
})

const activeTab = ref('k3')
const loading = ref(false)
const saving = ref(false)
const searchKeyword = ref('')

// Data from API
const rawRebates = ref<string[]>([])
const rawPlays = ref<any[]>([])
const rawOddsMap = ref<any>({})

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

// Grouped Data Structure
interface PlayGroup {
  name: string
  plays: any[]
  displayTitle: string
}

const playGroups = ref<PlayGroup[]>([])

// Load Data
const loadData = async () => {
  loading.value = true
  try {
    const res: any = await fetchOddsData({ typeid: activeTab.value })
    // The http utility unwraps the response, so res IS the data object
    if (res && (res.plays || res.rebates)) {
        rawRebates.value = res.rebates || []
        rawPlays.value = res.plays || []
        rawOddsMap.value = res.oddsMap || {}
        processGroups()
    } else {
         // If res is null/undefined or empty, it might be a failure or empty state
         // But usually interceptor throws error on failure.
         // If we are here, it might just be empty data.
         rawRebates.value = []
         rawPlays.value = []
         rawOddsMap.value = {}
         processGroups()
    }
  } catch (error) {
    console.error(error)
    // Error is handled by interceptor (ElMessage), but we catch it here to stop loading state
  } finally {
    loading.value = false
  }
}

// Process Groups Logic (Ported from 1.md)
const processGroups = () => {
    const groups: Record<string, any[]> = {}
    const groupOrder: string[] = []
    const suffixes = ['豹子', '顺子', '对子', '大', '小', '单', '双', '和']

    rawPlays.value.forEach(play => {
        const title = play.title || ''
        let groupName = title
        let foundSuffix = false

        // Check numeric ending
        const lastChar = title.charAt(title.length - 1)
        if (lastChar >= '0' && lastChar <= '9') {
            const baseTitle = title.substring(0, title.length - 1)
            if (baseTitle.length >= 2) {
                groupName = baseTitle
                foundSuffix = true
            }
        }

        // Check text suffixes
        if (!foundSuffix) {
            for (const suffix of suffixes) {
                if (title.endsWith(suffix)) {
                    const baseTitle = title.substring(0, title.length - suffix.length)
                    if (baseTitle.length >= 2) {
                        groupName = baseTitle
                        foundSuffix = true
                        break
                    }
                }
            }
        }

        if (!groups[groupName]) {
            groups[groupName] = []
            groupOrder.push(groupName)
        }
        groups[groupName].push(play)
    })

    // De-duplication Logic
    const finalGroups: Record<string, any[]> = {}
    const finalOrder: string[] = []

    groupOrder.forEach(groupName => {
        const plays = groups[groupName]
        let foundSimilar = false

        for (const existingName in finalGroups) {
            if (existingName.includes(groupName) || groupName.includes(existingName)) {
                if (plays.length > finalGroups[existingName].length) {
                    // Replace existing with better one
                    delete finalGroups[existingName]
                    const idx = finalOrder.indexOf(existingName)
                    if (idx !== -1) finalOrder.splice(idx, 1)
                    finalGroups[groupName] = plays
                    finalOrder.push(groupName)
                }
                foundSimilar = true
                break
            }
        }

        if (!foundSimilar) {
            finalGroups[groupName] = plays
            finalOrder.push(groupName)
        }
    })

    // Build Result
    const result: PlayGroup[] = []
    finalOrder.forEach(groupName => {
        const groupPlays = finalGroups[groupName]
        
        // Sort plays within group
        groupPlays.sort((a, b) => {
            const aTitle = a.title.replace(groupName, '')
            const bTitle = b.title.replace(groupName, '')
            const aNum = parseInt(aTitle)
            const bNum = parseInt(bTitle)

            if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
            if (!isNaN(aNum)) return -1
            if (!isNaN(bNum)) return 1
            return aTitle.localeCompare(bTitle)
        })

        const displayTitle = groupPlays.length === 1 ? groupPlays[0].title : `${groupName}/大小`
        
        result.push({
            name: groupName,
            plays: groupPlays,
            displayTitle: displayTitle
        })
    })

    playGroups.value = result
}

// Computed filtered groups
const filteredGroups = computed(() => {
    if (!searchKeyword.value) return playGroups.value
    const keyword = searchKeyword.value.toLowerCase()
    return playGroups.value.filter(g => {
        // Check if any play title matches
        return g.plays.some(p => p.title.toLowerCase().includes(keyword))
    })
})

// Handle Tab Change
const handleTabChange = (val: any) => {
    activeTab.value = val.paneName
    localStorage.setItem('odds_selected_typeid', activeTab.value)
    loadData()
}

// Save Single Row
const handleSaveRow = async (play: any) => {
    const playOdds = rawOddsMap.value[play.playid]
    if (!playOdds) return

    const rowData: any = {
        typeid: activeTab.value,
        odds: {
            [play.playid]: playOdds
        }
    }

    try {
        await fetchSaveOdds(rowData)
        ElMessage.success('保存成功')
    } catch (error) {
        console.error(error)
    }
}

// Save All
const handleSaveAll = async () => {
    const formData: any = {
        typeid: activeTab.value,
        odds: rawOddsMap.value
    }
    
    // Validation check (optional, but good practice to ensure we have data)
    if (Object.keys(formData.odds).length === 0) {
        ElMessage.warning('没有可保存的数据')
        return
    }

    saving.value = true
    try {
        await fetchSaveOdds(formData)
        ElMessage.success('全部保存成功')
    } catch (error) {
        console.error(error)
    } finally {
        saving.value = false
    }
}

const handleReset = () => {
    searchKeyword.value = ''
}

onMounted(() => {
    const savedType = localStorage.getItem('odds_selected_typeid')
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
          
          <!-- Toolbar -->
          <div class="flex gap-2 mb-4 items-center">
            <el-input 
                v-model="searchKeyword" 
                placeholder="搜索玩法名称" 
                class="!w-64" 
                clearable
                :prefix-icon="Search"
            />
            <el-button type="primary" :icon="Search">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            <el-button type="primary" :loading="saving" :icon="Check" class="!bg-blue-500" @click="handleSaveAll">全部保存</el-button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="py-8 text-center text-gray-400">
             加载中...
          </div>

          <!-- Empty -->
          <div v-else-if="filteredGroups.length === 0" class="py-8 text-center text-gray-400">
             暂无数据
          </div>

          <!-- Groups -->
          <div v-else class="space-y-4">
             <el-card v-for="group in filteredGroups" :key="group.name" shadow="hover" :body-style="{ padding: '0' }">
                <template #header>
                    <div class="font-bold">{{ group.displayTitle }}</div>
                </template>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-center">玩法 返点</th>
                                <th v-for="rebate in rawRebates" :key="rebate" class="px-4 py-3 text-center">
                                    {{ rebate }}
                                </th>
                                <th class="px-4 py-3 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="play in group.plays" :key="play.playid" class="border-b hover:bg-gray-50">
                                <td class="px-4 py-2 text-center font-medium">
                                    {{ play.title.replace(group.name, '') || play.title }}
                                </td>
                                <td v-for="rebate in rawRebates" :key="rebate" class="px-4 py-2 text-center">
                                    <el-input 
                                        v-if="rawOddsMap[play.playid]"
                                        v-model="rawOddsMap[play.playid][rebate]" 
                                        size="small" 
                                        class="!w-24 text-center"
                                    />
                                </td>
                                <td class="px-4 py-2 text-center">
                                    <el-button size="small" @click="handleSaveRow(play)">保存</el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
             </el-card>
          </div>

        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
/* Utility classes for table styling similar to Element/Layui */
table {
    border-collapse: collapse;
}
th, td {
    white-space: nowrap;
}
</style>
