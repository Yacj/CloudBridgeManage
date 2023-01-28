import request from '@/api'

export const empowerService = {
    get_School: params => {
        return request.get('/manage/empower/get_school', params)
    },
    get_ts: params => {
        return request.get('/manage/empower/get_ts', params)
    },
    post_Sync: params => {
        return request.post('/manage/empower/sync', params)
    },
    post_Add: params => {
        return request.post('/manage/empower/add', params)
    },
    get_list: params => {
        return request.get('/manage/empower/get_list', params)
    },
    get_details: params => {
        return request.get('/manage/empower/details', params)
    },
    post_update: params => {
        return request.post('/manage/empower/update', params)
    }
}
