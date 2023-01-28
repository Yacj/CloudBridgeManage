<template>
    <el-select
        v-model="dataVal"
        :size="size"
        :clearable="clearable"
        :filterable="filterable"
        :placeholder="placeholder"
        :multiple="multiple"
        :disabled="disabled"
        @change="change"
    >
        <el-option
            v-for="item in data"
            :key="item[cKey]"
            :label="item[label]"
            :value="item[cValue]"
        />
    </el-select>
</template>

<script setup name="BaseSelect">
import { watch } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'default'
    },
    placeholder: {
        type: String,
        default: ''
    },
    data: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        default: 'label'
    },
    clearable: {
        type: Boolean,
        default: true
    },
    filterable: {
        type: Boolean,
        default: true
    },
    cKey: {
        type: String,
        default: 'value'
    },
    cValue: {
        type: String,
        default: 'value'
    },
    multiple: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    value: null
})
const dataVal = ref(null)
const emit = defineEmits(['click'])

watch(props, (val, oldVal) => {
    dataVal.value = val.value
}, {
    immediate: true
})
const change = val => {
    emit('click', val)
}
</script>

<style scoped lang="scss">
.el-select-dropdown__item {
    min-height: 35px;
    height: auto;
    white-space: initial;
    overflow: hidden;
    text-overflow: initial;
    line-height: 25px;
    padding: 5px 20px;
}
</style>
