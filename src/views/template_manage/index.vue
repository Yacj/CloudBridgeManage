<template>
    <page-main>
        <el-tabs v-model="listParams.Status" type="border-card" @tab-click="handleTabsClick">
            <el-tab-pane v-for="item in statusList" :key="item.value" :name="item.value" :label="item.label">
                <div class="template-search my-5  block lg:flex lg:justify-between">
                    <div class="flex-center">
                        <div class="w-18">分类:</div>
                        <base-select
                            v-model="listParams.Type"
                            :data="fileTemplateSelectList"
                            class="mr-5 ml-3"
                            c-value="EnumName"
                            label="EnumDes"
                            @click="getTemplateList"
                        />
                    </div>
                    <div>
                        <el-input
                            v-model="listParams.KeyWord" placeholder="ID / 内容标题 /  机构名称" class="w-90"
                            clearable @keyup.enter.native="getTemplateList"
                        >
                            <template #append>
                                <base-button type="primary" :icon="Search" @click="getTemplateList" />
                            </template>
                        </el-input>
                    </div>
                </div>
                <div class="template-table">
                    <div class="table-btn mb-5">
                        <base-button :icon="Plus" @click="handlePush">
                            新增内容
                        </base-button>
                        <base-button type="" :disabled="selectionList.length === 0" plain @click="handleLower">
                            批量下架
                        </base-button>
                        <base-button
                            type="danger" :disabled="selectionList.length === 0" plain
                            @click="handelDelete('')"
                        >
                            批量删除
                        </base-button>
                    </div>
                    <vxe-grid
                        v-bind="tableOptions"
                        @checkbox-change="changeBox"
                        @checkbox-all="changeAllBox"
                    >
                        <template #cover="{row}">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="row.cover"
                                :preview-src-list="[row.cover]"
                            />
                        </template>
                        <template #action="{row}">
                            <base-button v-if="listParams.Status === 'Published'" text plain @click="goToEdit(row)">
                                编辑
                            </base-button>
                            <base-button v-else text plain @click="handlePublish(row)">
                                发布
                            </base-button>
                            <base-button text tplain type="success" @click="handlePreviewFile(row)">预览</base-button>
                            <base-button text plain type="danger" @click="handelDelete(row.ID)">
                                删除
                            </base-button>
                        </template>
                    </vxe-grid>
                </div>
            </el-tab-pane>
        </el-tabs>
    </page-main>
    <el-dialog v-model="visibleFile" title="预览文件">
        <preview-docx :file="previewFile" />
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fileTemplateService } from '@/api/modules/fileTemplate'
import useUserStore from '@/store/modules/user'
import fileTemplateSelectList from '@/views/template_manage/index'
import baseUrl from '@/utils/baseUrl'
import PreviewDocx from '@/components/previewDocx/previewDocx.vue'
import getFileBlob from '@/utils/fileBlob'
import { elConfirm, successMsg } from '@/utils/message'

const statusList = reactive([
    {
        label: '已发布',
        value: 'Published'
    },
    {
        label: '草稿',
        value: 'Draft'
    }
])
const listParams = ref({
    Type: fileTemplateSelectList[0].EnumName,
    Status: 'Published',
    KeyWord: ''
})
const selectionList = ref([])
const userStore = useUserStore()
const router = useRouter()
const visibleFile = ref(false)
const previewFile = ref('')
const tableOptions = ref({
    border: true,
    align: 'center',
    headerAlign: 'center',
    stripe: true,
    resizable: true,
    round: true,
    columns: [
        {
            type: 'checkbox', width: 60
        },
        {
            field: 'ID',
            title: 'ID',
            width: 60
        },
        {
            field: 'cover',
            title: '封面图',
            slots: {
                default: 'cover'
            }
        },
        {
            field: 'Title',
            title: '内容标题',
            width: 100
        },
        {
            field: 'Type',
            title: '分类'
        },
        {
            field: 'SchoolName',
            title: '机构'
        },
        {
            field: 'Format',
            title: '格式'
        },
        {
            field: 'Version',
            title: '版本'
        },
        {
            field: 'TimeCreate',
            title: '上传时间'
        },
        {
            field: 'actions',
            title: '操作',
            width: 230,
            slots: {
                default: 'action'
            }
        }
    ],
    data: [],
    loading: false,
    rowConfig: {
        isHover: true
    }
    // pagerConfig: {
    //     total: 0,
    //     currentPage: 1,
    //     pageSize: 10,
    //     pageSizes: [10, 20, 50, 100, 200, 500],
    //     layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    //     perfect: true,
    //     show:false
    // }
})
const getTemplateList = () => {
    // const { SchoolId } = userStore.userInfo
    tableOptions.value.loading = true
    const params = {
        SchoolId: 0,
        ...listParams.value
    }
    fileTemplateService.get_list(params).then(res => {
        const data = res.Data
        data.forEach(item => {
            item.cover = baseUrl.yqApi + item.Cover
            item.Type = fileTemplateSelectList.find(i => i.EnumInt === item.TemType).EnumDes
        })
        tableOptions.value.data = data
        tableOptions.value.loading = false
    })
}

const handleTabsClick = tab => {
    listParams.value.Status = tab.paneName
    getTemplateList()
}

const handleTableSelect = selection => {
    selectionList.value = selection
}

const handlePush = () => {
    router.push('/templateManage/add')
}

const handlePreviewFile = async row => {
    visibleFile.value = true
    const { Url } = row
    const url = baseUrl.yqApi + Url
    const blob = await getFileBlob(url)
    previewFile.value = blob.data
}

const goToEdit = row => {
    router.push({
        path: '/templateManage/add',
        query: {
            id: row.ID
        }
    })
}
const handlePublish = row => {
    const TemID = row.ID
    fileTemplateService.publish({ TemID }).then(res => {
        successMsg('发布成功')
        getTemplateList()
    })
}
const handelDelete = id => {
    let TemID = ''
    if (id) {
        TemID = id
    } else {
        TemID = selectionList.value.map(item => item.ID).join(',')
    }
    elConfirm({
        title: '提示',
        msg: '确定删除这些内容吗？',
        ok: () => {
            fileTemplateService.delete({ TemID }).then(res => {
                successMsg('删除成功')
                getTemplateList()
            })
        }
    })
}
const handleLower = () => {
    let temID = selectionList.value.map(item => item.ID).join(',')
    elConfirm({
        title: '提示',
        msg: '确定下架这些内容吗？',
        ok: () => {
            fileTemplateService.lower({ temID }).then(res => {
                successMsg('下架成功')
                getTemplateList()
            })
        }
    })
}

const changeBox = ({
    records
}) => {
    handleTableSelect(records)
}

const changeAllBox = ({
    records
}) => {
    handleTableSelect(records)
}
getTemplateList()
</script>

<style scoped>

</style>
