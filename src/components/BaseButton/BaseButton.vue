<template>
    <el-button
        :type="type"
        :plain="plain"
        :loading="loading"
        :size="size"
        :round="round"
        :disabled="disabled"
        :icon="icon"
        :text="text"
        @click="buttonOnclick"
    >
        <slot>
            {{ title }}
        </slot>
    </el-button>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
    plain: {
        type: Boolean,
        default: false
    },
    // 是否禁用
    loading: {
        type: Boolean,
        default: false
    },
    // 尺寸
    size: {
        type: String,
        default: 'default'
    },
    // 是否圆角
    round: {
        type: Boolean,
        default: false
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false
    },
    // 按钮类型
    icon: {
        type: Object,
        default: null
    },
    // 按钮类型
    type: {
        type: String,
        default: 'primary'
    },
    // 按钮标题
    title: {
        type: String,
        default: ''
    },
    isDebounce: {
        type: Boolean,
        default: false
    },
    text: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['click'])

// 防抖处理
const debouncedFn = useDebounceFn(() => {
    emit('click')
}, 500, { maxWait: 5000 })

const buttonOnclick = () => {
    if (props.isDebounce) {
        debouncedFn()
    } else {
        emit('click')
    }
}
</script>

<!--<style scoped>-->

<!--</style>-->
