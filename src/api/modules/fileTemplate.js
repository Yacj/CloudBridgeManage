import request from '@/api'

export const fileTemplateService = {
    // 获取文件模板列表
    get_list: params => {
        return request.get('/template/file/get_list', params)
    },
    get_list_report: params => {
        return request.get('/template/file/get_list_report', params)
    },
    file_upload: params => {
        return request.upload('/template/file/upload', params)
    },
    get_report: params => {
        return request.get('/template/file/get_report', params)
    },
    upload_report: params => {
        return request.upload('/template/file/upload_report', params)
    },
    edit: params => {
        return request.post('/template/file/edit', params)
    },
    get_details: params => {
        return request.get('/template/file/get_details', params)
    },
    publish: params => {
        return request.get('/template/file/publish', params)
    },
    delete: params => {
        return request.get('/template/file/delete', params)
    },
    lower: params => {
        return request.get('/template/file/lower', params)
    }
}
