export default [
    {
        name: 'authorize',
        path: '/authorize',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '授权管理'
        },
        children: [
            {
                path: '',
                name: 'authorizeIndex',
                component: () => import('@/views/authorize/index.vue'),
                meta: {
                    title: '授权管理',
                    breadcrumb: false,
                    sidebar: false

                }
            },
            {
                path: 'edit',
                name: 'authorizeEdit',
                component: () => import('@/views/authorize/edit.vue'),
                meta: {
                    title: '编辑授权',
                    sidebar: false,
                    activeMenu: '/authorize'
                }
            }
        ]
    },
    {
        name: 'authorizeAdd',
        path: '/authorize/add',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '新增授权'
        },
        children: [
            {
                path: '',
                name: 'authorizeAddIndex',
                component: () => import('@/views/authorize/add.vue'),
                meta: {
                    title: '新增授权',
                    breadcrumb: false,
                    sidebar: false
                }
            }
        ]
    }
]
