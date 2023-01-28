export default [
    {
        path: '/templateManage',
        name: 'templateManage',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '模板管理'
        },
        children: [
            {
                path: '',
                name: 'templateManageIndex',
                component: () => import('@/views/template_manage/index.vue'),
                meta: {
                    title: '模板管理',
                    breadcrumb: false,
                    sidebar: false
                }
            },
            {
                path: 'add',
                name: 'templateManageAdd',
                component: () => import('@/views/template_manage/add.vue'),
                meta: {
                    title: '新建模板',
                    sidebar: false,
                    activeMenu: '/templateManage'
                }
            }
        ]
    },
    {
        path: '/templateManage/report',
        name: 'templateManageReport',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '报告管理'
        },
        children: [
            {
                path: '',
                name: 'templateManageReportIndex',
                component: () => import('@/views/template_manage/report.vue'),
                meta: {
                    title: '报告管理',
                    breadcrumb: false,
                    sidebar: false
                }
            }
        ]
    }
]
