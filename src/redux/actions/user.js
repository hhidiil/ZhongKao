/**
 * 用户信息模块action
 * Created by gaoju on 2017/11/15.
 */
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { request } from './request';
import { bodyUrlencoded } from '../../method_public/public'

export function login(opt) {
    return (dispatch) => {
        const route = '/api/user/token';
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
export function register(opt) {
    return (dispatch) => {
        const route = '/api/user/password';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}