<template>
    <page-main>
        <div class="repost-select flex items-center">
            机构:
            <base-select
                v-model="reportAddData.SchoolID"
                :data="agencyList"
                c-value="ID"
                label="Name"
                class="mx-3"
                :filterable="true"
                :clearable="true"
                @click="getReportData"
            />
            <base-button :icon="Search">
                查询
            </base-button>
        </div>
        <div class="border-solid border-1 border-gray-300 mt-5">
            <div class="bg-gray-50 h-10 flex items-center pl-3">
                报告模板
            </div>
            <el-checkbox-group
                v-if="reportTemplateList.length > 0" v-model="reportAddData.FileTemID"
                class="grid grid-cols-5 gap-6 m-3"
            >
                <template v-for="item in reportTemplateList" :key="item.Value">
                    <el-checkbox
                        v-if="item.Value !== 'add'"
                        :label="item.Value"
                        class="h-10 flex items-center pl-5"
                    >
                        {{ item.Name }}
                    </el-checkbox>
                    <div v-else class="h-10 flex items-center text-base pl-5 add-font cursor-pointer" @click="goToAdd">
                        <el-icon>
                            <Plus/>
                        </el-icon>
                        {{ item.Name }}
                    </div>
                </template>
            </el-checkbox-group>
            <el-empty v-else>
                <template #description>
                    <span>暂无数据</span>
                </template>
                <base-button @click="goToAdd">去添加模板</base-button>
            </el-empty>
        </div>
        <div class="mt-5">
            <div class="bg-gray-50 h-10 flex items-center pl-3">
                设置封面
            </div>
            <el-upload
                ref="cover"
                v-model:file-list="defaultCover"
                class="mt-3"
                :limit="1"
                action="#"
                list-type="picture-card"
                :http-request="handleCoverFile"
                accept="image/*"
                :on-exceed="handleCoverFileExceed"
            >
                <el-icon>
                    <Plus/>
                </el-icon>
            </el-upload>
            <div id="img">
                <img src="" alt="">
            </div>
        </div>
        <div class="btn w-full flex-center">
            <base-button class="w-50" @click="handlePublish">保存发布</base-button>
        </div>
    </page-main>
</template>

<script setup>
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { agencyService } from '@/api/modules/agency'
import { ref } from 'vue'
import { fileTemplateService } from '@/api/modules/fileTemplate'
import { useRouter } from 'vue-router'
import { successMsg } from '@/utils/message'
import baseUrl from '@/utils/baseUrl'
import { base64toFile, imgToBase64 } from '@/utils/imgToFile'

const agencyList = ref([])
const reportTemplateList = ref([])
const router = useRouter()
const reportAddData = ref({
    SchoolID: '',
    FileTemID: [],
    cover: ''
})
const cover = ref(null)
const defaultCover = ref([])

const getAgencyData = () => {
    agencyService.get_list().then(res => {
        agencyList.value = res.Data.rows
        reportAddData.value.SchoolID = agencyList.value[0].ID
        getReportData()
    })
}

const getReportData = () => {
    const schoolID = reportAddData.value.SchoolID
    fileTemplateService.get_list_report({
        schoolID
    }).then(res => {
        reportTemplateList.value = res.Data
        reportTemplateList.value.push({
            Name: '添加模板',
            Value: 'add'
        })
    })
    fileTemplateService.get_report({
        schoolID
    }).then(async res => {
        const data = res.Data
        const coverUrl = baseUrl.yqApi + '/' + data.ReportCover
        const fileName = coverUrl.substring(coverUrl.lastIndexOf('/') + 1)

        let arrayID = []
        let imgFile = ''

        imgToBase64(coverUrl, res => {
            imgFile = base64toFile(res, fileName)
            data.Rows.forEach(item => {
                arrayID.push(item.TemID)
            })
            defaultCover.value = [{
                name: '封面',
                url: coverUrl
            }]
            reportAddData.value.FileTemID = arrayID
            reportAddData.value.cover = imgFile
        })
    }).catch(err => {
        console.error(err)
        cover.value.clearFiles()
        reportAddData.value.FileTemID = []
        reportAddData.value.cover = ''
    })
}

const handleCoverFile = file => {
    reportAddData.value.cover = file.file
}

const handleCoverFileExceed = files => {
    const file = files[0]
    cover.value.clearFiles()
    cover.value.handleStart(file)
    reportAddData.value.cover = file
}

const handlePublish = async() => {
    const formData = new FormData()
    const { SchoolID, FileTemID, cover } = reportAddData.value
    formData.append('SchoolID', SchoolID)
    formData.append('FileTemID', JSON.stringify(FileTemID))
    formData.append('filedata', cover)
    fileTemplateService.upload_report(formData).then(res => {
        successMsg('发布成功')
    })
}

const goToAdd = () => {
    router.push({
        path: '/templateManage/add'
    })
}

getAgencyData()
</script>

<style scoped lang="scss">
.add-font {
    color: var(--el-color-primary);
}
</style>
