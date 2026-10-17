<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchGetGameCategoryList } from '@/api/lottery'
import { fetchPlatformList, updatePlatformStatus } from '@/api/game-platform'
import request from '@/utils/http'

interface Platform {
  id: number
  code: string
  name: string
  slot_name?: string
  live_name?: string
  chess_name?: string
  fishing_name?: string
  type: string
  status: string
  hot: number
  sort: number
  icon?: string
  banner?: string
  mobile_icon?: string
  mobile_banner?: string
  slot_banner?: string
  live_banner?: string
  chess_banner?: string
  fishing_banner?: string
  gameCount?: number
}

const editDialogVisible = ref(false)
const editForm = ref<Partial<Platform>>({})
const uploadLoading = ref(false)

interface Category {
  id: number
  code: string
  name: string
  status: number
}

const router = useRouter()
const loading = ref(false)
const syncLoading = ref(false)
const activeCategory = ref('')
const filterPlatformCode = ref('')
const categories = ref<Category[]>([])
const platforms = ref<Platform[]>([])

const currentPage = ref(1)
const pageSize = ref(20)

const selectedPlatforms = ref<Platform[]>([])

const searchKeyword = ref('')

const filteredPlatforms = computed(() => {
  return platforms.value
})

const filteredByCode = computed(() => {
  let result = filteredPlatforms.value

  if (filterPlatformCode.value) {
    result = result.filter(p => p.code === filterPlatformCode.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.code.toLowerCase().includes(keyword)
    )
  }

  return result
})

const paginatedTotal = computed(() => filteredByCode.value.length)

const displayPlatforms = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredByCode.value.slice(start, end)
})

const activeCategoryName = computed(() => {
  const cat = categories.value.find(c => c.code === activeCategory.value)
  return cat ? cat.name : ''
})

onMounted(async () => {
  await loadCategories()
  await loadPlatforms()
})

async function loadCategories() {
  try {
    const res = await fetchGetGameCategoryList()
    const list = res?.list || []

    categories.value = list.filter((c: Category) => c.code !== 'hot' && c.status === 1)
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].code
    }
  } catch (e) {
    console.error('加载分类失败:', e)
  }
}

async function loadPlatforms() {
  loading.value = true
  try {

    const params: any = { page: 1, limit: 100 }
    if (activeCategory.value) {
      params.type = activeCategory.value
    }
    const res = await fetchPlatformList(params)
    platforms.value = res.list || []
    console.log('平台列表:', platforms.value.map(p => ({ code: p.code, type: p.type })))
  } catch (e) {
    console.error('加载平台失败:', e)
  } finally {
    loading.value = false
  }
}

function handleCategoryChange(code: string) {
  activeCategory.value = code
  filterPlatformCode.value = ''
  currentPage.value = 1
  loadPlatforms()
}

function handleSearch() {
  currentPage.value = 1
  ElMessage.success(`筛选完成，共 ${paginatedTotal.value} 个平台`)
}

function handleReset() {
  if (categories.value.length > 0) {
    activeCategory.value = categories.value[0].code
  }
  filterPlatformCode.value = ''
  searchKeyword.value = ''
  currentPage.value = 1
  loadPlatforms()
}

function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

function handlePageChange(val: number) {
  currentPage.value = val
}

async function handleStatusChange(row: Platform, status: string) {
  try {
    await updatePlatformStatus(row.id, status)
    ElMessage.success('操作成功')
    row.status = status
  } catch (e) {
    console.error(e)
  }
}

function goToGameManage(platform: Platform) {
  router.push(`/lottery/game-list/${platform.code}`)
}

async function handleSyncNGGames() {

  const platform = filterPlatformCode.value || (filteredPlatforms.value.length > 0 ? filteredPlatforms.value[0].code : '')

  if (!platform) {
    return ElMessage.warning('请先选择一个平台')
  }

  ElMessageBox.confirm(
    `确定从NG接口同步【${platform}】平台的游戏数据？`,
    '同步确认',
    { type: 'warning' }
  ).then(async () => {
    syncLoading.value = true
    try {
      const res = await request.post<any>({
        url: '/app/admin/api/game/sync-ng-games',
        data: { platType: platform.toLowerCase() }
      })

      if (res?.count) {
        ElMessage.success(`同步成功，共 ${res.count} 个游戏`)
      } else {
        ElMessage.success('同步完成')
      }
    } catch (e: any) {
      ElMessage.error(e.message || '同步失败')
    } finally {
      syncLoading.value = false
    }
  })
}

function getStatusType(status: string) {
  return status === 'online' ? 'success' : status === 'maintain' ? 'warning' : 'danger'
}

function getStatusText(status: string) {
  return status === 'online' ? '正常' : status === 'maintain' ? '维护' : '下线'
}

