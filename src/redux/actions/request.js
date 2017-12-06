/**
 * 网络请求
 * Created by gaoju on 2017/11/15.
 */

// fetch 需要使用 Promise 的 polyfill
import { pendingTask, begin, end } from 'react-redux-spinner'
import 'babel-polyfill'
import fetch from 'isomorphic-fetch'
import * as CONFIG from '../../config'
import * as TYPES from '../types'

export function request(route, params, dispatch, success=null, error=null, { method='GET', headers={}, body=null }={}) {

     //if (method !== 'GET') dispatch({ type: TYPES.REQUEST_LOADING })
    //请求开始
    dispatch({type: TYPES.REQUEST_LOADING, [ pendingTask ]: begin})

    const p = params ? '?' + Object.entries(params).map((i) => `${i[0]}=${encodeURI(i[1])}`).join('&') : '';
    const url = `${ CONFIG.API_URI }${ route }${ p }`;
    let data = { method: method, headers: headers}
    if (method !== 'GET') data.body = body
    console.log(`[${method}]:${url}`)
    fetch(url, data)
        .then((response) => {
             dispatch({ type: TYPES.REQUEST_DONE, [ pendingTask ]: end})
            if (response.status === 200) {
                return response.json()
            } else {
                return { code: response.status }
            }
        })
        .then((res) => {
            if (res.code === 200) {
                 //if (method !== 'GET') dispatch({ type: TYPES.REQUEST_SUCCESS })
                dispatch({ type: TYPES.REQUEST_SUCCESS })
                success && success(res.data)
            } else {
                dispatch({ type: TYPES.REQUEST_ERROR, res })
                error && error(res.message)
            }
        })
        .catch((err) => {
            console.warn(err)
        })
}

export function requestClean() {
    return { type: TYPES.REQUEST_CLEAN }
}