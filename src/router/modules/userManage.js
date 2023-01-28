export default [
    {
        path: '/userManage',
        component: () => import('@/layout/index.vue'),
        name: 'userManage',
        meta: {
            title: '用户管理'
        },
        children: [
            {
                path: '',
                name: 'userManageIndex',
                component: () => import('@/views/user_manage/index.vue'),
                meta: {
                    title: '用户管理',
                    sidebar: false,
                    breadcrumb: false
                }
            }
        ]
    },
    {
        path: '/userManage/role',
        component: () => import('@/layout/index.vue'),
        name: 'userManageRole',
        meta: {
            title: '角色管理'
        },
        children: [
            {
                path: '',
                name: 'userManageRoleIndex',
                component: () => import('@/views/user_manage/role.vue'),
                meta: {
                    title: '角色管理',
                    sidebar: false,
                    breadcrumb: false
                }
            }
        ]
    }
]

