/**
 * Created by gaoju on 2017/11/21.
 */
import { request } from './request';
import * as TYPES from '../types';

//获取所有练习试题
export function getAllQuestionsList(opt) {
    return (dispatch) => {
        const route = '../src/data/questions.json';//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.ALLQUESTIONSLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error)
    }
}
//获取某套练习试题
export function getQuestionList(opt) {getExamList
    return (dispatch) => {
        const route = '../src/data/ExamsData/JSON/'+opt.body.param;//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.QUESTIONSLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error)
    }
}
//获取所有模考试题
export function getAllExamList(opt) {
    return (dispatch) => {
        const route = '../src/data/exam.json';//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.ALLEXAMLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error)
    }
}
//获取某套模考试题
export function getExamList(opt) {
    return (dispatch) => {
        const route = '../src/data/home.json';//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.EXAMLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error)
    }
}