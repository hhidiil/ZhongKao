/**
 * 前端公用方法
 * Created by gaoju on 2017/11/15.
 */
import 'babel-polyfill'
import fetch from 'isomorphic-fetch'

//简单版 fetch数据请求
export function requestData(url){
    console.log(url)
    return fetch(url)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            const error = new Error(response.statusText);
            error.response = response;
            throw error;
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.warn(err)
            return err
        })
}
//判断用户是否登录
export function isAdmin(){
    let token = sessionStorage.getItem('token');
    let username = sessionStorage.getItem('username');
    console.log("session username------>",token,username)
    if(!username){
        return false;
    }else{
        return true;
    }
}
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
    let _url = url.replace(/&/g,'*');
    return _url
}

export function limitStringlength(str, length) {
    return str.substr(0, length) + '...'
}