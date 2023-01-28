<template>
    <div class="login-focus w-full text-center flex-center  h-[79%]" style="margin-bottom: 2.6%">
        <div class="login-focus-left  leading-loose text-left dark:text-white-900" style="font-size: 20px">
            <p>
                <span class="text-4xl" style="color:#F59A23">科 恰 喏 斯</span> KingChannels
            </p>
            <p>
                北京科恰喏斯文化传播有限公司
            </p>
            <p>
                公 司 总 机：400-030-1316
            </p>
            <p>
                公司地址：北京市海淀区农大南路88号1号楼1层1-108
            </p>
            <p>
                邮      编 ：100096
            </p>
        </div>
        <div class="focus-right ml-10 flex">
            <div class="text-lg font-bold dark:text-white-900">
                <img src="../../../assets/images/web-logo.png" alt="" class="w-50 h-50 mb-2">
                官方网站
            </div>
            <div class="text-lg font-bold ml-20 mt-[5px] dark:text-white-900">
                <qrcode-vue :value="code.val" :size="code.size" level="H" class="mb-2" />
                公众号
            </div>
        </div>
    </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'
import { reactive } from 'vue'
const code = reactive({
    val: 'https://example.com',
    size: 190
})
</script>

<style scoped>

</style>
