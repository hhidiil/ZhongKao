/**
 * Created by gaoju on 2017/11/21.
 */
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { request } from './request';
import { bodyUrlencoded } from '../../method_public/public'

export function getMath(opt) {
    return (dispatch) => {
        const route = '/api/math';
        const success = (data) => {
            dispatch({ type: TYPES.CAROUSEL_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route, opt.params || {}, dispatch, success, opt.error)
    }
}