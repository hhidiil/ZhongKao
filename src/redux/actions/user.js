/**
 * 用户信息模块action
 * Created by gaoju on 2017/11/15.
 */
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { request } from './request';
import { bodyUrlencoded,requestData } from '../../method_public/public'

//获取数据的方式先 全部使用 GET。用真实数据时使用POST方式----<<------看这里!!!------------
export function auth(opt) {
    return (dispatch) => {
        const route = `/api/page/auth`;
        request(route, {}, dispatch, opt.success, opt.error, { method: 'POST', headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: bodyUrlencoded(opt.body) })
    }
}
export function allUsers(opt) {
    return (dispatch) => {
        const route = '/api/user';//服务端数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'GET',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
export function login(opt) {
    return (dispatch) => {
        const route = '/api/user/token';//服务端数据
        //const route = '../src/data/userInfo.json';//本地数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
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
export function forgetPassword(opt) {
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
export function getUserBasicInfo(opt) {
    return (dispatch) => {
        const route = '/api/carousel';
        const success = (data) => {
            dispatch({ type: TYPES.USERBASICINFO_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route, opt.params || {}, dispatch, success, opt.error)
    }
}
