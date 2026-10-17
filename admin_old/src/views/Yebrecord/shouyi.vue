<!-- 余额宝收益记录 -->
<template>
  <div class="yeb-record-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      <!-- 统计信息 -->
      <div v-if="stats" class="mb-4 p-4 bg-gray-50 rounded flex gap-8 text-sm">
        <div>
          <span class="text-gray-500">累计收益：</span>
          <span class="font-bold text-lg text-green-600">+{{ stats.total_interest || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500">今日存入：</span>
          <span class="font-bold text-lg">{{ stats.today_deposit || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500">今日取出：</span>
          <span class="font-bold text-lg">{{ stats.today_withdraw || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500">今日收益：</span>
          <span class="font-bold text-lg text-orange-500">{{ stats.today_interest || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-500">进行中金额：</span>
          <span class="font-bold text-lg">{{ stats.running_amount || 0 }}</span>
        </div>
      </div>

      <!-- 表格头部 -->
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        @refresh="refreshData"
        @search="handleSearch"
      >
        <template #search>
          <ElInput
            v-model="searchParams.username"
            placeholder="用户名"
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
            <ElOption label="存入" value="deposit" />
            <ElOption label="取出" value="withdraw" />
            <ElOption label="收益发放" value="interest" />
            <ElOption label="定期结算" value="settle" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTag, ElInput, ElSelect, ElOption } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchRecordList,
  fetchOverview,
  deleteRecord,
  type YebRecord,
  type YebRecordSearchParams
} from '@/api/yebao'

defineOptions({ name: 'YebRecord' })

const searchParams = reactive<YebRecordSearchParams>({
  username: '',
  type: undefined
})

const stats = ref<any>({})

const fetchStats = async () => {
  try {
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
    apiFn: fetchRecordList,
    apiParams: searchParams,
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      { prop: 'username', label: '用户名', width: 120, align: 'center' },
      {
        prop: 'type_text',
        label: '类型',
        width: 100,
        align: 'center',
        formatter: (row: any) => {
          // 后端返回 type_text 可能是 "income" 等英文，也可能是中文
          const val = row.type_text || row.type
          const map: Record<string, { type: string; label: string }> = {
            deposit: { type: 'primary', label: '存入' },
            withdraw: { type: 'warning', label: '取出' },
            interest: { type: 'success', label: '收益' },
            income: { type: 'success', label: '收益' }, // 新增 income
            settle: { type: 'info', label: '结算' },
            '存入': { type: 'primary', label: '存入' },
            '取出': { type: 'warning', label: '取出' },
            '收益发放': { type: 'success', label: '收益' },
            '定期结算': { type: 'info', label: '结算' }
          }
          const item = map[val] || { type: 'primary', label: val }
          return h(ElTag, { type: item.type as any }, () => item.label)
        }
      },
      { prop: 'amount', label: '变动金额', width: 120, align: 'center' },
      { prop: 'before_yebao', label: '变动前', width: 120, align: 'center' },
      { prop: 'after_yebao', label: '变动后', width: 120, align: 'center' },
      { prop: 'createtime_text', label: '时间', width: 180, align: 'center' },
      { prop: 'remark', label: '备注', minWidth: 200, align: 'center' },
      {
        prop: 'operation',
        label: '操作',
        width: 100,
        fixed: 'right',
        align: 'center',
        formatter: (row: YebRecord) =>
          h('div', [
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

const handleDelete = (row: YebRecord) => {
  ElMessageBox.confirm('确认删除该记录吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await deleteRecord(row.id)
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
