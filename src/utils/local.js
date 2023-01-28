const localKey = 'wlxt-manage-'
export const local = {
    get: key => {
        return JSON.parse(localStorage.getItem(localKey + key))
    },
    set: (key, value) => {
        return localStorage.setItem(localKey + key, JSON.stringify(value))
    },
    remove: key => {
        localStorage.removeItem(localKey + key)
    },
    clear: () => {
        localStorage.clear()
    }
}
