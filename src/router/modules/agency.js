export default {
    path: '/agency',
    component: () => import('@/layout/index.vue'),
    name: 'agency',
    meta: {
        title: '机构用户'
    },
    children: [
        {
            path: '',
            name: 'agencyIndex',
            component: () => import('@/views/agency/index.vue'),
            meta: {
                title: '机构用户',
                sidebar: false,
                breadcrumb: false
            }
        }
    ]
}
