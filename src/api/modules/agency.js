import request from '@/api'

export const agencyService = {
    // 获取机构列表
    get_list: params => {
        return request.get('/Agency/GetList', params,'yh')
    }
}
