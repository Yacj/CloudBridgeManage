import pinia from '@/store'
import useSettingsStore from '@/store/modules/settings'

// 固定路由（默认路由）
let constantRoutes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test.vue'),
        meta: {
            title: '测试'
        }
    },
    {
        path: '/:all(.*)*',
        name: 'notFound',
        component: () => import('@/views/[...all].vue'),
        meta: {
            title: '找不到页面'
        }
    }
]

// 系统路由
let systemRoutes = [
    {
        path: '/dashboard',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: () => {
                return useSettingsStore().dashboard.title
            },
            breadcrumb: false
        },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/views/index.vue'),
                meta: {
                    title: () => {
                        return useSettingsStore().dashboard.title
                    },
                    breadcrumb: false
                }
            }
        ]
    },
    {
        path: '/personal',
        component: () => import('@/layout/index.vue'),
        redirect: '/personal/setting',
        meta: {
            title: '个人中心',
            breadcrumb: false
        },
        children: [
            {
                path: 'setting',
                name: 'personalSetting',
                component: () => import('@/views/personal/setting.vue'),
                meta: {
                    title: '个人设置',
                    i18n: 'route.personal.setting',
                    cache: 'personalEditPassword'
                }
            },
            {
                path: 'edit/password',
                name: 'personalEditPassword',
                component: () => import('@/views/personal/edit.password.vue'),
                meta: {
                    title: '修改密码',
                    i18n: 'route.personal.editpassword'
                }
            }
        ]
    },
    {
        path: '/reload',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '重新加载',
            breadcrumb: false
        },
        children: [
            {
                path: '',
                name: 'reload',
                component: () => import('@/views/reload.vue'),
                meta: {
                    title: '重新加载',
                    breadcrumb: false
                }
            }
        ]
    }
]

// 动态路由（异步路由、导航栏路由）
let asyncRoutes = [
    {
        meta: {
            title: '控制面板',
            icon: 'sidebar-dashboard'
        },
        children: [
            {
                path: '/dashboard',
                component: () => import('@/layout/index.vue'),
                name: 'dashboard',
                meta: {
                    title: '控制面板'
                },
                children: [
                    {
                        path: '',
                        name: 'dashboardIndex',
                        component: () => import('@/views/index.vue'),
                        meta: {
                            title: '控制面板',
                            breadcrumb: false,
                            sidebar: false
                        }
                    }
                ]
            }
        ]
    },
    // {
    //     meta: {
    //         title: '机构管理',
    //         icon: 'sidebar-agency'
    //     },
    //     children: [agency]
    // },
    // {
    //     meta: {
    //         title: '用户管理',
    //         icon: 'sidebar-userSet'
    //     },
    //     children: [...userManage]
    // },
    {
        meta: {
            title: '授权管理',
            icon: 'sidebar-authorize'
        },
        children: [...authorize]
    },
    {
        meta: {
            title: '模板管理',
            icon: 'sidebar-template'
        },
        children: [...template]
    },
    {
        meta: {
            title: '词库管理',
            icon: 'sidebar-thesaurus'
        },
        children: [...thesaurus]
    }
]

import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import userManage from '@/router/modules/userManage'
import agency from '@/router/modules/agency'
import authorize from '@/router/modules/authorize'
import template from '@/router/modules/template.js'
import thesaurus from '@/router/modules/thesaurus'

if (useSettingsStore(pinia).app.routeBaseOn === 'filesystem') {
    constantRoutes = generatedRoutes.filter(item => {
        return item.meta?.enabled !== false && item.meta?.constant === true
    })
    asyncRoutes = setupLayouts(generatedRoutes.filter(item => {
        return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false
    }))
}

export {
    constantRoutes,
    systemRoutes,
    asyncRoutes
}
