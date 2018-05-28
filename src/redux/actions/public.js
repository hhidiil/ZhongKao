/**
 * Created by gaoju on 2018/5/28.
 */
import * as TYPES from '../types';

//设置定时state
export function setTiming(type) {
    switch (type.param) {
        case "set" :
            return (dispatch) => {
                dispatch({ type: TYPES.SET_TIMING,result:{flag:false}})
            }
        case "clear" :
            return (dispatch) => {
                dispatch({ type: TYPES.CLEAR_TIMING, result:{flag:true}})
            }
    }

}
//存储每次跳转的前一个路由地址
export function setPreRoute(route) {
    return (dispatch) => {
        dispatch({ type: TYPES.SET_PREROUTE,preRoute:route})
    }
}