function handleEdit(row: Platform) {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

async function handleSave() {
  if (!editForm.value.id) return

  try {
    await request.post({
      url: '/app/admin/api/game/update-platform',
      data: {
        id: editForm.value.id,
        name: editForm.value.name,
        slot_name: editForm.value.slot_name,
        live_name: editForm.value.live_name,
        chess_name: editForm.value.chess_name,
        fishing_name: editForm.value.fishing_name,
        icon: editForm.value.icon,
        banner: editForm.value.banner,
        mobile_icon: editForm.value.mobile_icon,
        mobile_banner: editForm.value.mobile_banner,
        slot_banner: editForm.value.slot_banner,
        live_banner: editForm.value.live_banner,
        chess_banner: editForm.value.chess_banner,
        fishing_banner: editForm.value.fishing_banner,
        sort: editForm.value.sort,
        hot: editForm.value.hot
      }
    })
    ElMessage.success('保存成功')
    editDialogVisible.value = false

    const index = platforms.value.findIndex(p => p.id === editForm.value.id)
    if (index !== -1) {
      platforms.value[index] = { ...platforms.value[index], ...editForm.value }
    }
  } catch (e: any) {
    ElMessage.error(e.message || '保存失败')
  }
}

function handleSelectionChange(selection: Platform[]) {
  selectedPlatforms.value = selection
}

async function handleBatchDelete() {
  if (selectedPlatforms.value.length === 0) {
    return ElMessage.warning('请先选择要删除的平台')
  }

  ElMessageBox.confirm(
    `确定删除选中的 ${selectedPlatforms.value.length} 个平台？该操作会同时删除这些平台下的所有游戏！`,
    '批量删除确认',
    { type: 'warning' }
  ).then(async () => {
    try {
      const ids = selectedPlatforms.value.map(p => p.id)
      for (const id of ids) {
        await request.post({
          url: '/app/admin/api/game/delete-platform',
          data: { id }
        })
      }
      ElMessage.success(`成功删除 ${ids.length} 个平台`)

      platforms.value = platforms.value.filter(p => !ids.includes(p.id))
      selectedPlatforms.value = []
    } catch (e: any) {
      ElMessage.error(e.message || '删除失败')
    }
  })
}

async function handleDelete(row: Platform) {
  ElMessageBox.confirm(
    `确定删除平台【${row.name}】？该操作会同时删除该平台下的所有游戏！`,
    '删除确认',
    { type: 'warning' }
  ).then(async () => {
    try {
      await request.post({
        url: '/app/admin/api/game/delete-platform',
        data: { id: row.id }
      })
      ElMessage.success('删除成功')

      platforms.value = platforms.value.filter(p => p.id !== row.id)
    } catch (e: any) {
      ElMessage.error(e.message || '删除失败')
    }
  })
}

async function handleToggleStatus(row: Platform) {
  const newStatus = row.status === 'online' ? 'offline' : 'online'
  const action = newStatus === 'online' ? '开启' : '关闭'

  try {
    await request.post({
      url: '/app/admin/api/game/update-platform',
      data: { id: row.id, status: newStatus }
    })
    row.status = newStatus
    ElMessage.success(`${action}成功`)
  } catch (e: any) {
    ElMessage.error(e.message || `${action}失败`)
  }
}

function handleIconUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.icon = response.data.url
    ElMessage.success('图标上传成功')
  }
}

function handleBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.banner = response.data.url
    ElMessage.success('PC横幅上传成功')
  }
}

function handleMobileIconUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.mobile_icon = response.data.url
    ElMessage.success('H5图标上传成功')
  }
}

function handleMobileBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.mobile_banner = response.data.url
    ElMessage.success('H5横幅上传成功')
  }
}

function handleSlotBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.slot_banner = response.data.url
    ElMessage.success('电子横幅上传成功')
  }
}

function handleLiveBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.live_banner = response.data.url
    ElMessage.success('真人横幅上传成功')
  }
}

function handleChessBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.chess_banner = response.data.url
    ElMessage.success('棋牌横幅上传成功')
  }
}

function handleFishingBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.fishing_banner = response.data.url
    ElMessage.success('捕鱼横幅上传成功')
  }
}

function handleUploadError() {
  ElMessage.error('上传失败')
}
</script>

