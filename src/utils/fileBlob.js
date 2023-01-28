import axios from 'axios'

export default function getFileBlob(url) {
    return axios({
        method: 'get',
        url,
        responseType: 'blob'
    })
}
