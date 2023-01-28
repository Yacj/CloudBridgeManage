import request from '@/api'

export const userService = {
    login(params) {
        return request.post('/User/Login', params, 'yh')
    },
    get_User_Info: params => {
        return request.get('/User/GetUserInfo', params, 'yh')
    },
    Edit_yq: params => {
        return request.post('/User/Edit_yq', params, 'yh')
    },
    upload_HeadImg: params => {
        return request.post('/User/upload_HeadImg', params, 'yh')
    },
    UpdatePwd_Old: params => {
        return request.get('/User/UpdatePwd_Old', params, 'yh')
    },
    // 验证码
    setcode_verificat: params => {
        return request.get('/User/setcode_verificat', params, 'yh')
    },
    setcode_mobile: params => {
        return request.get('/User/setcode_mobile', params, 'yh')
    },
    UpdatePwd_Tel: params => {
        return request.get('/User/UpdatePwd_Tel', params, 'yh')
    }
}
