/**
 * Created by gaoju on 2017/12/7.
 */
import Immutable from 'immutable';
import * as TYPES from '../types'
import { createReducer } from 'redux-immutablejs'


export const AllQuestionsList = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.ALLQUESTIONSLIST_UPDATE]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
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
