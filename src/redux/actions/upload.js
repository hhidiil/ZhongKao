/**
 * Created by gaoju on 2018/1/16.
 */
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { requestData } from '../../method_public/public'

export function upload(opt) {
    return () => {
        const route = '/api/upload';
        requestData(route,opt.body,opt.callback)
    }
}