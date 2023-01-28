<template>
    <div>
        <page-main>
            <base-button />
            <verify-code code="abcdefghjkmnpqrstuvwxyz23456789" @click="handleGetCode" />
        </page-main>
        <div class="p-5">
            <vxe-grid
                border
                resizable
                :pager-config="tablePage"
                :columns="tableOptions.column"
                :data="tableOptions.data"
                align="center"
                header-align="center"
                stripe
                round
                :row-config="{isHover: true}"
                @page-change="handlePageChange"
            >
                <template #time="{row}">
                    {{ row.StartTime }} ~ {{ row.EndTime }}
                </template>
                <template #operation>
                    12312
                </template>
            </vxe-grid>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import VerifyCode from '@/components/VerifyCode/VerifyCode.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { usePagination } from '@/hooks'
import { empowerService } from '@/api/modules/empower'

const tableOptions = ref({
    column: [
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
    data: []
})
const tablePage = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100, 200, 500],
    layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    perfect: true
})
const getAuthorizeListData = () => {
    const params = {
        PageInt: tablePage.value.currentPage,
        PageSize: tablePage.value.pageSize,
        keyword: '',
        Status: 0
    }
    empowerService.get_list(params).then(res => {
        console.log(res)
        const {
            rows,
            total
        } = res.Data
        tableOptions.value.data = rows
        tablePage.value.total = total
        console.log(tableOptions.value.data)
    })
}
const handleGetCode = () => {
    console.log('handleGetCode')
}
const tableColumn = [
    { type: 'index', width: '60', label: 'No.' },
    { prop: 'name', label: '名字' },
    {
        prop: 'date',
        label: '日期'
    },
    {
        prop: 'address',
        label: '地址'
    },
    {
        prop: 'operation',
        label: '操作',
        slot: 'operation',
        align: 'center'
    }
]
const tableData = ref([
    {
        date: 1660737564000,
        name: '佘太君',
        address: '上海市普陀区金沙江路 1516 弄'
    },
    {
        date: 1462291200000,
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
    },
    {
        date: 1462032000000,
        name: '王小帅',
        address: '上海市普陀区金沙江路 1519 弄'
    },
    {
        date: 1462204800000,
        name: '王小呆',
        address: '上海市普陀区金沙江路 1516 弄'
    }
])
// eslint-disable-next-line no-unused-vars
const { pagination, setTotal } = usePagination
const pageChange = (page, pageSize) => {
    tableOptions.value.paginationConfig.currentPage = page
    tableOptions.value.paginationConfig.pageSize = pageSize
}
const handlePageChange = ({ currentPage, pageSize }) => {
    tablePage.value.currentPage = currentPage
    tablePage.value.pageSize = pageSize
    getAuthorizeListData()
}
getAuthorizeListData()
</script>

<style scoped>

</style>
