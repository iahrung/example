<template>
  <div class="member-list-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      <!-- 搜索表单 -->
      <div class="search-form-container" id="art-table-header">
        <ElForm :model="searchParams" inline class="search-form">
          <!-- 添加会员按钮 -->
          <ElFormItem>
            <ElButton type="primary" @click="openDialog('add')">
              <template #icon><i class="ri-add-line"></i></template>
              添加会员
            </ElButton>
          </ElFormItem>

          <!-- 排序 -->
          <ElFormItem label="排序">
            <ElSelect v-model="searchParams.ordertype" style="width: 150px">
              <ElOption label="默认排序" :value="0" />
              <ElOption label="注册时间低到高" :value="1" />
              <ElOption label="彩票返点高到低" :value="2" />
              <ElOption label="彩票返点低到高" :value="3" />
              <ElOption label="账户金额高到低" :value="4" />
              <ElOption label="账户金额低到高" :value="5" />
              <ElOption label="账户积分高到低" :value="6" />
              <ElOption label="账户积分低到高" :value="7" />
              <ElOption label="洗码余额高到低" :value="8" />
              <ElOption label="洗码余额低到高" :value="9" />
              <ElOption label="登陆时间高到低" :value="16" />
              <ElOption label="登陆时间低到高" :value="17" />
              <ElOption label="在线时间高到低" :value="18" />
              <ElOption label="在线时间低到高" :value="19" />
            </ElSelect>
          </ElFormItem>

          <!-- 会员组 -->
          <ElFormItem label="会员组">
            <ElSelect v-model="searchParams.groupid" style="width: 120px">
              <ElOption label="全部" :value="0" />
              <ElOption
                v-for="g in groupList"
                :key="g.groupid"
                :label="g.groupname"
                :value="g.groupid"
              />
            </ElSelect>
          </ElFormItem>

          <!-- 类型 -->
          <ElFormItem label="类型">
            <ElSelect v-model="searchParams.proxy" style="width: 100px">
              <ElOption label="全部" :value="999" />
              <ElOption label="代理" :value="1" />
              <ElOption label="会员" :value="0" />
            </ElSelect>
          </ElFormItem>

          <!-- 内部 -->
          <ElFormItem label="内部">
            <ElSelect v-model="searchParams.isnb" style="width: 100px">
              <ElOption label="全部" :value="999" />
              <ElOption label="是" :value="1" />
              <ElOption label="否" :value="0" />
            </ElSelect>
          </ElFormItem>

          <!-- 文本输入 -->
          <ElFormItem label="用户名">
            <ElInput v-model="searchParams.username" placeholder="输入用户名" style="width: 120px" />
          </ElFormItem>
          <ElFormItem label="姓名">
            <ElInput v-model="searchParams.userbankname" placeholder="输入姓名" style="width: 120px" />
          </ElFormItem>
          <ElFormItem label="QQ">
            <ElInput v-model="searchParams.qq" placeholder="输入QQ" style="width: 120px" />
          </ElFormItem>
          <ElFormItem label="昵称">
            <ElInput v-model="searchParams.nickname" placeholder="输入昵称" style="width: 120px" />
          </ElFormItem>
          <ElFormItem label="登陆IP">
            <ElInput v-model="searchParams.loginip" placeholder="输入登陆IP" style="width: 120px" />
          </ElFormItem>

          <!-- 在线 -->
          <ElFormItem>
            <ElCheckbox v-model="searchParams.isonline" :true-label="1" :false-label="0">在线</ElCheckbox>
          </ElFormItem>

          <!-- 注册时间 -->
          <ElFormItem label="注册时间">
            <ElDatePicker
              v-model="searchParams.sDate"
              type="date"
              placeholder="开始时间"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
            <span class="mx-2">-</span>
            <ElDatePicker
              v-model="searchParams.eDate"
              type="date"
              placeholder="结束时间"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
          </ElFormItem>

          <!-- 金额 -->
          <ElFormItem label="金额">
            <ElInput v-model="searchParams.sAmount" placeholder="最小" style="width: 100px" />
            <span class="mx-2">-</span>
            <ElInput v-model="searchParams.eAmount" placeholder="最大" style="width: 100px" />
          </ElFormItem>

          <!-- 搜索按钮 -->
          <ElFormItem>
            <ElButton type="primary" @click="refreshData">
              <template #icon><i class="ri-search-line"></i></template>
              搜索
            </ElButton>
            <ElButton @click="resetSearch">重置</ElButton>
          </ElFormItem>
        </ElForm>
      </div>

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

    <!-- 弹窗 -->
    <MemberDialog
      v-model="dialogVisible"
      :type="dialogType"
      :data="currentMember"
      :group-list="groupList"
      @submit="refreshData"
    />

    <!-- 资金/积分/洗码调整 -->
    <AdjustDialog
      v-model="adjustDialogVisible"
      :type="adjustType"
      :member-id="currentMember.id!"
      :current-value="adjustCurrentValue"
      @submit="refreshData"
    />

    <!-- 会员资料 -->
    <MemberInfoDialog
      v-model="infoDialogVisible"
      :member="currentMember"
    />

    <!-- 账变记录 -->
    <BalanceLogDialog
      v-model="logDialogVisible"
      :member-id="currentMember.id!"
    />

    <!-- 下级会员 -->
    <ChildrenDialog
      v-model="childrenDialogVisible"
      :member-id="currentMember.id!"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchMemberList,
  deleteMember,
  kickMember,
  lockMember,
  fetchMemberGroupList,
  Member,
  MemberGroup
} from '@/api/member'
import { ElButton, ElTag, ElSwitch, ElMessageBox, ElMessage } from 'element-plus'
import MemberDialog from './modules/MemberDialog.vue'
import AdjustDialog from './modules/AdjustDialog.vue'
import MemberInfoDialog from './modules/MemberInfoDialog.vue'
import BalanceLogDialog from './modules/BalanceLogDialog.vue'
import ChildrenDialog from './modules/ChildrenDialog.vue'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'

