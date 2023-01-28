import request from '@/api'

export const wordService = {
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
