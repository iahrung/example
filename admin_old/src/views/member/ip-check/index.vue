<template>
  <div class="app-container">
    <el-card shadow="never">
      <div class="mb-5 rounded-lg bg-gradient-to-br from-[#f093fb] to-[#f5576c] p-5 text-white shadow-md">
        <h3 class="mb-2 text-xl font-semibold">🔍 同IP会员检测</h3>
        <p class="my-1 opacity-95">📌 检测具有相同登录IP的会员账号，帮助发现可能的多账户行为</p>
        <p class="my-1 opacity-95">⚠️ 仅显示登录IP相同且数量大于1的记录</p>
      </div>

      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="loginip" label="IP地址" width="150" align="center">
          <template #default="{ row }">
            <router-link
              :to="{ path: '/member/list', query: { loginip: row.loginip } }"
              class="text-[#1E9FFF] hover:underline"
            >
              {{ row.loginip }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="usernames" label="会员账号" align="left">
          <template #default="{ row }">
            {{ formatUsernames(row.usernames) }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="相同IP会员数量" width="150" align="center">
          <template #default="{ row }">
            <span class="inline-block rounded-lg bg-[#FF5722] px-2 py-0.5 text-xs font-semibold text-white">
              {{ row.count }} 个账号
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="最后登录时间" width="180" align="center" />
      </el-table>

      <div class="mt-5 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { fetchIpCheckList, type IpCheckItem } from '@/api/member'

const loading = ref(false)
const tableData = ref<IpCheckItem[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchIpCheckList({
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
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchData()
}

const formatUsernames = (usernames: string) => {
  if (!usernames) return ''
  const list = usernames.split(',')
  if (list.length > 5) {
    return list.slice(0, 5).join(', ') + ' ...等'
  }
  return list.join(', ')
}

onMounted(() => {
  fetchData()
})
</script>
