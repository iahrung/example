<!-- 余额宝持仓记录 -->
<template>
  <div class="yeb-holding-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      <!-- 统计信息 -->
      <div v-if="stats" class="mb-4 p-4 bg-gray-50 rounded flex gap-8 text-sm">
        <div>
          <span class="text-gray-500">用户总数：</span>
          <span class="font-bold text-lg">{{ stats.user_count || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500">正在运行金额：</span>
          <span class="font-bold text-lg">{{ stats.running_amount || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500">累计收益：</span>
          <span class="font-bold text-lg">{{ stats.total_interest || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500">产品数量：</span>
          <span class="font-bold text-lg">{{ stats.product_count || 0 }}</span>
        </div>
      </div>

      <!-- 表格头部 -->
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        @refresh="refreshData"
        @search="handleSearch"
      >
        <template #left>
          <ElButton type="primary" @click="openOperationDialog('deposit')">
            <template #icon>
              <i class="ri-add-line"></i>
            </template>
            人工存入
          </ElButton>
          <ElButton type="warning" @click="openOperationDialog('withdraw')">
            <template #icon>
              <i class="ri-subtract-line"></i>
            </template>
            人工取出
          </ElButton>
        </template>
        <template #search>
          <ElInput
            v-model="searchParams.username"
            placeholder="用户名"
            clearable
            class="w-40"
            @input="handleSearch"
          />
          <ElInput
            v-model="searchParams.order_id"
            placeholder="订单号"
            clearable
            class="w-40"
            @input="handleSearch"
          />
          <ElSelect
            v-model="searchParams.type"
            placeholder="类型"
            clearable
            class="w-32"
            @change="handleSearch"
          >
            <ElOption label="随存随取" value="current" />
            <ElOption label="定期" value="fixed" />
          </ElSelect>
          <ElSelect
            v-model="searchParams.status"
            placeholder="状态"
            clearable
            class="w-32"
            @change="handleSearch"
          >
            <ElOption label="收息中" value="running" />
            <ElOption label="已结算" value="settled" />
            <ElOption label="已取消" value="cancelled" />
          </ElSelect>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>

    <!-- 人工操作弹窗 -->
    <AdminOperationDialog
      v-model:visible="operationDialogVisible"
      :type="operationType"
      @submit="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTag, ElButton, ElInput, ElSelect, ElOption } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchHoldingList,
  fetchOverview,
  settleHolding,
  deleteHolding,
  type YebHolding,
  type YebHoldingSearchParams
} from '@/api/yebao'
import AdminOperationDialog from './modules/AdminOperationDialog.vue'

defineOptions({ name: 'YebHolding' })

const searchParams = reactive<YebHoldingSearchParams>({
  username: '',
  order_id: '',
  type: undefined,
  status: undefined
})

const stats = ref<any>({})

const fetchStats = async () => {
  try {
    // 使用 fetchOverview 替代 fetchHoldingStats
    stats.value = await fetchOverview()
  } catch (error) {
    console.error(error)
  }
}

const {
  columns,
  columnChecks,
  data,
  loading,
  pagination,
  handleSizeChange,
  handleCurrentChange,
  refreshData
} = useTable({
  core: {
    apiFn: fetchHoldingList,
    apiParams: searchParams,
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      { prop: 'username', label: '用户名', width: 120, align: 'center' },
      { prop: 'order_id', label: '订单号', width: 180, align: 'center' },
      { prop: 'product_name', label: '产品名称', minWidth: 150, align: 'center' },
      { prop: 'amount', label: '存入金额', width: 120, align: 'center' },
      {
        prop: 'type',
        label: '类型',
        width: 100,
        align: 'center',
        formatter: (row: YebHolding) => {
          return h(
            ElTag,
            { type: row.type === 'current' ? 'success' : 'warning' },
            () => (row.type === 'current' ? '随存随取' : '定期')
          )
        }
      },
      {
        prop: 'status_text',
        label: '状态',
        width: 100,
        align: 'center',
        formatter: (row: any) => {
          // 后端直接返回了 status_text，如 "收息中"
          const val = row.status_text || row.status
          // 根据原始 status 或 status_text 决定颜色
          const status = row.status || ''
          let type = 'info'
          if (status === 'running' || val === '收息中') type = 'primary'
          else if (status === 'settled' || val === '已结算') type = 'success'
          else if (status === 'cancelled' || val === '已取消') type = 'info'
          
          return h(ElTag, { type: type as any }, () => val)
        }
      },
      { prop: 'createtime_text', label: '存入时间', width: 180, align: 'center' },
      {
        prop: 'operation',
        label: '操作',
        width: 180,
        fixed: 'right',
        align: 'center',
        formatter: (row: YebHolding) =>
          h('div', [
            row.status === 'running' &&
              h(
                ElButton,
                {
                  type: 'warning',
                  size: 'small',
                  link: true,
                  onClick: () => handleSettle(row)
                },
                () => '强制结算'
              ),
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => handleDelete(row)
            })
          ])
      }
    ]
  }
})

const handleSearch = () => {
  refreshData()
  // Overview is global, no need to refetch on search
  // fetchStats()
}

const operationDialogVisible = ref(false)
const operationType = ref<'deposit' | 'withdraw'>('deposit')

const openOperationDialog = (type: 'deposit' | 'withdraw') => {
  operationType.value = type
  operationDialogVisible.value = true
}

const handleSettle = (row: YebHolding) => {
  ElMessageBox.confirm('确认强制结算该持仓吗？结算后将停止计算收益并退回本金。', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await settleHolding(row.id)
      ElMessage.success('结算成功')
      handleSearch()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleDelete = (row: YebHolding) => {
  ElMessageBox.confirm('确认删除该记录吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await deleteHolding(row.id)
      ElMessage.success('删除成功')
      handleSearch()
    } catch (error) {
      console.error(error)
    }
  })
}

onMounted(() => {
  fetchStats()
})
</script>
