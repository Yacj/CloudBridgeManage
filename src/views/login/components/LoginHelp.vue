<template>
    <preview-docx :file="docFile" class="!h-[81vh] mb-3"/>
</template>

<script setup>
import PreviewDocx from '@/components/previewDocx/previewDocx.vue'
import axios from 'axios'
import baseUrl from '@/utils/baseUrl'

const docFile = ref('')
axios.get(`${baseUrl.yqApi}/Resource/云集教学实训平台使用帮助.docx`, {
    responseType: 'blob'
}).then(res => {
    docFile.value = res.data
})
</script>

<style scoped>

</style>
