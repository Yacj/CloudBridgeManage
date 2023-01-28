<template>
    <div
        class="topBar-tabs" :class="{
            'shadow': scrollTop
        }"
        data-fixed-calc-width
    >
        <ul
            ref="tags"
            class="flex topBar-tabs-list"
            :class="{
                'px-[37px]':tagShowPrevNext
            }"
        >
            <li
                v-for="(item, index) in tabs"
                :key="item.name"
                :class="{ 'active': currentRouteName === item.name }"
                @contextmenu.prevent="(e) => handleOpenContext(e, item, index)"
            >
                <router-link
                    :to="{
                        name: item.name,
                        params: item.params,
                        query: item.query
                    }"
                >
                    {{ item.title }}
                    <i v-if="index > 0" class="el-icon-close">
                        <Close @click.prevent.stop="handleClose(item, index)" />
                    </i>
                </router-link>
            </li>
        </ul>
        <div v-if="tagShowPrevNext" class="tag-prev" @click="handleScroll(-200)">
            <el-icon>
                <ArrowLeftBold />
            </el-icon>
        </div>
        <div v-if="tagShowPrevNext" class="tag-next" @click="handleScroll(200)">
            <el-icon>
                <ArrowRightBold />
            </el-icon>
        </div>
        <!--        </el-scrollbar>-->
    </div>
    <transition name="el-zoom-in-top">
        <ul
            v-if="contentVisible"
            id="contextmenu"
            class="context-menu"
            :style="{
                left: `${positionContext.left}px`,
                top: `${positionContext.top}px`,
            }"
        >
            <li @click="tagReload">
                <el-icon :size="15">
                    <Refresh />
                </el-icon>
                刷新当前页面
            </li>
            <hr>
            <li
                v-if="currentContextIndex !== 0"
                @click="handleClose(tabs[currentContextIndex], currentContextIndex)"
            >
                <el-icon :size="15">
                    <Close />
                </el-icon>
                关闭
            </li>
            <hr v-if="currentContextIndex !== 0">
            <li @click="handleCloseOther">
                <el-icon :size="15">
                    <FolderDelete />
                </el-icon>
                关闭其他
            </li>
            <!--            <hr>-->
            <!--            <li @click="handleCloseAll">关闭所有</li>-->
        </ul>
    </transition>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Close, Refresh, FolderDelete, FullScreen } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'
import { ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'
import { useTagsStore } from '@/store/modules/tags'
import { tryOnMounted } from '@vueuse/core'

const tagShowPrevNext = ref(false)
const reload = inject('reload')
const route = useRoute()
const router = useRouter()
const store = useTagsStore()
const tabs = computed(() => {
    return store.tabs
})
// 右键菜单的位置
const positionContext = reactive({
    left: 0,
    top: 0
})
const clickRoute = ref('')
const scrollTop = ref(0)
const scrollContainer = ref(null)
const contentVisible = ref(false)
const currentContextIndex = ref(0)
const tags = ref(null)

tryOnMounted(() => {
    tagDrop()
    nextTick(() => {
        tagShowPrevNext.value = tags.value.scrollWidth > tags.value.offsetWidth
    })
})

const tagDrop = () => {
    const target = tags.value
    Sortable.create(target, {
        draggable: 'li',
        animation: 300
    })
}
watch(
    () => store.tabs,
    r => {
        nextTick(() => {
            tagShowPrevNext.value = tags.value.scrollWidth > tags.value.offsetWidth
        })
    },
    { deep: true }
)
// 监听路由改变 若tabs中不存在当前路由，则增加路由
watch(() => route.name, () => {

    // 获取当前路由所在tabs的下标
    const index = tabs.value.findIndex(item => {
        return item.name === route.name
    })
    // 不存在则增加路由到tabs
    index < 0 && store.handleAddRoute(route)
}, {
    immediate: true
})

const currentRouteName = computed(() => {
    return route.name
})

const handleCloseOther = () => {
    // 如果当前路由与右击页签路由不一致，则跳转至右击页签的路由
    if (currentRouteName.value !== tabs.value[currentContextIndex.value].name) {
        router.push({
            name: tabs.value[currentContextIndex.value].name,
            query: tabs.value[currentContextIndex.value].query,
            params: tabs.value[currentContextIndex.value].params
        })
    }
    store.handleCloseOther(currentContextIndex.value)
}

const handleCloseAll = () => {
    router.push({
        name: 'Home'
    })
    store.handleCloseAll()
}

const handleClose = (item, index) => {
    store.handleClose(index)
    // 如果关闭的是当前路由，则跳转到tabs的最后一个路由
    const isCurrentRoute = item.name === currentRouteName.value
    isCurrentRoute && router.push({
        name: tabs.value[tabs.value.length - 1].name,
        query: tabs.value[tabs.value.length - 1].query,
        params: tabs.value[tabs.value.length - 1].params
    })
}

// const handleScroll = e => {
//     const eventDelta = e.wheelDelta || -e.deltaY * 40
//     const $scrollWrapper = scrollContainer.value
//     $scrollWrapper.scrollLeft -= eventDelta / 4
// }

const handleOpenContext = (e, item, index) => {
    clickRoute.value = item
    currentContextIndex.value = index
    contentVisible.value = true
    positionContext.left = e.clientX + 1
    positionContext.top = e.clientY + 1
    nextTick(() => {
        let sp = document.getElementById('contextmenu')
        if (document.body.offsetWidth - e.clientX < sp.offsetWidth) {
            positionContext.left = document.body.offsetWidth - sp.offsetWidth + 1
            positionContext.top = e.clientY + 1
        }
    })
}

watch(contentVisible, val => {
    const _fn = () => {
        contentVisible.value = false
    }
    if (val) {
        window.addEventListener('click', _fn)
    } else {
        window.removeEventListener('click', _fn)
    }
})

onMounted(() => {
    window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
})

const tagReload = () => {
    const nowTag = clickRoute.value
    if (nowTag.path === route.fullPath) {
        reload()
    } else {
        router.push({
            name: nowTag.name,
            query: nowTag.query,
            params: nowTag.params
        })
    }

}

function onScroll() {
    scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop
}

const maximize = () => {
    const nowTag = clickRoute.value
    if (nowTag.path !== route.fullPath) {
        router.push({
            name: nowTag.name,
            query: nowTag.query,
            params: nowTag.params
        })
    }
    document.getElementById('app-main').classList.add('main-page-maximize')
}

const handleScroll = offset => {
    const distance = tags.value.scrollLeft
    const total = distance + offset
    const step = offset / 50
    moveSlow(distance, total, step)
}
const moveSlow = (distance, total, step) => {

    if (step > 0) {
        // 往左滚
        if (distance < total) {
            distance += step
            tags.value.scrollLeft = distance
            window.requestAnimationFrame(() => {
                moveSlow(distance, total, step)
            })
        } else {
            tags.value.scrollLeft = total
        }
    } else {
        // 往右滚
        if (distance > total) {
            distance += step
            tags.value.scrollLeft = distance
            window.requestAnimationFrame(() => {
                moveSlow(distance, total, step)
            })
        } else {
            tags.value.scrollLeft = total
        }
    }
}
</script>

<style lang="scss" scoped>
.topBar-tabs {
    position: fixed;
    top: 50px;
    left: 50%;
    right: 0;
    transition: 0.3s box-shadow 0.2s;
    z-index: 999;
    width: calc(100% - var(--g-main-sidebar-actual-width) - var(--g-sub-sidebar-actual-width));
    transform: translate(-50%) translate(calc(var(--g-main-sidebar-actual-width) / 2)) translate(calc(var(--g-sub-sidebar-actual-width) / 2));
    height: var(--g-tabbar-height);
    background: var(--el-bg-color-overlay);
    &.shadow {
        box-shadow: 0 10px 10px -10px var(--g-box-shadow-color);
    }
    .tag-prev,
    .tag-next {
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        height: 34px;
        background: #fff;
        width: 40px;
        cursor: pointer;
    }
    .tag-prev {
        left: -5px;
    }
    .tag-next {
        right: -5px;
    }
}
.topBar-tabs-list {
    overflow: hidden;
    li {
        font-size: 13px;
        margin-top: 3px;
        position: relative;
        flex-shrink: 0;
        height: 27px;
        line-height: 27px;
        padding: 0 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        margin-left: 4px;
        margin-right: 0;
        background: var(--el-color-info-light-8);
        &:hover {
            background: var(--el-color-primary-light-9);
        }
        a {
            padding: 0 10px;
            width: 100%;
            height: 100%;
            color: #606266;
            text-decoration: none;
            display: flex;
            align-items: center;
            font-size: 13px;
        }
        &::after {
            content: " ";
            width: 1px;
            height: 100%;
            position: absolute;
            right: 0;
            background-image: linear-gradient(#fff, #e6e6e6);
        }
        .el-icon-close {
            margin-left: 10px;
            border-radius: 3px;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    li.active {
        background: var(--el-color-primary) !important;
        a {
            color: #fff;
        }
    }
}
.context-menu {
    position: fixed;
    width: 200px;
    margin: 0;
    border-radius: 0;
    background: #fff;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    z-index: 3000;
    list-style-type: none;
    padding: 10px 0;
    hr {
        margin: 5px 0;
        border: none;
        height: 1px;
        font-size: 0;
        background-color: #ebeef5;
    }
    li {
        display: flex;
        align-items: center;
        margin: 0;
        cursor: pointer;
        line-height: 30px;
        padding: 0 17px;
        color: #606266;
        font-size: 12px;
    }
    li i {
        font-size: 14px;
        margin-right: 10px;
        position: relative;
        top: -2px;
    }
    li:hover {
        background-color: #ecf5ff;
        color: #66b1ff;
    }
    li.disabled {
        cursor: not-allowed;
        color: #bbb;
        background: transparent;
    }
}
.el-scrollbar {
    height: 45px;
}
</style>
