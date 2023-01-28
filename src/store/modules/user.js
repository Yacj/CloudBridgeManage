import api from '@/api'

import useRouteStore from './route'
import useMenuStore from './menu'
import { userService } from '@/api/modules/user'
import { local } from '@/utils/local'
import { errorMsg } from '@/utils/message'

const useUserStore = defineStore(
    // 唯一ID
    'user',
    {
        state: () => ({
            account: local.get('account') || '',
            token: local.get('token') || '',
            failure_time: local.get('failure_time') || '',
            userInfo: local.get('userInfo') || {},
            permissions: []
        }),
        getters: {
            isLogin: state => {
                let retn = false
                console.log(state.token)
                if (state.token) {
                    if (new Date().getTime() < state.failure_time * 1000) {
                        retn = true
                    }
                }
                return retn
            }
        },
        actions: {
            login(data) {
                return new Promise((resolve, reject) => {
                    userService.login(data).then(res => {
                        const { UserToken } = res.Data
                        const { RoleItem } = res.Data.Role[0]
                        if (RoleItem === 'admin') {
                            const failure_time = Math.ceil(new Date().getTime() / 1000) + 24 * 60 * 60
                            local.set('userInfo', res.Data)
                            local.set('token', UserToken)
                            local.set('failure_time', failure_time)
                            this.account = data.Username
                            this.userInfo = res.Data
                            this.token = UserToken
                            this.failure_time = failure_time
                            resolve(res)
                        } else {
                            errorMsg('您的角色非管理员，无法登录')
                            reject(res)
                        }
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            logout() {
                return new Promise(resolve => {
                    const routeStore = useRouteStore()
                    const menuStore = useMenuStore()
                    local.remove('token')
                    local.remove('failure_time')
                    local.remove('userInfo')
                    this.token = ''
                    this.failure_time = ''
                    this.userInfo = {}
                    routeStore.removeRoutes()
                    menuStore.setActived(0)
                    resolve()
                })
            },
            updateUserInfo(token) {
                if (this.userInfo.length > 0) {
                    this.userInfo.HeadImg = ''
                }
                return new Promise((resolve, reject) => {
                    userService.get_User_Info({ token }).then(res => {
                        local.set('userInfo', res.Data)
                        this.userInfo = res.Data
                        resolve(res.Data)
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            getPermissions() {
                return new Promise(resolve => {
                    this.permissions = [
                        'permission.browse',
                        'permission.create',
                        'permission.edit',
                        'permission.remove'
                    ]
                    resolve([
                        'permission.browse',
                        'permission.create',
                        'permission.edit',
                        'permission.remove'
                    ])
                })
            },
            editPassword(data) {
                return new Promise(resolve => {
                    api.post('member/edit/password', {
                        account: this.account,
                        password: data.password,
                        newpassword: data.newpassword
                    }, {
                        baseURL: '/mock/'
                    }).then(() => {
                        resolve()
                    })
                })
            }
        }
    }
)

export default useUserStore
