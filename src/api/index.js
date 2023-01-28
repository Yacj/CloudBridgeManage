import axios from 'axios'
// import qs from 'qs'
import router from '@/router/index'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { elAlert, errorMsg } from '@/utils/message'
import qs from 'qs'

const toLogin = () => {
    useUserStore().logout().then(() => {
        router.push({
            name: 'login',
            query: {
                redirect: router.currentRoute.value.path !== '/login' ? router.currentRoute.value.fullPath : undefined
            }
        })
    })
}

const yqUrl = import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true' ? '/yq/' : import.meta.env.VITE_APP_API_BASEURL
const yhUrl = import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true' ? '/yh/' : import.meta.env.VITE_APP_API_USER_BASEURL
const wlUrl = import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true' ? '/wl/' : import.meta.env.VITE_APP_API_WL_BASEURL
const yjUrl = import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true' ? '/yj/' : import.meta.env.VITE_APP_API_YJ_BASEURL
const api = axios.create({
    baseURL: yqUrl,
    timeout: 10000,
    responseType: 'json'
})

api.interceptors.request.use(
    request => {
        const userStore = useUserStore()
        if (request.requestBaseUrl === 'yh') {
            request.baseURL = yhUrl
        }
        if (request.requestBaseUrl === 'wl') {
            request.baseURL = wlUrl
        }
        if (request.requestBaseUrl === 'yj') {
            request.baseURL = yjUrl
        }
        if (userStore.isLogin) {
            request.headers['Authorization'] = userStore.token
        }
        if (request.uploadFile) {
            request.headers['Content-Type'] = 'multipart/form-data'
        }
        // 是否将 POST 请求参数进行字符串化处理
        if (request.method === 'post') {
            // request.data = qs.stringify(request.data, {
            //     arrayFormat: 'brackets'
            // })
        }
        return request
    }
)

api.interceptors.response.use(
    response => {
        /**
         * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
         * 假设返回数据格式为：{ status: 1, error: '', data: '' }
         * 规则是当 status 为 1 时表示请求成功，为 0 时表示接口需要登录或者登录状态失效，需要重新登录
         * 请求出错时 error 会返回错误信息
         */
        const status = response.data.Status
        /*
        * 未来学堂的接口返回的状态码为0是成功 所以 在这做个判断
        *  */
        if (response.config.baseURL === '/wl/' || response.config.baseURL === import.meta.env.VITE_APP_API_WL_BASEURL) {
            return Promise.resolve(response.data)
        } else {
            if (status === 200) {
                return Promise.resolve(response.data)
            } else if (response.data.Data === '身份未验证') {
                elAlert({
                    msg: '身份已过期，请重新登录',
                    type: 'error',
                    confirm: () => {
                        toLogin()
                    }
                })
            } else {
                errorMsg(response.data.Data)
                return Promise.reject(response.data)
            }
        }
    },
    error => {
        let message = error.message
        if (message == 'Network Error') {
            message = '后端网络故障'
        } else if (message.includes('timeout')) {
            message = '接口请求超时'
        } else if (message.includes('Request failed with status code')) {
            message = '接口' + message.substr(message.length - 3) + '异常'
        }
        ElMessage({
            message,
            type: 'error'
        })
        return Promise.reject(error)
    }
)
const request = function({ url, method, data, params, uploadFile, requestBaseUrl, responseType }) {
    const options = {
        url,
        method,
        requestBaseUrl
    }

    if (data) {
        options.data = data
    }

    if (params) {
        options.params = params
    }
    if (requestBaseUrl) {
        options.requestBaseUrl = requestBaseUrl
    }
    if (responseType) {
        options.responseType = responseType
    }
    options.uploadFile = !!uploadFile

    return api(options)
}

request.get = function(url, params, requestBaseUrl, responseType) {
    return request({
        url,
        params,
        requestBaseUrl,
        responseType,
        method: 'get'
    })
}

request.post = function(url, data, requestBaseUrl) {
    return request({
        url,
        data,
        requestBaseUrl,
        method: 'post'
    })
}

request.put = function(url, data) {
    return request({
        url,
        data,
        method: 'put'
    })
}

request.patch = function(url, data) {
    return request({
        url,
        data,
        method: 'patch'
    })
}

request.delete = function(url, data) {
    return request({
        url,
        data,
        method: 'delete'
    })
}
request.upload = function(url, data, requestBaseUrl) {
    return request({
        url,
        data,
        requestBaseUrl,
        method: 'post',
        uploadFile: true
    })
}
export default request
