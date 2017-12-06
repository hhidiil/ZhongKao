/**
 * Created by gaoju on 2017/12/6.
 */
import Immutable from 'immutable';
import * as TYPES from '../types'
import { createReducer } from 'redux-immutablejs'

//Immutable创建的对象数据是持久化，不变话的。只要新建的或者赋值都会产生新的数据对象
export const basicInfo = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.BASICINFO_UPDATA]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    },
    [TYPES.BASICINFO_CLEAN]: (state, action) => {
        return state.clear().set('preload', false)
    },
})