<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/http'

interface Game {
  id: number
  game_id: string
  name: string
  platform: string
  type: string
  icon?: string
  cover?: string
  hot: number
  new: number
  status: string
  sort: number
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const platform = computed(() => route.params.platform as string)
const platformName = ref('')

const tableData = ref<Game[]>([])
const total = ref(0)
const queryParams = reactive({
  page: 1,
  limit: 10,
  platform: '',
  keyword: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增游戏')
const formData = reactive({
  id: 0,
  game_id: '',
  name: '',
  platform: '',
  type: '',
  icon: '',
  cover: '',
  hot: 0,
  new: 0,
  status: 'online',
  sort: 0
})

onMounted(() => {
  queryParams.platform = platform.value
  platformName.value = platform.value + '游戏管理'
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const res = await request.get<any>({
      url: '/app/admin/api/game/game-list',
      params: queryParams,
      returnFullResponse: true
    })
    tableData.value = res.data?.list || res.list || []
    total.value = res.count || res.data?.total || 0
  } catch (e) {
    console.error('加载游戏列表失败:', e)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchData()
}

function handleAdd() {
  dialogTitle.value = '新增游戏'
  Object.assign(formData, {
    id: 0,
    game_id: '',
    name: '',
    platform: platform.value,
    type: '',
    icon: '',
    cover: '',
    hot: 0,
    new: 0,
    status: 'online',
    sort: 0
  })
  dialogVisible.value = true
}

function handleEdit(row: Game) {
  dialogTitle.value = '编辑游戏'
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.game_id || !formData.name) {
    return ElMessage.warning('请填写游戏ID和名称')
  }
  try {
    await request.post({
      url: '/app/admin/api/game/game-save',
      data: formData
    })
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchData()
  } catch (e) {
    console.error(e)
  }
}

async function handleStatusChange(row: Game, status: string) {
  try {
    await request.post({
      url: '/app/admin/api/game/game-status',
      data: { id: row.id, status }
    })
    ElMessage.success('操作成功')
    row.status = status
  } catch (e) {
    row.status = status === 'online' ? 'offline' : 'online'
  }
}

async function handleHotChange(row: Game, hot: number) {
  try {
    await request.post({
      url: '/app/admin/api/game/game-hot',
      data: { id: row.id, hot }
    })
    row.hot = hot
  } catch (e) {
    row.hot = hot === 1 ? 0 : 1
  }
}

function handleDelete(row: Game) {
  ElMessageBox.confirm(`确定删除游戏【${row.name}】？`, '提示', { type: 'warning' }).then(async () => {
    await request.post({ url: '/app/admin/api/game/game-delete', data: { id: row.id } })
    ElMessage.success('删除成功')
    fetchData()
  })
}

function handleSizeChange(val: number) {
  queryParams.limit = val
  fetchData()
}

function handleCurrentChange(val: number) {
  queryParams.page = val
  fetchData()
}

function goBack() {
  router.push('/lottery/game-list')
}
</script>

<template>
  <div class="app-container">
    
    <el-card class="mb-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <el-button @click="goBack">
            <span class="i-ri:arrow-left-line mr-1"></span> 返回
          </el-button>
          <span class="text-lg font-bold">{{ platformName }}</span>
        </div>
        <el-button type="primary" @click="handleAdd">
          <span class="i-ri:add-line mr-1"></span> 批量新增
        </el-button>
      </div>
    </el-card>

    
    <el-card class="mb-4">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="游戏名称">
          <el-input v-model="queryParams.keyword" placeholder="游戏代码/名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="queryParams.keyword = ''; handleSearch()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card>
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="game_id" label="游戏代码" width="150" align="center" />
        <el-table-column prop="name" label="游戏名称" min-width="150" align="center" />
        <el-table-column label="排序" width="100" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.sort" :min="0" size="small" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="是否首推" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.hot ? 'success' : 'info'" size="small">{{ row.hot ? '首推' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.hot === 1" @change="(val) => handleHotChange(row, val ? 1 : 0)" />
          </template>
        </el-table-column>
        <el-table-column label="支持终端类型" width="120" align="center">
          <template #default>
            <el-tag size="small" type="success">移动端和电脑端</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">大厅设置</el-button>
            <el-button type="warning" link @click="handleEdit(row)">游戏设置</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-between items-center mt-4">
        <span class="text-gray-500">共 {{ total }} 条</span>
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="游戏代码" required>
          <el-input v-model="formData.game_id" placeholder="游戏唯一标识" />
        </el-form-item>
        <el-form-item label="游戏名称" required>
          <el-input v-model="formData.name" placeholder="游戏显示名称" />
        </el-form-item>
        <el-form-item label="游戏类型">
          <el-input v-model="formData.type" placeholder="如: slot, live" />
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="formData.icon" placeholder="游戏图标地址" />
        </el-form-item>
        <el-form-item label="封面URL">
          <el-input v-model="formData.cover" placeholder="游戏封面地址" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" active-value="online" inactive-value="offline" active-text="上线" inactive-text="下线" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
