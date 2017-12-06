/**
 * Created by gaoju on 2017/11/15.
 */

import * as TYPES from '../types';
import { request } from './request';
import { bodyUrlencoded } from '../../method_public/public'

//首页展示列表
export function getHomeShowList(opt) {
    return (dispatch) => {
        const route = '../src/data/home.json';//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.HOMESHOW_LIST_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error)
    }
}

export function updateCurrentPage(opt) {
    return (dispatch) => {
        dispatch({ type: TYPES.PAGE_UPDATE_CURRENT, result: opt.data })
    }
}

export function cleanCurrentPage(opt) {
    return (dispatch) => {
        dispatch({ type: TYPES.PAGE_CLEAN_CURRENT})
    }
}
