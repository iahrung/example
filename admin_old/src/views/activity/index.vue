<template>
  <div class="p-4">
    <div class="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <el-form :inline="true" :model="searchForm" class="flex-1">
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" placeholder="活动标题" clearable />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 150px">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <i class="ri-search-line mr-1"></i>搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        
        <el-button type="primary" @click="handleAdd">
          <i class="ri-add-line mr-1"></i>添加活动
        </el-button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-sm">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column label="封面图" width="120" align="center">
          <template #default="{ row }">
            <el-image 
              v-if="row.banner" 
              :src="row.banner" 
              class="h-12 w-20 object-cover rounded bg-gray-50" 
              :preview-src-list="[row.banner]"
              preview-teleported
            />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type_text" label="类型" width="120" align="center">
          <template #default="{ row }">
            {{ getTypeName(row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="200" align="center">
          <template #default="{ row }">
            <div class="text-xs">
              <div>{{ row.start_date }}</div>
              <div class="text-gray-400">至</div>
              <div>{{ row.end_date }}</div>
            </div>
          </template>
        </el-table-column>
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
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click="handleEdit(row)"
            >编辑</el-button>
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
      :title="dialogType === 'add' ? '添加活动' : '编辑活动'"
      width="800px"
      destroy-on-close
      top="5vh"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" />
        </el-form-item>
        
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="活动类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型" class="w-full">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="0" controls-position="right" class="w-full" />
          </el-form-item>
        </div>

        <el-form-item label="活动时间" required>
          <div class="flex items-center gap-2 w-full">
            <el-date-picker
              v-model="form.start_date"
              type="datetime"
              placeholder="开始时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="!flex-1"
            />
            <span class="text-gray-400">-</span>
            <el-date-picker
              v-model="form.end_date"
              type="datetime"
              placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="!flex-1"
            />
          </div>
        </el-form-item>

        <el-form-item label="封面图" prop="banner">
          <div class="flex gap-2 w-full">
            <el-input v-model="form.banner" placeholder="请输入封面图URL" />
            <el-button type="primary" @click="triggerUpload">上传</el-button>
          </div>
          <div v-if="form.banner" class="mt-2 h-32 w-full bg-gray-50 rounded flex items-center justify-center border border-dashed border-gray-300 overflow-hidden">
            <img :src="form.banner" class="h-full object-contain" />
          </div>
        </el-form-item>

        <!-- Hidden File Input -->
        <input type="file" ref="fileInputRef" style="display: none" accept="image/*" @change="handleFileChange" />

        <el-form-item label="简介" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入活动简介" />
        </el-form-item>

        <el-form-item label="活动内容" prop="content">
          <div style="border: 1px solid #ccc; width: 100%;">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
            />
            <Editor
              style="height: 400px; overflow-y: hidden;"
              v-model="form.content"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { 
  fetchActivityList, 
  createActivity, 
  updateActivity, 
  deleteActivity, 
  updateActivityStatus,
  fetchActivityTypeOptions,
  type Activity,
  type ActivityTypeOption
} from '@/api/activity'

import { useUserStore } from '@/store/modules/user'
import { uploadImage } from '@/api/common'

const userStore = useUserStore()
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = { 
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/app/admin/upload/image',
      fieldName: 'file',
      headers: {
        Authorization: 'Bearer ' + userStore.accessToken
      },
      customInsert(res: any, insertFn: any) {
        if (res.code === 0 || res.code === 200) {
          const url = res.data?.url || res.url || res.data
          insertFn(url)
        } else {
          ElMessage.error(res.msg || '上传失败')
        }
      }
    }
  }
}

const fileInputRef = ref<HTMLInputElement>()
const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  
  try {
    const res = await uploadImage(files[0])
    const url = res.url || (res as any).data?.url
    form.banner = url
    ElMessage.success('上传成功')
  } catch (error) {
    console.error(error)
  } finally {
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const loading = ref(false)
const tableData = ref<Activity[]>([])
const typeOptions = ref<ActivityTypeOption[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchForm = reactive({
  title: '',
  type: '',
  status: undefined as number | undefined
})

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: 0,
  title: '',
  type: '',
  desc: '',
  content: '',
  banner: '',
  start_date: '',
  end_date: '',
  sort: 0,
  status: 1
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  banner: [{ required: true, message: '请输入封面图', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchActivityList({
      page: pagination.page,
      limit: pagination.limit,
      title: searchForm.title,
      type: searchForm.type,
      status: searchForm.status
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const loadTypes = async () => {
  try {
    const res = await fetchActivityTypeOptions()
    if (Array.isArray(res)) {
      typeOptions.value = res
    } else {
      // Fallback if not implemented yet or returns object
      typeOptions.value = [
        { value: 'deposit', label: '充值活动' },
        { value: 'rebate', label: '返水活动' },
        { value: 'bonus', label: '彩金活动' },
        { value: 'vip', label: 'VIP活动' },
        { value: 'other', label: '其他活动' }
      ]
    }
  } catch (error) {
    // Use default options on error
    typeOptions.value = [
        { value: 'deposit', label: '充值活动' },
        { value: 'rebate', label: '返水活动' },
        { value: 'bonus', label: '彩金活动' },
        { value: 'vip', label: 'VIP活动' },
        { value: 'other', label: '其他活动' }
    ]
  }
}

const getTypeName = (value: string) => {
  const option = typeOptions.value.find(opt => opt.value === value)
  return option ? option.label : value
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetSearch = () => {
  searchForm.title = ''
  searchForm.type = ''
  searchForm.status = undefined
  handleSearch()
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleStatusChange = async (row: Activity, val: number) => {
  try {
    await updateActivityStatus(row.id, val)
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = val === 1 ? 0 : 1 // Revert
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.title = ''
  form.type = ''
  form.desc = ''
  form.content = ''
  form.banner = ''
  form.start_date = ''
  form.end_date = ''
  form.sort = 0
  form.status = 1
  dialogVisible.value = true
}

const handleEdit = (row: Activity) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.title = row.title
  form.type = row.type
  form.desc = row.desc
  form.content = row.content
  form.banner = row.banner
  form.start_date = row.start_date
  form.end_date = row.end_date
  form.sort = row.sort
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row: Activity) => {
  ElMessageBox.confirm(`确定要删除活动 "${row.title}" 吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteActivity(row.id)
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
          await createActivity(form)
        } else {
          await updateActivity(form)
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
  loadTypes() // Fetch types first
  loadData()
})
</script>
