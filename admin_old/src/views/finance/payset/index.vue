<template>
  <div class="p-4">
    <div class="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleAdd">
            <i class="ri-add-line mr-1"></i>添加存款方式
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
      >
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="paytype" label="标识" min-width="120" align="center" sortable />
        <el-table-column prop="paytypetitle" label="支付名称" min-width="150" align="center" sortable />
        <el-table-column prop="ftitle" label="副名称" min-width="150" align="center" />
        
        <el-table-column label="线上支付" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isonline === 1" type="danger">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.state"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStateChange(row, val as number)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right" align="center">
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
      :title="dialogType === 'add' ? '添加存款方式' : '修改存款方式'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标识" prop="paytype">
          <el-input v-model="form.paytype" placeholder="请输入支付标识" />
        </el-form-item>
        <el-form-item label="支付名称" prop="paytypetitle">
          <el-input v-model="form.paytypetitle" placeholder="请输入支付名称" />
        </el-form-item>
        <el-form-item label="副名称" prop="ftitle">
          <el-input v-model="form.ftitle" placeholder="请输入副名称" />
        </el-form-item>
        <el-form-item label="线上支付" prop="isonline">
          <el-radio-group v-model="form.isonline">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { 
  fetchPaySetList, 
  createPaySet, 
  updatePaySet, 
  deletePaySet, 
  setPaySetState,
  type PaySet 
} from '@/api/finance-payset'

const loading = ref(false)
const tableData = ref<PaySet[]>([])
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
  paytype: '',
  paytypetitle: '',
  ftitle: '',
  isonline: 0,
  state: 1
})

const rules = {
  paytype: [{ required: true, message: '请输入支付标识', trigger: 'blur' }],
  paytypetitle: [{ required: true, message: '请输入支付名称', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchPaySetList({
      page: pagination.page,
      limit: pagination.limit
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleStateChange = async (row: PaySet, val: number) => {
  try {
    await setPaySetState(row.id, val)
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.state = val === 1 ? 0 : 1 // Revert on error
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.paytype = ''
  form.paytypetitle = ''
  form.ftitle = ''
  form.isonline = 0
  form.state = 1
  dialogVisible.value = true
}

const handleEdit = (row: PaySet) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.paytype = row.paytype
  form.paytypetitle = row.paytypetitle
  form.ftitle = row.ftitle || ''
  form.isonline = row.isonline
  form.state = row.state
  dialogVisible.value = true
}

const handleDelete = (row: PaySet) => {
  ElMessageBox.confirm(`确定要删除 ${row.paytypetitle} 吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deletePaySet(row.id)
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
          await createPaySet(form)
        } else {
          await updatePaySet(form)
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
