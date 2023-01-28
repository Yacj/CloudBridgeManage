import { defineStore } from 'pinia'
import session from '@/utils/session'

const homePage = {
    name: 'dashboard',
    path: '/dashboard',
    title: '控制面板'
}// 默认路由

const noPushRoutes = ['notFound', 'login', 'reload'] // 不需要路由跳转的路由
export const useTagsStore = defineStore({
    id: 'Tags',
    state: () => ({
        tabs: session.get('tabs') || [homePage]
    }),
    getters: {},
    actions: {
        // 设置缓存
        setStorage() {
            session.set('tabs', this.tabs)
        },
        // 增加路由
        handleAddRoute(route) {
            if (!route.name) return
            // 匹配不到路由
            if (noPushRoutes.includes(route.name)) return
            this.tabs.push({
                name: route.name,
                path: route.path,
                title: route.meta.title,
                activePath: route.meta.activeMenu,
                query: route.query,
                params: route.params
            })
            this.setStorage()
        },
        // 关闭路由
        handleClose(index) {
            this.tabs.splice(index, 1)
            this.setStorage()
        },
        // 关闭其他路由
        handleCloseOther(index) {
            // 通过传入的下标，保存该路由与首页
            const obj = JSON.parse(JSON.stringify(this.tabs[index]))
            this.tabs = obj.name === 'dashboard'
                ? [
                    homePage
                ]
                : [
                    homePage,
                    obj
                ]
            this.setStorage()
        },
        // 关闭全部路由
        handleCloseAll() {
            this.tabs = [
                homePage
            ]
            this.setStorage()
        }
    }
})
