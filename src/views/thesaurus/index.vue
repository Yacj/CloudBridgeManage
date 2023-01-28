<template>
    <page-main title="词库添加">
        <ul class="grid gird-cols-2 md:grid-cols-2 gap-3">
            <li class="flex items-center space-x-3">
                <span>方式一：</span>
                <el-upload
                    class="upload-demo"
                    action="#"
                    accept=".xlsx,.xls"
                    :http-request="uploadWord"
                    :show-file-list="false"
                >
                    <base-button>选择文件</base-button>
                </el-upload>
                <base-button type="success" @click="handleUploadWord">上传</base-button>
            </li>
            <li class="flex items-center space-x-3">
                <span>方式二</span>
                <base-button type="" size="small" @click="handelAddWordType">
                    新增类型
                </base-button>
                <base-select
                    v-model="addData.TypeID"
                    :data="typeList"
                    label="TypeName"
                    c-key="ID"
                    c-value="ID"
                    placeholder="请选择类型"
                />
                <el-input v-model="addData.Word" placeholder="请输入敏感词" class="w-5/12" clearable />
                <base-button @click="handleAddWord">添加</base-button>
            </li>
        </ul>
    </page-main>
    <page-main title="词库列表">
        <ul class="grid grid-cols-2 gap-4">
            <li v-for="item in wordList" :key="item.TypeID" class="border-1 border-gray-200 p-5 rounded-md">
                <h5>
                    {{ item.TypeName }}
                </h5>
                <div class="mt-5">
                    <span
                        v-for="word in item.Rows"
                        :key="word.wordID"
                        class="leading-10 cursor-pointer h-[30px] shrink-0 !rounded-full border py-1.5 px-3.5 text-xs font-medium outline-none border-light-500 bg-light-400 text-dark-500 hover:bg-primary-100 mr-5 dark:border-dark-500 dark:bg-dark-400 dark:text-light-100 hover:dark:bg-dark-500 hover:dark:text-light"
                    >
                        {{ word.WordName }}
                    </span>
                </div>
            </li>
        </ul>
    </page-main>
</template>

<script setup>
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { errorMsg, successMsg } from '@/utils/message'
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue'
import { ElMessageBox } from 'element-plus'
import { wordService } from '@/api/modules/word'

const uploadFile = ref('')
const typeList = ref([])
const addData = ref({
    TypeID: '',
    Word: ''
})

const wordList = ref([])

const getThesaurusData = () => {
    wordService.get_word().then(res => {
        wordList.value = res.Data
    })
}
const getWordType = () => {
    wordService.get_word_type().then(res => {
        typeList.value = res.Data
    })
}
const uploadWord = e => {
    uploadFile.value = e.file
}

const handleUploadWord = () => {
    const formData = new FormData()
    formData.append('filedata', uploadFile.value)
    wordService.post_word_upload(formData).then(res => {
        successMsg('上传成功')
    })
}
const handelAddWordType = () => {
    ElMessageBox.prompt('请输入标签名称', '提示', {
        inputPattern: /\S/,
        inputErrorMessage: '标签名称不能为空'
    })
        .then(({ value }) => {
            wordService.get_wordType_add({ TypeName: value }).then(res => {
                successMsg('新增成功')
                getWordType()
            })
        })
        .catch(() => {
        })
}
const handleAddWord = () => {
    const data = addData.value
    if (!data.TypeID) {
        return errorMsg('请选择类型')
    }
    if (!data.Word) {
        return errorMsg('请输入敏感词')
    }
    wordService.post_word_add(addData.value).then(res => {
        successMsg('添加成功')
        getThesaurusData()
    })
}

getThesaurusData()
getWordType()
</script>

<style scoped lang="scss">

</style>
