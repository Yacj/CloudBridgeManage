import { ElMessage, ElMessageBox } from 'element-plus'

const message = (message, type) => {
    ElMessage({
        showClose: true,
        message,
        type
    })
}

// 成功提示
const successMsg = msg => {
    message(msg, 'success')
}

// 消息
const infoMsg = msg => {
    message(msg, 'info')
}
// 错误
const errorMsg = msg => {
    message(msg, 'error')
}

// 警告
const warning = msg => {
    message(msg, 'warning')
}

/**
 * elAlert-全局提示框
 * @param title 标题
 * @param msg 信息
 * @param type 图标类型
 * @param confirm 确认函数
 * @param confirmText 按钮文字
 */
const elAlert = ({ title, msg, type, confirm, confirmText }) => {
    if (!title) {
        title = '提示'
    }
    if (!msg) {
        msg = '错误'
    }
    if (!confirmText) {
        confirmText = '确定'
    }
    ElMessageBox.alert(msg, title, {
        confirmButtonText: confirmText,
        type
    }).then(confirm || (() => {
    }))
}

/**
 * @description elConfirm 提示框
 * @param title 标题
 * @param msg 信息
 * @param ok ok函数
 * @param okText ok按钮文字
 * @param cancel 取消函数
 * @param cText cancel按钮文字
 */
const elConfirm = ({ title, msg, ok, okText, cancel, cText }) => {
    ElMessageBox.confirm(msg, title || '提示', {
        confirmButtonText: okText || '确定',
        cancelButtonText: cText || '取消'
    }).then(ok || (() => {
    })).catch(cancel || (() => {
    }))
}
export {
    successMsg,
    infoMsg,
    errorMsg,
    warning,
    elAlert,
    elConfirm
}
