import request from '@/api'

export const panelService = {
    total: params => {
        return request.get('/manage/panel/total', params)
    },
    agency_user: params => {
        return request.get('/manage/panel/agency_user', params)
    },
    train_subject: params => {
        return request.get('/manage/panel/train_subject', params)
    },
    train_works: params => {
        return request.get('/manage/panel/train_works', params)
    },
    train_report: params => {
        return request.get('/manage/panel/train_report', params)
    },
    log_list: params => {
        return request.get('/manage/panel/log_list', params)
    }
}