<template>
  <div class="app-container">
    
    <el-card class="mb-4">
      <el-form :inline="true">
        <el-form-item label="游戏分类">
          <el-select v-model="activeCategory" placeholder="请选择分类" style="width: 150px" @change="handleCategoryChange">
            <el-option
              v-for="cat in categories"
              :key="cat.code"
              :label="cat.name"
              :value="cat.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台类型">
          <el-select v-model="filterPlatformCode" placeholder="全部平台" clearable style="width: 150px">
            <el-option
              v-for="p in filteredPlatforms"
              :key="p.code"
              :label="p.name"
              :value="p.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input 
            v-model="searchKeyword" 
            placeholder="平台名称/代码" 
            clearable 
            style="width: 180px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span class="i-ri:search-line mr-1"></span> 查询
          </el-button>
          <el-button @click="handleReset">
            <span class="i-ri:refresh-line mr-1"></span> 重置
          </el-button>
          <el-button type="warning" :loading="syncLoading" @click="handleSyncNGGames">
            <span class="i-ri:download-cloud-line mr-1"></span> 同步NG游戏
          </el-button>
          <el-button type="success">
            <span class="i-ri:add-line mr-1"></span> 投放游戏
          </el-button>
          <el-button type="danger" :disabled="selectedPlatforms.length === 0" @click="handleBatchDelete">
            <span class="i-ri:delete-bin-line mr-1"></span> 批量删除 ({{ selectedPlatforms.length }})
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card>
      <el-table v-loading="loading" :data="displayPlatforms" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="type" label="游戏类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="平台类型" width="120" align="center" />
        <el-table-column prop="name" label="显示名称" min-width="150" align="center" />
        <el-table-column label="维护状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'maintain'"
              @change="(val) => handleStatusChange(row, val ? 'maintain' : 'online')"
            />
          </template>
        </el-table-column>
        <el-table-column label="平台状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'online'"
              @change="handleToggleStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否首页" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.hot === 1" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.sort" :min="0" size="small" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="PC端横幅" width="120" align="center">
          <template #default="{ row }">
            <el-image v-if="row.banner" :src="row.banner" style="width: 80px; height: 40px" fit="cover" :preview-src-list="[row.banner]" preview-teleported />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="H5/App横幅" width="120" align="center">
          <template #default="{ row }">
            <el-image v-if="row.mobile_banner" :src="row.mobile_banner" style="width: 80px; height: 40px" fit="cover" :preview-src-list="[row.mobile_banner]" preview-teleported />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="warning" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="goToGameManage(row)">游戏管理</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      
      <div class="flex justify-between items-center mt-4">
        <span class="text-gray-500">共 {{ paginatedTotal }} 条</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="paginatedTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    
    <el-dialog v-model="editDialogVisible" title="编辑平台" width="600px">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="平台代码">
          <el-input v-model="editForm.code" disabled />
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input v-model="editForm.name" placeholder="请输入显示名称（通用）" />
        </el-form-item>
        <el-divider content-position="left">分类专用名称（综合平台可为不同分类设置不同名称）</el-divider>
        <el-form-item label="电子名称">
          <el-input v-model="editForm.slot_name" placeholder="电子分类显示的名称（留空则用通用名称）" />
        </el-form-item>
        <el-form-item label="真人名称">
          <el-input v-model="editForm.live_name" placeholder="真人分类显示的名称（留空则用通用名称）" />
        </el-form-item>
        <el-form-item label="棋牌名称">
          <el-input v-model="editForm.chess_name" placeholder="棋牌分类显示的名称（留空则用通用名称）" />
        </el-form-item>
        <el-form-item label="捕鱼名称">
          <el-input v-model="editForm.fishing_name" placeholder="捕鱼分类显示的名称（留空则用通用名称）" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editForm.sort" :min="0" />
        </el-form-item>
        <el-form-item label="首页推荐">
          <el-switch v-model="editForm.hot" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-divider content-position="left">PC端图片</el-divider>
        <el-form-item label="PC端图标">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.icon" :src="editForm.icon" style="width: 80px; height: 80px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleIconUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.icon" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="PC端横幅">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.banner" :src="editForm.banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.banner" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
        <el-divider content-position="left">H5/App端图片</el-divider>
        <el-form-item label="H5端图标">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.mobile_icon" :src="editForm.mobile_icon" style="width: 80px; height: 80px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleMobileIconUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.mobile_icon" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="H5端横幅">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.mobile_banner" :src="editForm.mobile_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleMobileBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.mobile_banner" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
        <el-divider content-position="left">分类专用横幅（综合平台可为不同分类设置不同横幅）</el-divider>
        <el-form-item label="电子横幅">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.slot_banner" :src="editForm.slot_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleSlotBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.slot_banner" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="真人横幅">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.live_banner" :src="editForm.live_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleLiveBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.live_banner" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="棋牌横幅">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.chess_banner" :src="editForm.chess_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleChessBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.chess_banner" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="捕鱼横幅">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.fishing_banner" :src="editForm.fishing_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleFishingBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-input v-model="editForm.fishing_banner" placeholder="或输入图片URL" style="width: 200px" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-tag {
  margin: 2px;
}
</style>
