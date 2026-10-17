<template>
  <div class="p-4">
    <div class="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleAdd">
            <i class="ri-add-line mr-1"></i>新增角色
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
        <el-table-column prop="name" label="角色名称" min-width="150" align="center" />
        <el-table-column prop="desc" label="描述" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" align="center" />
        
        <el-table-column label="操作" width="280" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="warning" 
              plain
              @click="handlePermission(row)"
            >权限</el-button>
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
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入角色描述" />
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

    <!-- Permission Dialog -->
    <el-dialog
      v-model="permDialogVisible"
      title="分配权限"
      width="600px"
      destroy-on-close
    >
      <div class="h-[400px] overflow-y-auto">
        <el-tree
          ref="permTreeRef"
          :data="permTreeData"
          :props="{ label: 'label', children: 'children' }"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePermSubmit" :loading="permSubmitting">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type TreeInstance } from 'element-plus'
import { 
  fetchRoleList, 
  createRole, 
  updateRole, 
  deleteRole, 
  fetchRuleTree,
  saveRoleRules,
  fetchRoleRuleIds,
  type AdminRole 
} from '@/api/system-admin'

const loading = ref(false)
const tableData = ref<AdminRole[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const permSubmitting = ref(false)
const permTreeData = ref<any[]>([])
const defaultCheckedKeys = ref<number[]>([])
const currentRoleId = ref(0)
const permTreeRef = ref<TreeInstance>()

const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: 0,
  name: '',
  desc: '',
  status: 1
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchRoleList({
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

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.name = ''
  form.desc = ''
  form.status = 1
  dialogVisible.value = true
}

const handleEdit = (row: AdminRole) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.name = row.name
  form.desc = row.desc || ''
  form.status = row.status
  dialogVisible.value = true
}

const handlePermission = async (row: AdminRole) => {
  currentRoleId.value = row.id
  permDialogVisible.value = true
  permTreeData.value = []
  defaultCheckedKeys.value = []
  
  try {
    // 1. Fetch Tree (Assuming it might return checked state or we fetch IDs separately)
    // Doc says: GET /rule-tree?role_id=2 returns tree + checked IDs
    // Let's check the response structure. 
    // If res is array of tree nodes, we need to know which are checked.
    // Or we call fetchRoleRuleIds separately as per doc "2. 保存... 1. 编辑..."
    // Wait, doc says: "1. 编辑角色权限时: GET /rule-tree?role_id=2 返回权限树 + 该角色已勾选的权限ID"
    // This implies one call might do both, OR we should call both. 
    // Let's assume fetchRuleTree returns the tree, and fetchRoleRuleIds returns the IDs.
    // Safest bet is to call both if tree doesn't contain checked state.
    
    const [treeRes, idsRes] = await Promise.all([
      fetchRuleTree(row.id),
      fetchRoleRuleIds(row.id)
    ])
    
    console.log('Tree Response:', treeRes)
    
    // Handle response structure
    let treeData: any[] = []
    if (Array.isArray(treeRes)) {
      treeData = treeRes
    } else if (treeRes && Array.isArray(treeRes.data)) {
      treeData = treeRes.data
    } else if (treeRes && Array.isArray(treeRes.list)) {
      treeData = treeRes.list
    } else if (treeRes && Array.isArray(treeRes.tree)) {
      treeData = treeRes.tree
    } else {
        // Fallback: maybe it is the object itself?
        console.warn('Unknown tree format', treeRes)
    }

    // If treeList is flat (has pid but no children), convert to tree
    // Only if no children detected in first item
    if (treeData.length > 0 && !treeData[0].children && (treeData[0].pid !== undefined || treeData[0].parent_id !== undefined)) {
       console.log('Converting flat list to tree...')
       treeData = listToTree(treeData)
    }

    permTreeData.value = treeData
    
    // Process IDs safely
    let finalIds: number[] = []
    
    // Debug log
    console.log('Role Rules IDs:', idsRes)

    // Handle various response formats
    let rawIds: any = idsRes
    // If response wrapped in { data: [...] } and axios interceptor didn't unwrap it fully (or we used returnFullResponse)
    if (rawIds && typeof rawIds === 'object' && 'data' in rawIds && Array.isArray(rawIds.data)) {
      rawIds = rawIds.data
    }
    // If response is { list: [...] }
    if (rawIds && typeof rawIds === 'object' && 'list' in rawIds && Array.isArray(rawIds.list)) {
      rawIds = rawIds.list
    }
    // If response is { rule_ids: [...] } (Backend structure)
    if (rawIds && typeof rawIds === 'object' && 'rule_ids' in rawIds && Array.isArray(rawIds.rule_ids)) {
      rawIds = rawIds.rule_ids
    }

    if (Array.isArray(rawIds)) {
      finalIds = rawIds.map((id: any) => Number(id))
    } else {
      console.warn('Unexpected idsRes format, defaulting to empty:', rawIds)
      finalIds = []
    }
    
    // Override if tree response has checked_keys or checkedIds
    if (treeRes && (treeRes.checked_keys || treeRes.checkedIds)) {
      const keys = treeRes.checked_keys || treeRes.checkedIds
      if (Array.isArray(keys)) {
        finalIds = keys.map((id: any) => Number(id))
      }
    }

    // Filter out parent nodes from checked IDs to avoid auto-checking all children
    // el-tree logic: if a parent ID is in default-checked-keys, all its children get checked.
    // We only want to check leaf nodes explicitly.
    const isLeaf = (id: number, nodes: any[]): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          return !node.children || node.children.length === 0
        }
        if (node.children && node.children.length > 0) {
          if (isLeaf(id, node.children)) return true
        }
      }
      return false
    }

    // Only keep leaf nodes for defaultCheckedKeys
    const leafIds = finalIds.filter(id => isLeaf(id, permTreeData.value))
    defaultCheckedKeys.value = leafIds
    
    // Important: el-tree with default-checked-keys might check parent nodes if all children checked.
    // If backend returns parent ID but not all children are checked, el-tree might show indeterminate correctly 
    // ONLY if we don't set the parent ID in default-checked-keys.
    // Usually we should only set leaf nodes in default-checked-keys for el-tree to auto-check parents.
    // But backend usually returns ALL IDs including parents. 
    // We might need to filter parent IDs if el-tree behaves strictly.
    // For now, pass all, see how it renders.
    
  } catch (error) {
    console.error(error)
    ElMessage.error('获取权限数据失败')
  }
}

