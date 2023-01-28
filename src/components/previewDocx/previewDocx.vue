<template>
    <div
        class="file"
    >
        <div ref="preview"/>
    </div>
</template>

<script setup>
import { renderAsync } from 'docx-preview'
import { nextTick, watch } from 'vue'

const preview = ref(null)
const props = defineProps({
    file: {
        type: null
    }
})
// if (props.file) {
//     nextTick(() => {
//         renderAsync(props.file, preview.value)
//     })
// }
watch(() => props.file, (n, o) => {
    setPreview()
})
const setPreview = () => {
    renderAsync(props.file, preview.value)
}
</script>

<style scoped>
.file {
    height: 680px;
    overflow-x: auto;
}
</style>
