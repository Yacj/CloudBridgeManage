<template>
    <el-tooltip content="点击切换">
        <canvas
            ref="verifyCanvas"
            class="canvas"
            :width="props.width"
            :height="props.height"
            @click="refresh"
        />
    </el-tooltip>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'

const props = defineProps({
    code: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 112
    },
    height: {
        type: Number,
        default: 47
    },
    size: {
        type: Number,
        default: 1
    }
})
const codeText = ref('')
const verifyCanvas = ref(null)

const checkResult = verifyCode => {
    if (!verifyCode || verifyCode.length === 0) {
        return false
    }

    if (verifyCode.toLowerCase() !== codeText.value.toLowerCase()) {
        generateCode()
        return false
    } else {
        return true
    }
}

const randomNum = (min, max) => {
    return parseInt(Math.random() * (max - min) + min)
}

const randomColor = (min, max) => {
    const r = randomNum(min, max)
    const g = randomNum(min, max)
    const b = randomNum(min, max)
    return `rgb(${r},${g},${b})`
}

const generateCode = () => {
    codeText.value = ''
    const ctx = verifyCanvas.value.getContext('2d')
    ctx.fillStyle = randomColor(230, 255)
    ctx.fillRect(0, 0, props.width, props.height)

    for (let i = 0; i < props.size; i++) {
        let currentText = '' + props.code
        codeText.value += currentText
        ctx.font = '36px Simhei'
        ctx.fillStyle = randomColor(80, 150)
        ctx.fillText(currentText, (i + 1) * randomNum(20, 25), props.height / 2 + 13)
    }

    for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(randomNum(0, props.width), randomNum(0, props.height))
        ctx.lineTo(randomNum(0, props.width), randomNum(0, props.height))
        ctx.strokeStyle = randomColor(180, 230)
        ctx.closePath()
        ctx.stroke()
    }

    for (let i = 0; i < 40; i++) {
        ctx.beginPath()
        ctx.arc(randomNum(0, props.width), randomNum(0, props.height), 1, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = randomColor(150, 200)
        ctx.fill()
    }

    ctx.restore()
    ctx.save()

    return codeText
}

watch(() => props.code, () => {
    generateCode()
})
const emit = defineEmits(['click'])
const refresh = () => {
    emit('click')
}

defineExpose({ checkResult, refresh })
</script>

<style scoped>

</style>