const handlePermSubmit = async () => {
  if (!permTreeRef.value) return
  permSubmitting.value = true
  try {
    // Get checked keys + half checked keys (parents)
    const checkedKeys = permTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permTreeRef.value.getHalfCheckedKeys()
    const allKeys = [...checkedKeys, ...halfCheckedKeys]
    
    await saveRoleRules({
      role_id: currentRoleId.value,
      rule_ids: allKeys.map(Number)
    })
    
    ElMessage.success('权限保存成功')
    permDialogVisible.value = false
  } catch (error) {
    console.error(error)
  } finally {
    permSubmitting.value = false
  }
}

const handleDelete = (row: AdminRole) => {
  ElMessageBox.confirm(`确定要删除角色 ${row.name} 吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteRole(row.id)
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
          await createRole(form)
        } else {
          await updateRole(form)
        }
        dialogVisible.value = false
        loadData()
      } finally {
        submitting.value = false
      }
    }
  })
}

// Helper: Flat list to Tree
const listToTree = (list: any[]) => {
  const map: Record<number, any> = {}
  const roots: any[] = []
  
  // Initialize map
  list.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })
  
  list.forEach(item => {
    // Assuming root pid is 0
    if (item.pid === 0) {
      roots.push(map[item.id])
    } else {
      const parent = map[item.pid]
      if (parent) {
        parent.children.push(map[item.id])
      } else {
        // Orphan node, maybe treat as root or ignore
        // roots.push(map[item.id])
      }
    }
  })
  
  return roots
}

onMounted(() => {
  loadData()
})
</script>
