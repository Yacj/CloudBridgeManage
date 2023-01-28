import { reactive, toRefs } from 'vue'

export default function usePagination(
    callback,
    options = {
        pageSize: 10
    }
) {
    console.log(options)
    const pagination = reactive({
        showPagination: true,
        paginationConfig: {
            total: 10,
            pageSize: options.pageSize,
            currentPage: 1,
            background: true
        },
        onChange: page => {
            pagination.paginationConfig.currentPage = page
            callback && callback()
        },
        onPageSizeChange: size => {
            pagination.paginationConfig.currentPage = 1
            pagination.paginationConfig.pageSize = size
            callback && callback()
        }
    })
    const changeCurrent = pagination.onChange
    const changePageSize = pagination.onPageSizeChange
    const setTotal = total => {
        pagination.paginationConfig.total = total
    }
    const { total, pageSize, currentPage } = toRefs(pagination)
    return {
        pagination,
        changeCurrent,
        changePageSize,
        setTotal,
        total,
        pageSize,
        currentPage
    }
}
