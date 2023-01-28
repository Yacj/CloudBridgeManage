 const session = {
    set(table, settings) {
        const _set = JSON.stringify(settings)
        return sessionStorage.setItem(table, _set)
    },
    get(table) {
        let data = sessionStorage.getItem(table)
        try {
            data = JSON.parse(data)
        } catch (err) {
            return null
        }
        return data
    },
    remove(table) {
        return sessionStorage.removeItem(table)
    },
    clear() {
        return sessionStorage.clear()
    }
}

export default session;