defineOptions({ name: 'MemberList' })

// 搜索参数
const searchParams = reactive({
  page: 1,
  limit: 20,
  ordertype: 0,
  groupid: 0,
  proxy: 999,
  isnb: 999,
  username: '',
  userbankname: '',
  qq: '',
  nickname: '',
  loginip: '',
  isonline: 0,
  sDate: '',
  eDate: '',
  sAmount: '',
  eAmount: ''
})

// 会员组列表
const groupList = ref<MemberGroup[]>([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentMember = ref<Partial<Member>>({})

const adjustDialogVisible = ref(false)
const adjustType = ref<'balance' | 'point' | 'xima'>('balance')
const adjustCurrentValue = ref(0)

const infoDialogVisible = ref(false)
const logDialogVisible = ref(false)
const childrenDialogVisible = ref(false)

// 加载会员组
const loadGroups = async () => {
  try {
    const res = await fetchMemberGroupList({ page: 1, limit: 100 })
    if (res && res.list) {
      groupList.value = res.list
    }
  } catch (e) {
    console.error(e)
  }
}

// 使用 useTable
const {
  columns,
  data,
  loading,
  pagination,
  refreshData,
  handleSizeChange,
  handleCurrentChange
} = useTable({
  core: {
    apiFn: fetchMemberList,
    apiParams: searchParams, // Pass reactive object, useTable should handle it
    paginationKey: {
      current: 'page',
      size: 'limit'
    },
    columnsFactory: () => [
      { prop: 'id', label: 'ID', sortable: true, align: 'center' },
      {
        prop: 'groupname',
        label: '会员组',
        width: 100,
        align: 'center',
        formatter: (row: Member) => h(ElTag, { type: 'info' }, () => row.groupname)
      },
      {
        prop: 'username',
        label: '用户名',
        width: 120,
        align: 'center',
        formatter: (row: Member) =>
          h(
            'span',
            {
              class: 'text-primary cursor-pointer hover:underline',
              style: { color: '#409eff' },
              onClick: () => openDialog('edit', row)
            },
            row.username
          )
      },
      { prop: 'userbankname', label: '姓名', width: 100, align: 'center' },
      { prop: 'parent_username', label: '上线', width: 100, align: 'center' },
      {
        prop: 'proxy_text',
        label: '类型',
        width: 80,
        align: 'center',
        formatter: (row: Member) => h(ElTag, { type: 'info' }, () => row.proxy_text)
      },
      { prop: 'jinjijilu', label: '晋级记录', width: 100, align: 'center' },
      {
        prop: 'balance',
        label: '金额',
        width: 120,
        align: 'center',
        formatter: (row: Member) =>
          h(
            'span',
            {
              class: 'text-primary cursor-pointer',
              style: { color: '#409eff' },
              onClick: () => handleEditBalance(row)
            },
            Number(row.balance || 0).toFixed(3)
          )
      },
      {
        prop: 'point',
        label: '积分',
        width: 100,
        align: 'center',
        formatter: (row: Member) =>
          h(
            'span',
            {
              class: 'text-primary cursor-pointer',
              style: { color: '#409eff' },
              onClick: () => handleEditPoint(row)
            },
            row.point || 0
          )
      },
      { prop: 'yebmoney', label: '余额宝', width: 100, align: 'center' },
      {
        prop: 'xima',
        label: '洗码余额',
        width: 120,
        align: 'center',
        formatter: (row: Member) =>
          h(
            'span',
            {
              class: 'text-primary cursor-pointer',
              style: { color: '#409eff' },
              onClick: () => handleEditXima(row)
            },
            Number(row.xima || 0).toFixed(3)
          )
      },
      { prop: 'logintime_text', label: '登陆时间', width: 160, align: 'center' },
      { prop: 'loginsource', label: '登陆来源', width: 100, align: 'center' },
      {
        prop: 'isonline_text',
        label: '状态',
        width: 80,
        align: 'center',
        formatter: (row: Member) =>
          h(
            ElTag,
            { type: row.isonline_text === '在线' ? 'success' : 'info' },
            () => row.isonline_text
          )
      },
      {
        prop: 'islock',
        label: '封禁',
        width: 80,
        align: 'center',
        formatter: (row: Member) =>
          h(ElSwitch, {
            modelValue: row.islock === 0, // 0 is normal (true), 1 is locked (false)? Legacy says: checked = d.islock == 0. So 0 is Checked (Normal).
            activeText: '',
            inactiveText: '',
            inlinePrompt: true,
            activeValue: true,
            inactiveValue: false,
            onChange: (val: any) => handleLockChange(row, val)
          })
      },
      {
        prop: 'info',
        label: '资料',
        width: 200,
        fixed: 'right',
        align: 'center',
        formatter: (row: Member) =>
          h('div', { class: 'flex justify-center gap-2' }, [
            h(ElButton, { size: 'small', onClick: () => handleInfo(row) }, () => '资料'),
            h(ElButton, { size: 'small', onClick: () => handleBalanceLog(row) }, () => '帐变'),
            h(ElButton, { size: 'small', onClick: () => handleChildren(row) }, () => '下级')
          ])
      },
      {
        prop: 'action',
        label: '操作',
        width: 180,
        fixed: 'right',
        align: 'center',
        formatter: (row: Member) =>
          h('div', { class: 'flex justify-center gap-2' }, [
            h(ElButton, { class: 'btn-edit', size: 'small', onClick: () => openDialog('edit', row) }, () => '编辑'),
            h(ElButton, { class: 'btn-delete', size: 'small', onClick: () => handleDelete(row) }, () => '删'),
            h(ElButton, { class: 'btn-kick', size: 'small', onClick: () => handleKick(row) }, () => '踢')
          ])
      }
    ]
  }
})

onMounted(() => {
  loadGroups()
})

const resetSearch = () => {
    Object.assign(searchParams, {
        ordertype: 0,
        groupid: 0,
        proxy: 999,
        isnb: 999,
        username: '',
        userbankname: '',
        qq: '',
        nickname: '',
        loginip: '',
        isonline: 0,
        sDate: '',
        eDate: '',
        sAmount: '',
        eAmount: ''
    })
    refreshData()
}

const openDialog = (type: 'add' | 'edit', row?: Member) => {
  dialogType.value = type
  currentMember.value = row ? { ...row } : {}
  dialogVisible.value = true
}

const handleEditBalance = (row: Member) => {
  currentMember.value = row
  adjustType.value = 'balance'
  adjustCurrentValue.value = Number(row.balance || 0)
  adjustDialogVisible.value = true
}

const handleEditPoint = (row: Member) => {
  currentMember.value = row
  adjustType.value = 'point'
  adjustCurrentValue.value = Number(row.point || 0)
  adjustDialogVisible.value = true
}

const handleEditXima = (row: Member) => {
  currentMember.value = row
  adjustType.value = 'xima'
  adjustCurrentValue.value = Number(row.xima || 0)
  adjustDialogVisible.value = true
}

const handleInfo = (row: Member) => {
  currentMember.value = row
  infoDialogVisible.value = true
}

const handleBalanceLog = (row: Member) => {
  currentMember.value = row
  logDialogVisible.value = true
}

const handleChildren = (row: Member) => {
  currentMember.value = row
  childrenDialogVisible.value = true
}

const handleDelete = (row: Member) => {
  ElMessageBox.confirm(`确认删除会员【${row.username}】吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteMember(row.id)
      ElMessage.success('已删除!')
      refreshData()
    } catch (e) {}
  })
}

const handleKick = (row: Member) => {
  ElMessageBox.confirm(`确认踢出会员【${row.username}】吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await kickMember(row.id)
      ElMessage.success('已踢出!')
    } catch (e) {}
  })
}

