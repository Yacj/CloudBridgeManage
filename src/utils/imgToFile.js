export  function imgToBase64(url, cb) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image

    img.crossOrigin = 'Anonymous'
    img.onload = function() {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        var dataURL = canvas.toDataURL('image/png')
        cb && cb(dataURL)
        canvas = null
    }
    img.src = url
}
// base64转file对象
export  function base64toFile(base, filename) {
    var arr = base.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var suffix = mime.split('/')[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    // 转换成file对象
    return new File([u8arr], `${filename}.${suffix}`, { type: mime })
}
