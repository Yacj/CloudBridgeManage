<template>
    <div>
        <page-header title="授权列表"/>
        <page-main>
            <vxe-grid
                v-bind="tableOptions"
                @page-change="handlePageChange"
            >
                <template #time="{row}">
                    {{ row.StartTime }} ~ {{ row.EndTime }}
                </template>
                <template #operation>
                    <base-button text @click="handleToDetail(row.SchoolID)">查看详情</base-button>
                </template>
            </vxe-grid>
        </page-main>
    </div>
</template>

<script setup>
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { empowerService } from '@/api/modules/empower'

const router = useRouter()
const tableOptions = ref({
    border: true,
    align: 'center',
    headerAlign: 'center',
    stripe: true,
    resizable: true,
    round: true,
    columns: [
        {
            title: '机构名称',
            field: 'SchoolName'
        },
        {
            title: '授权时间（开始-结束）',
            field: 'Time',
            slots: {
                default: 'time'
            }
        },
        {
            title: '授权状态',
            field: 'Status'
        },
        {
            title: '操作',
            slots: {
                default: 'operation'
            }
        }
    ],
    data: [],
    loading: false,
    rowConfig: {
        isHover: true
    },
    pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
    }
})
const listParams = reactive({
    keyword: '',
    Status: 0
})
const getAuthorizeListData = () => {
    tableOptions.value.loading = true
    const params = {
        PageInt: tableOptions.value.pagerConfig.currentPage,
        PageSize: tableOptions.value.pagerConfig.pageSize,
        ...listParams
    }
    empowerService.get_list(params).then(res => {
        tableOptions.value.data = res.Data.rows
        tableOptions.value.loading = false
        tableOptions.value.pagerConfig.total = res.Data.total
    })
}
const handlePageChange = ({ currentPage, pageSize }) => {
    tableOptions.value.pagerConfig.currentPage = currentPage
    tableOptions.value.pagerConfig.pageSize = pageSize
    getAuthorizeListData()
}
const handleToDetail = SchoolID => {
    router.push(`/authorize/edit?SchoolID=${SchoolID}`)
}
getAuthorizeListData()
</script>

<style scoped lang="scss">

</style>