const handleLockChange = async (row: Member, val: boolean) => {
    // val is true (checked) -> normal (islock=0)
    // val is false (unchecked) -> locked (islock=1)
    const newLockState = val ? 0 : 1
    try {
        await lockMember(row.id, newLockState)
        row.islock = newLockState
        ElMessage.success(val ? '已解锁' : '已锁定')
    } catch(e) {
        // revert visual state if failed (though tricky with VNode reactivity sometimes, useTable might refresh)
        refreshData()
    }
}

</script>

<style scoped>
.search-form-container {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 16px;
}
.search-form .el-form-item {
  margin-bottom: 12px;
  margin-right: 12px;
}

/* Custom Button Styles */
:deep(.btn-edit) {
  background-color: #009688 !important;
  border-color: #009688 !important;
  color: #fff !important;
}
:deep(.btn-edit:hover) {
  background-color: #00796B !important;
  border-color: #00796B !important;
}

:deep(.btn-delete) {
  background-color: #FF5722 !important;
  border-color: #FF5722 !important;
  color: #fff !important;
}
:deep(.btn-delete:hover) {
  background-color: #E64A19 !important;
  border-color: #E64A19 !important;
}

:deep(.btn-kick) {
  background-color: #FFB800 !important;
  border-color: #FFB800 !important;
  color: #fff !important;
}
:deep(.btn-kick:hover) {
  background-color: #FFA000 !important;
  border-color: #FFA000 !important;
}
</style>
