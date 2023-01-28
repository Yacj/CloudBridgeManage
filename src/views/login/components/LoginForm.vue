<template>
    <div
        class="w-full h-full text-gray-900 login-bg"
    >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 flex items-center justify-center h-full mr-[40px]">
            <div
                class="lg:w-3/6 xl:w-2/5 md:w-full bg-gray-50 dark:bg-gray-800 p-8 flex flex-col lg:ml-auto w-full mt-10 lg:mt-0 rounded-md"
            >
                <div class="login-form">
                    <el-form
                        v-show="formType === 'login'"
                        ref="loginFormRef"
                        :model="loginForm"
                        :rules="loginRules"
                        autocomplete="on"
                        label-position="left"
                    >
                        <div class="title-container mb-[18px] flex justify-between">
                            <h3 class="title text-xl dark:text-white">
                                {{ loginType === 'password' ? '密码' : '扫码' }}登录
                            </h3>
                            <div class="flex">
                                <div class="title-container-tag">
                                    {{ loginType === 'password' ? '扫码' : '密码' }}
                                    登录
                                </div>
                                <div class="flex cursor-pointer" @click="handleCheckFormType">
                                    <div class="triangle" />
                                    <div class="title-icon">
                                        <svg-icon name="erweima" class="w-[35px] h-[35px] dark:text-white-900" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="loginType === 'password'" class="mt-5">
                            <el-form-item prop="UserName" class="!mb-">
                                <el-input
                                    ref="name" v-model="loginForm.UserName" placeholder="请输入管理员账户" type="text"
                                    tabindex="1" autocomplete="on"
                                >
                                    <template #prefix>
                                        <el-icon>
                                            <svg-icon name="user" />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input
                                    ref="password" v-model="loginForm.password"
                                    placeholder="请输入登录密码" tabindex="2" autocomplete="on" :show-password="true"
                                    @keyup.enter="handleLogin"
                                >
                                    <template #prefix>
                                        <el-icon>
                                            <svg-icon name="password" />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="Code">
                                <el-input
                                    ref="Code" v-model="loginForm.Code"
                                    placeholder="请输入验证码"
                                    tabindex="3"
                                    autocomplete="on"
                                    class="!w-[73%] mr-[5px]"
                                >
                                    <template #prefix>
                                        <el-icon>
                                            <svg-icon name="yanzhengma1" />
                                        </el-icon>
                                    </template>
                                </el-input>
                                <verify-code :code="identifyCode" class="ml-5" @click="getVerifyCode" />
                            </el-form-item>
                            <div class="flex-bar mb-[18px]">
                                <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
                            </div>
                            <base-button
                                :loading="loading" style="width: 100%;" size="large" class="login-btn"
                                @click="handleLogin"
                            >
                                登 录
                            </base-button>
                            <div class="other-login mt-[20px] flex align-center">
                                <div class="text-sm text-gray-500">其他登录方式：</div>
                                <div
                                    class="other-login-icon w-[30px] h-[30px] bg-gray-400 text-white text-sm flex-center"
                                >
                                    CAS
                                </div>
                            </div>
                        </div>
                        <div v-else class="w-full flex-center">
                            <qrcode-vue :value="code.val" :size="code.size" level="H" />
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="Login">
import useUserStore from '@/store/modules/user'
import QrcodeVue from 'qrcode.vue'
import { local } from '@/utils/local'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { userService } from '@/api/modules/user.js'
import VerifyCode from '@/views/login/components/VerifyCode.vue'
import { cryptoData } from '@/utils/crypto.js'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { errorMsg } from '@/utils/message'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const formType = ref('login')
const loginType = ref('password')

const loginForm = ref({
    UserName: local.get('account') || '',
    password: '',
    remember: !!local.get('account'),
    Code: ''
})
const loginRules = ref({
    UserName: [
        { required: true, trigger: 'blur', message: '请输入管理员账户' }
    ],
    password: [
        { required: true, trigger: 'blur', message: '请输入密码' }
    ],
    Code: [
        { required: true, trigger: 'blur', message: '请输入验证码' }
    ]
})

const loading = ref(false)
const redirect = ref(null)

const code = reactive({
    val: 'https://example.com',
    size: 300
})

onMounted(() => {
    redirect.value = route.query.redirect ?? '/'
    getVerifyCode()
})

const identifyCode = ref('')
const getVerifyCode = () => {
    userService.setcode_verificat().then(res => {
        const { Code, Sign } = res.Data
        identifyCode.value = Code
        loginForm.value.Sign = Sign
    })
}
const handleCheckFormType = () => {
    loginType.value = loginType.value === 'password' ? 'code' : 'password'
}

function handleLogin() {
    proxy.$refs.loginFormRef.validate(valid => {
        if (valid) {
            const data = JSON.parse(JSON.stringify(loginForm.value))
            delete data.remember
            data.Pwd = cryptoData.encrypt(data.password)
            delete data.password
            loading.value = true
            userStore.login(data).then(res => {
                loading.value = false
                if (loginForm.value.remember) {
                    local.set('account', loginForm.value.UserName)
                } else {
                    local.remove('account')
                }
                router.push(redirect.value)
            }).catch(() => {
                loading.value = false
            })
        }
    })
}
</script>

<style lang="scss" scoped>
.login-main {
    flex: 1;
    overflow: auto;
    display: flex;

    .login-form {
        width: 400px;
        margin: auto;
        padding: 20px 0;

        .title-container {
            position: relative;

            .title {
                font-size: 30px;
                color: var(--el-text-color-regular);
                margin: 0 auto 30px;
                font-weight: bold;
                @include text-overflow;
            }
        }
    }
}

::v-deep(.el-input) {
    height: 48px;
    line-height: inherit;
    width: 100%;

    input {
        height: 48px;
    }

    .el-input__prefix,
    .el-input__suffix {
        display: flex;
        align-items: center;
    }

    .el-input__prefix {
        left: 10px;
    }

    .el-input__suffix {
        right: 10px;
    }
}

.triangle {
    width: 0;
    height: 0;
    border-right: 39px solid transparent;
    border-bottom: 31px solid #fff;
    position: relative;
    left: 39px;
    top: 4px;
}

.title-container-tag {
    background-color: var(--el-color-primary-light-9);
    border: 2px solid var(--el-color-primary-light-8);
    font-size: 12px;
    height: 26px;
    padding: 0 9px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--el-color-primary);
    position: relative;

    &::after {
        content: "";
        width: 0;
        height: 0;
        border: 13px solid transparent;
        border-left-color: var(--el-color-primary-light-9);
        position: absolute;
        left: 100%;
        top: 72%;
        margin-top: -18px;
    }
}

.login-bg {
    background-image: url(../../../assets/images/login-bg.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}

.other-login-icon {
    border-radius: 50%;
}
</style>
