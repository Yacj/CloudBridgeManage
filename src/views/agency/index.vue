<template>
    <div>
        <page-header title="机构管理" />
        <page-main>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="flex items-center">
                    采购状态:
                    <base-select :data="[]" class="ml-3" />
                </div>
                <div class="flex items-center">
                    机构状态:
                    <base-select :data="[]" class="ml-3" />
                </div>
                <div>
                    <el-input placeholder="请输入机构名称">
                        <template #append>
                            <base-button :icon="Search" type="primary" />
                        </template>
                    </el-input>
                </div>
            </div>
        </page-main>
        <page-main>
            <base-table
                :columns="tableColumn"
                :table-data="tableData"
                :options="tableOptions"
            >
                <template #operation="{ slot }">
                    <base-button>授权</base-button>
                    <base-button type="danger" @click="handleAgencyDisable(slot)">停用</base-button>
                </template>
            </base-table>
        </page-main>
    </div>
</template>

<script setup>
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { Search } from '@element-plus/icons-vue'
import BaseTable from '@/components/BaseTable/BaseTable.vue'

const tableOptions = {
    showPagination: true,
    paginationConfig: {
        total: 10,
        pageSize: 2,
        currentPage: 1
    }
}
const tableColumn = [
    {
        prop: 'id',
        label: '机构ID'
    },
    {
        prop: 'name',
        label: '机构名称'
    },
    {
        prop: 'status',
        label: '机构状态'
    },
    {
        prop: 'createTime',
        label: '创建时间'
    },
    {
        prop: 'updateTime',
        label: '更新时间'
    },
    {
        prop: 'operation',
        label: '操作',
        slot: 'operation',
        align: 'center'
    }
]
const tableData = [
    {
        id: 1,
        name: '2'
    }
]
const handleAgencyDisable = slot => {
    console.log(slot)
}
</script>

<style scoped lang="scss"></style>
