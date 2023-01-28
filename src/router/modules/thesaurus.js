export default [
    {
        path: '/thesaurus',
        name: 'thesaurus',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '词库管理'

        },
        children: [
            {
                path: '',
                name: 'thesaurusIndex',
                component: () => import('@/views/thesaurus/index.vue'),
                meta: {
                    title: '词库管理',
                    breadcrumb: false,
                    sidebar: false
                }
            }
        ]
    }
]
