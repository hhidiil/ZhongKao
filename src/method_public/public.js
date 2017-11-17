/**
 * 前端公用方法
 * Created by gaoju on 2017/11/15.
 */

export function bodyUrlencoded(body) {
    let data = Object.entries(body);
    let str = `${data[0][0]}=${data[0][1]}`;
    data.forEach((item,i) => {
        if (i>0) {
            str+= `&&${item[0]}=${item[1]}`;
        }
    })
    return str
}

export function parseURL(url) {
    let _url = url.replace(/&/g,'*')
    return _url
}

export function limitStringlength(str, length) {
    return str.substr(0, length) + '...'
}