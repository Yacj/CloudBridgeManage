<template>
    <div>
        <el-form
            ref="resetPwdRef"
            :model="resetPwdForm"
            :rules="resetPwdRules"
            autocomplete="on"
            label-position="left"
        >
            <div class="title-container mb-[18px]">
                <h3 class="title text-xl dark:text-white">
                    重置密码
                </h3>
            </div>
            <el-form-item prop="Mobile">
                <el-input
                    v-model="resetPwdForm.Mobile"
                    placeholder="请输入手机号"
                >
                    <template #prefix>
                        <el-icon>
                            <svg-icon name="user" />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="Code">
                <el-input
                    v-model="resetPwdForm.Code"
                    placeholder="请输入验证码"
                >
                    <template #prefix>
                        <el-icon>
                            <svg-icon name="yanzhengma1" />
                        </el-icon>
                    </template>
                    <template #append>
                        <button-panel :disabled="isSend" @click="handleSendCode">
                            {{ countdown === 60 ? '发送验证码' : `${countdown}秒后重试` }}
                        </button-panel>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="NewP">
                <el-input
                    v-model="resetPwdForm.NewP"
                    placeholder="请输入新密码" tabindex="2" autocomplete="on" :show-password="true"
                    @keyup.enter="handleResetPwd"
                >
                    <template #prefix>
                        <el-icon>
                            <svg-icon name="password" />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <div class="flex-bar mb-[18px]">
                <el-link type="primary" @click="handleFromClick">返回登录</el-link>
            </div>
            <button-panel
                :loading="loading" style="width: 100%;" size="large" class="login-btn"
                @click="handleResetPwd(resetPwdRef)"
            >
                提交
            </button-panel>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { errorMsg, successMsg } from '@/utils/message.js'
import { userService } from '@/api/modules/user.js'
import { cryptoData, encryptParam } from '@/utils/crypto.js'
import { validate } from '@/utils/validate'

const countdown = ref(60)
const isSend = ref(false)
const resetPwdForm = ref({
    NewP: '',
    Mobile: '',
    Code: ''
})
const resetPwdRef = ref(null)
const validateMobile = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入手机号'))
    } else if (!validate.mobile(value)) {
        callback(new Error('手机号格式错误'))
    } else {
        callback()
    }
}

const resetPwdRules = ref({
    NewP: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
    ],
    Mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: validateMobile, trigger: 'blur' }
    ],
    Code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }]
})

const loading = ref(false)
const emit = defineEmits(['click'])
const countdownTimer = ref(null)

const handleSendCode = () => {
    const Mobile = resetPwdForm.value.Mobile
    if (!validate.mobile(Mobile)) {
        return errorMsg('手机号格式错误')
    }
    const key = encryptParam.k + '|' + Date.parse(new Date()) / 1000
    const params = {
        Mobile,
        Decrypt: cryptoData.encrypt(key)
    }
    userService.setcode_mobile(params).then(res => {
        const { Sign } = res.Data
        successMsg('验证码发送成功')
        isSend.value = true
        resetPwdForm.value.Sign = Sign
        countdownTimer.value = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                isSend.value = false
                clearInterval(countdownTimer.value)
            }
        }, 1000)
    })
}
const handleFromClick = () => {
    // clearInterval(countdownTimer.value)
    emit('click')
}

const handleResetPwd = el => {
    if (!el) {
        return
    }
    el.validate(valid => {
        if (valid) {
            const data = JSON.parse(JSON.stringify(resetPwdForm.value))
            delete data.Mobile
            userService.UpdatePwd_Tel(data).then(res => {
                successMsg('密码重置成功')
            })
        }
    })
}
</script>

<style scoped>

</style>
