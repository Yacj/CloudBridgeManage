import { ref } from 'vue'

export default function useTableProps(loadListFunc) {
    const defaultProps = {
        border: true,
        align: 'center',
        headerAlign: 'center',
        stripe: true,
        resizable: true,
        round: true,
        columns: [
            {
                title: '机构名称',
                field: 'SchoolName'
            },
            {
                title: '授权时间（开始-结束）',
                field: 'Time',
                slots: {
                    default: 'time'
                }
            },
            {
                title: '授权状态',
                field: 'Status'
            },
            {
                title: '操作',
                slots: {
                    default: 'operation'
                }
            }
        ],
        data: [],
        loading: false,
        rowConfig: {
            isHover: true
        },
        pagerConfig: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200, 500],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
        }
    }
    const propsRes = ref(defaultProps)
    const setLoading = loading => {
        propsRes.value.loading = loading
    }

    const setPagination = ({ total, currentPage }) => {
        propsRes.value.pagerConfig.currentPage = currentPage
        total && (propsRes.value.pagerConfig.total = total)
    }

    const setProps = params => {
        for (let key in params) {
            defaultProps[key] = params[key]
        }
    }
    const loadListParams = ref({})
    const setLoadListParams = params => {
        loadListParams.value = params
    }

    const loadList = async() => {
        setLoading(true)
        let data = await loadListFunc({
            ...propsRes.value.pagerConfig,
            ...loadListParams.value
        })
        propsRes.value.data = data.list
        setPagination({ current: data.current, total: data.total })
        setLoading(false)
        return data
    }

    const propsEvent = ref({
        changePage: ({ currentPage, pageSize }) => {
            propsRes.value.pagerConfig.currentPage = currentPage
            propsRes.value.pagerConfig.pageSize = pageSize
            loadList()
        }
    })

    return {
        propsRes,
        propsEvent,
        setProps,
        setLoading,
        loadList,
        setPagination,
        setLoadListParams
    }
}
