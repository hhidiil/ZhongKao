/**
 * 前端公用方法
 * Created by gaoju on 2017/11/15.
 */
import 'babel-polyfill'
import fetch from 'isomorphic-fetch'

//简单版 fetch数据请求
export function requestData(url,data,callback){
    console.log(url,data)
    return fetch(url,data)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            const error = new Error(response.statusText);
            error.response = response;
            throw error;
        })
        .then((res) => {
            return callback(res)
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
    if(body){
        let data = Object.entries(body);
        let str = `${data[0][0]}=${data[0][1]}`;
        data.forEach((item,i) => {
            if (i>0) {
                str+= `&&${item[0]}=${item[1]}`;
            }
        })
        return str
    }else {
        return ''
    }
}
export function parseURL(url) {
    let _url = url.replace(/&/g,'*');
    return _url
}

export function limitStringlength(str, length) {
    return str.substr(0, length) + '...'
}
//img加载处理，当没有正常加载显示时使用默认图片
export function handleImg(url){
    if(url){
        return url;
    }else {
        return 'public/images/default.jpg';
    }
}
//上传图片文件格式判断
export function beforeUpload(file) {
    if(file){
        const isJPG = file.type === 'image/png';
        const isNameType = file.name;
        if (!isJPG) {
            alert('只能上传png格式的图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            alert('图片大小不能大于2M!');
        }
        return isJPG && isLt2M;
    }else {
        alert("请选择上传文件！")
        return false
    }
}
//年级格式转换
export function exchangeGrade(data) {
    if(data){
        let grade = data.toString();
        switch (grade) {
            case '1':return '一年级';
            case '2':return '二年级';
            case '3':return '三年级';
            case '4':return '四年级';
            case '5':return '五年级';
            case '6':return '六年级';
            case '7':return '初一';
            case '8':return '初二';
            case '9':return '初三';
            default:
                return ''
        }
    }else {
        return ''
    }
}