<route>
{
meta: {
title: "登录",
constant: true,
layout: false
}
}
</route>
<template>
    <header
        class="text-gray-600 body-font shadow-md"
        :class="{
            'fixed w-full bg-white shadow-lg z-10': scrollTop
        }"
    >
        <div class="login-container mx-auto flex flex-wrap px-5 py-2 flex-col md:flex-row items-center">
            <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 dark:bg-white-900">
                <img src="../../assets/images/login-logo.png" alt="" class="w-38">
            </a>
            <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                <div
                    v-for="item in navList" :key="item.id"
                    class="mr-5 hover:text-gray-900 cursor-pointer text-base dark:text-gray-400"
                    :class="{'active':navId === item.id}"
                    @click="handleNavClick(item.id)"
                >
                    {{ item.name }}
                </div>
            </nav>
        </div>
    </header>
    <LoginIntroduce v-if="navId === 1"/>
    <LoginFocus v-if="navId === 4"/>
    <LoginHelp v-if="navId === 2"/>
    <LoginForm v-if="navId===5"/>
    <footer class="w-full text-center mt-7 text-stone-400 text-base">
        <p> Copyright © 2020-2022 北京云桥链科技有限公司 All Rights Reserved</p>
    </footer>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, ref } from 'vue'
import LoginForm from '@/views/login/components/LoginForm.vue'
import LoginHelp from '@/views/login/components/LoginHelp.vue'
import LoginIntroduce from '@/views/login/components/LoginIntroduce.vue'
import LoginFocus from '@/views/login/components/LoginFocus.vue'

const navId = ref(5)
const navList = reactive([
    {
        name: '产品介绍',
        id: 1,
    },
    {
        name: '使用帮助',
        id: 2
    },
    {
        name: '关于我们',
        id: 3
    },
    {
        name: '关注我们',
        id: 4
    },
    {
        name: '用户登录',
        id: 5
    }
])
const scrollTop = ref(0)
const handleNavClick = id => {
    navId.value = id
    if (id === 3) {
        window.open('http://www.eduyq.net/', '_blank', '' +
            'width=900,' +
            'height=800,' +
            'menubar=no,' +
            'toolbar=no, ' +
            'status=no,' +
            'scrollbars=yes'
        )
    }
}

function onScroll() {
    scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop
}

onMounted(() => {
    window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
})

</script>

<style scoped>
.active {
    color: var(--el-color-primary);
}
</style>
