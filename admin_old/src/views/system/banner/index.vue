<template>
  <div class="p-4">
    <div class="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleAdd">
            <i class="ri-add-line mr-1"></i>添加轮播图
          </el-button>
          <el-button type="danger" @click="handleBatchDelete" :disabled="!selection.length">
            <i class="ri-delete-bin-line mr-1"></i>批量删除
          </el-button>
        </div>
        <el-button @click="loadData">
          <i class="ri-refresh-line mr-1"></i>刷新
        </el-button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column label="图片" width="180" align="center">
          <template #default="{ row }">
            <el-image 
              v-if="row.url" 
              :src="row.url" 
              class="h-16 w-auto rounded object-contain bg-gray-50" 
              :preview-src-list="[row.url]"
              preview-teleported
              fit="contain"
            />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题/备注" min-width="150" align="center" />
        <el-table-column prop="type" label="类型" width="120" align="center" sortable>
          <template #default="{ row }">
            <el-tag :type="row.type === 0 ? 'info' : 'success'">
              {{ row.type === 0 ? 'PC端' : 'APP端' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="link" label="跳转链接" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStatusChange(row, val as number)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="listorder" label="排序" width="100" align="center" sortable>
          <template #default="{ row }">
            <el-input-number 
              v-model="row.listorder" 
              :min="0" 
              size="small" 
              controls-position="right"
              class="!w-20"
              @change="() => handleSortChange(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click="handleEdit(row)"
            >修改</el-button>
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加轮播图' : '修改轮播图'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题/备注" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题或备注" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">PC端</el-radio>
            <el-radio :label="1">APP端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入图片URL" />
          <div class="mt-2 h-24 w-full bg-gray-50 rounded flex items-center justify-center border border-dashed border-gray-300" v-if="form.url">
            <img :src="form.url" class="h-full object-contain" />
          </div>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入点击跳转链接（选填）" />
        </el-form-item>
        <el-form-item label="排序" prop="listorder">
          <el-input-number v-model="form.listorder" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { 
  fetchBannerList, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  deleteAllBanner,
  updateBannerOrder,
  updateBannerStatus,
  type Banner 
} from '@/api/system-banner'

const loading = ref(false)
const tableData = ref<Banner[]>([])
const selection = ref<Banner[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

// Dialog
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: 0,
  title: '',
  type: 0,
  url: '',
  link: '',
  listorder: 0
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  url: [{ required: true, message: '请输入图片地址', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchBannerList({
      page: pagination.page,
      limit: pagination.limit
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (val: Banner[]) => {
  selection.value = val
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleSortChange = async (row: Banner) => {
  try {
    await updateBannerOrder([{ id: row.id, listorder: row.listorder || 0 }])
    ElMessage.success('排序更新成功')
  } catch (error) {
    loadData() // Revert on error
  }
}

const handleStatusChange = async (row: Banner, val: number) => {
  try {
    await updateBannerStatus(row.id, val)
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = val === 1 ? 0 : 1 // Revert
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.title = ''
  form.type = 0
  form.url = ''
  form.link = ''
  form.listorder = 0
  dialogVisible.value = true
}

const handleEdit = (row: Banner) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.title = row.title
  form.type = row.type
  form.url = row.url
  form.link = row.link || ''
  form.listorder = row.listorder || 0
  dialogVisible.value = true
}

const handleDelete = (row: Banner) => {
  ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteBanner(row.id)
    loadData()
  })
}

const handleBatchDelete = () => {
  if (!selection.value.length) return
  ElMessageBox.confirm(`确定要删除选中的 ${selection.value.length} 项吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteAllBanner(selection.value.map(item => item.id))
    loadData()
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await createBanner(form)
        } else {
          await updateBanner(form)
        }
        dialogVisible.value = false
        loadData()
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>
