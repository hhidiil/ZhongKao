/**
 * 公共方法，里面的anction 都是可以用来设置全局 state的
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
export function setPreRoute(route,param) {
    return (dispatch) => {
        if(param == 'add'){
            dispatch({ type: TYPES.ADD_PREROUTE,preRoute:route})
        }else if(param == 'del'){
            dispatch({ type: TYPES.DEL_PREROUTE,preRoute:route})
        }
    }
}
//更新store中的headimg
export function updateStoreHeadImg(param) {
    let head = param.data;
    let flag = param.clear;
    return (dispatch) => {
        if(!flag){
            dispatch({ type: TYPES.USERHEADIMG_UPDATA, result: {headimg:head} })
        }else {
            dispatch({ type: TYPES.USERHEADIMG_CLEAN, result: {} })
        }
    }
}
/*
 * 做二测的时候，知识点弹框显示试题，可以多次弹框，此处添加全局index，
 * 每次弹框加1，设置不同的id，用来处理每一个弹框中编辑器UE.Editor的创建与销毁，
 * 因为不同页面不能共用同一个编辑器
 * */
export function createEditIndex(type,param=0) {
    return (dispatch) => {
        if(type=='set') {
            dispatch({type: TYPES.UE_EDITOR_SET, payload: param})
        }
        if(type=='add'){
            dispatch({ type: TYPES.UE_EDITOR_ADD})
        }
        if(type=='delete') {
            dispatch({ type: TYPES.UE_EDITOR_DEL})
        }
    }
}