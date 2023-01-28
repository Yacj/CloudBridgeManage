<template>
    <page-main>
        <el-form
            ref="form"
            class="add-form block lg:flex lg:justify-between"
            :model="addData"
            :rules="rules"
            label-position="left"
            label-width="80px"
            size="default"
            @submit.prevent
        >
            <div class="mt-3  w-full lg:w-6/12">
                <el-form-item label="内容分类" prop="TemType">
                    <base-select
                        v-model="addData.TemType"
                        :data="fileTemplateSelectList"
                        label="EnumDes"
                        c-key="EnumInt"
                        c-value="EnumInt"
                        :filterable="true"
                        :clearable="true"
                        :disabled="!!id"
                    />
                </el-form-item>
                <el-form-item label="内容标题" prop="Title" class="required">
                    <el-input v-model="addData.Title" type="text" clearable />
                </el-form-item>
                <el-form-item label="模板版本" prop="Version" class="required">
                    <el-input v-model="addData.Version" type="text" clearable />
                </el-form-item>
                <el-form-item label="机构" prop="SchoolID">
                    <base-select
                        v-model="addData.SchoolID" :data="agencyList" c-value="ID" label="Name" class="w-full"
                        :filterable="true"
                        :clearable="true"
                        :disabled="!!id"
                    />
                </el-form-item>
                <el-form-item label="提交文件" prop="docx" class="required">
                    <el-upload
                        action="#"
                        :http-request="handleUploadFile"
                        accept=".pdf, .doc, .docx, .xls, .xlsx"
                        :show-file-list="false"
                    >
                        <base-button plain>上传文件</base-button>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="mt-3 w-full lg:w-6/12 flex-center">
                <el-form-item label="封面图" prop="cover">
                    <el-upload
                        ref="cover"
                        v-model:file-list="defaultCover"
                        :limit="1"
                        action="#"
                        list-type="picture-card"
                        :http-request="handleCoverFile"
                        accept="image/*"
                        :on-exceed="handleCoverFileExceed"
                    >
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </div>
        </el-form>
        <div>
            <preview-docx v-show="addData.docx" :file="addData.docx" />
        </div>
        <fixed-action-bar>
            <template v-if="id">
                <base-button type="primary" @click="submitForm">编辑</base-button>
            </template>
            <template v-else>
                <base-button type="success" size="large" @click="submitForm('Published')">确认发布</base-button>
                <base-button size="large" type="" @click="submitForm('Draft')">保存到草稿</base-button>
            </template>
        </fixed-action-bar>
    </page-main>
</template>

<script setup>
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue'
import { elAlert, errorMsg } from '@/utils/message.js'
import PreviewDocx from '@/components/previewDocx/previewDocx.vue'
import fileTemplateSelectList from '@/views/template_manage/index'
import { agencyService } from '@/api/modules/agency'
import { Plus } from '@element-plus/icons-vue'
import { fileTemplateService } from '@/api/modules/fileTemplate'
import { useRoute, useRouter } from 'vue-router'
import getFileBlob from '@/utils/fileBlob'
import baseUrl from '@/utils/baseUrl'
import { base64toFile, imgToBase64 } from '@/utils/imgToFile'

const form = ref('')
const addData = ref({
    TemType: '',
    Title: '',
    Version: '',
    docx: '',
    cover: '',
    SchoolID: ''
})
const agencyList = ref([])
const rules = {
    TemType: [
        {
            required: true,
            message: '请选择内容分类',
            trigger: 'change'
        }
    ],
    Title: [{
        required: true,
        message: '请输入内容标题'
    }],
    Version: [{
        required: true,
        message: '请输入模板版本'
    }],
    SchoolID: [{
        required: true,
        message: '请选择机构'
    }],
    docx: [{
        required: true,
        message: '请上传文件'
    }],
    cover: [{
        required: true,
        message: '请上传封面图'
    }]
}
const cover = ref('')
const defaultCover = ref([])
const router = useRouter()
const route = useRoute()
const { id } = route.query

if (id) {
    fileTemplateService.get_details({
        TemID: id
    }).then(async res => {
        addData.value = res.Data
        let docxUrl = baseUrl.yqApi + res.Data.Url
        const coverUrl = baseUrl.yqApi + res.Data.Cover
        if (docxUrl.indexOf('.docx') === -1) {
            docxUrl = docxUrl + '.docx'
        }
        const docxBlob = await getFileBlob(docxUrl)
        const fileName = coverUrl.substring(coverUrl.lastIndexOf('/') + 1)
        let imgFile = ''

        imgToBase64(coverUrl, res => {
            imgFile = base64toFile(res, fileName)
            addData.value.docx = docxBlob.data
            addData.value.cover = imgFile
            defaultCover.value = [{
                url: coverUrl,
                name: '封面图'
            }]
        })

    })
}

const getAddData = () => {
    agencyService.get_list().then(res => {
        agencyList.value = res.Data.rows
    })
}

const submitForm = type => {
    form.value.validate(valid => {
        if (valid) {
            if (id) {
                updateData()
            } else {
                const formData = new FormData()
                const { TemType, Title, Version, SchoolID, docx, cover } = addData.value
                formData.append('Title', Title)
                formData.append('Version', Version)
                formData.append('TemStatus', type)
                formData.append('TemType', TemType)
                formData.append('SchoolID', SchoolID)
                formData.append('docx', docx)
                formData.append('cover', cover)
                fileTemplateService.file_upload(formData).then(res => {
                    elAlert({
                        title: '提示',
                        msg: '上传成功',
                        type: 'success',
                        confirm: () => {
                            router.back()
                        }
                    })
                })
            }
        }
    })
}
const updateData = () => {
    const formData = new FormData()
    const { Title, Version, docx, cover } = addData.value
    formData.append('Title', Title)
    formData.append('Version', Version)
    formData.append('docx', docx)
    formData.append('cover', cover)
    formData.append('TemID', id)
    fileTemplateService.edit(formData).then(res => {
        elAlert({
            title: '提示',
            msg: '编辑成功',
            type: 'success',
            confirm: () => {
                router.back()
            }
        })
    })
}
const handleUploadFile = file => {
    const fileSuffix = file.file.name.substring(file.file.name.lastIndexOf('.') + 1)
    const whiteList = ['docx']

    if (whiteList.indexOf(fileSuffix) === -1) {
        errorMsg('上传文件只能是 docx 格式')
        return false
    }
    addData.value.docx = file.file
}
const handleCoverFile = file => {
    addData.value.cover = file.file
}
const handleCoverFileExceed = files => {
    const file = files[0]
    cover.value.clearFiles()
    cover.value.handleStart(file)
    addData.value.cover = file
}
getAddData()
</script>

<style scoped lang="scss">

</style>
