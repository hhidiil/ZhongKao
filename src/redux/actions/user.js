/**
 * 用户信息模块action
 * Created by gaoju on 2017/11/15.
 */
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { request } from './request';
import { bodyUrlencoded } from '../../method_public/public'
import fetch from 'isomorphic-fetch'

export function login(opt) {
    //return (dispatch) => {
    //    const route = '/api/user/token';//服务端数据
    //    request(route, {}, dispatch, opt.success, opt.error,
    //        { method: 'POST',
    //            headers: {"Content-Type": "application/x-www-form-urlencoded"},
    //            body: bodyUrlencoded(opt.body) })
    //}
    return (dispatch) => {
        const route = '../src/data/userInfo.json';//本地数据
        requestData(route,opt.success, opt.error)
    }
}
export function changePassword(opt) {
    return (dispatch) => {
        const route = '/api/user/password';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
export function register(opt) {
    return (dispatch) => {
        const route = '/api/user/password';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//数据获取方法目前先写在这里，在后面再把用户和页面数据分开写
export function getHomeShowList(opt) {
    return (dispatch) => {
        const route = '../src/data/home.json';//本地数据
        requestData(route,opt.success, opt.error)
    }
}
//获取所有练习试题
export function getAllQuestionsList(opt) {
    return (dispatch) => {
        const route = '../src/data/questions.json';//本地数据
        requestData(route,opt.success, opt.error)
    }
}
//获取某套练习试题
export function getQuestionList(opt) {getExamList
    return (dispatch) => {
        const route = '../src/data/home.json';//本地数据
        requestData(route,opt.success, opt.error)
    }
}
//获取所有模考试题
export function getAllExamList(opt) {
    return (dispatch) => {
        const route = '../src/data/exam.json';//本地数据
        requestData(route,opt.success, opt.error)
    }
}
//获取某套模考试题
export function getExamList(opt) {
    return (dispatch) => {
        const route = '../src/data/home.json';//本地数据
        requestData(route,opt.success, opt.error)
    }
}
function requestData(url,success=null, error=null){
    console.log("url:-->"+url)
    fetch(url).then(function (res) {
                return res.json()
             }).then(function (json) {
                success && success(JSON.stringify(json))
            }).catch((err) => {
                console.warn(err)
                error(err)
            });
}