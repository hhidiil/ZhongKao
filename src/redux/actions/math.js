/**
 * Created by gaoju on 2017/11/21.
 */
import { request } from './request';

//获取所有练习试题
export function getAllQuestionsList(opt) {
    return (dispatch) => {
        const route = '../src/data/questions.json';//本地数据
        request(route,opt.success, opt.error)
    }
}
//获取某套练习试题
export function getQuestionList(opt) {getExamList
    return (dispatch) => {
        const route = '../src/data/ExamsData/JSON/'+opt.body.param;//本地数据
        request(route,opt.success, opt.error)
    }
}
//获取所有模考试题
export function getAllExamList(opt) {
    return (dispatch) => {
        const route = '../src/data/exam.json';//本地数据
        request(route,opt.success, opt.error)
    }
}
//获取某套模考试题
export function getExamList(opt) {
    return (dispatch) => {
        const route = '../src/data/home.json';//本地数据
        request(route,opt.success, opt.error)
    }
}