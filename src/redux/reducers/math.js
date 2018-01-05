/**
 * Created by gaoju on 2017/12/7.
 */
import Immutable from 'immutable';
import * as TYPES from '../types'
import { createReducer } from 'redux-immutablejs'

export const AllQuestionsList = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.ALLQUESTIONSLIST_UPDATE]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))//merge合并
    },
    [TYPES.ALLQUESTIONSLIST_CLEAN]: (state, action) => {
        return state.clear().set('preload', false)
    }
})
export const QuestionList = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.QUESTIONSLIST_UPDATE]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    }
})
export const AllExamList = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.ALLEXAMLIST_UPDATE]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    }
})
export const ExamList = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.EXAMLIST_UPDATE]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    }
})
export const GetQuestion = createReducer(Immutable.fromJS({preload:false}),{
    [TYPES.GETMAINQUESTION_UPDATA]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    }
})
export const TimingFlag = createReducer(Immutable.fromJS({preload:false}),{
    [TYPES.SET_TIMING]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    },
    [TYPES.CLEAR_TIMING]: (state, action) => {
        return state.clear().set('preload', false).merge(Immutable.fromJS(action.result))
    }
})