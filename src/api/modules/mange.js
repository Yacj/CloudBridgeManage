import request from '@/api'

export const mangeService = {
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
    },
    post_word_upload: params => {
        return request.post('/manage/word/upload', params)
    },
    get_wordType_add: params => {
        return request.get('/manage/word/type_add', params)
    },
    get_word_type: params => {
        return request.get('/manage/word/type_get', params)
    },
    post_word_add: params => {
        return request.post(`/manage/word/add?TypeID=${params.TypeID}&Word=${params.Word}`)
    },
    get_word: params => {
        return request.get('/manage/word/get', params)
    }
}
