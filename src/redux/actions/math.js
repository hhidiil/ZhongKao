/**
 * Created by gaoju on 2017/11/21.
 */
import { request,requestSyn } from './request';
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { bodyUrlencoded } from '../../method_public/public'

//获取所有练习试卷
export function getAllQuestionsList(opt) {
    return (dispatch) => {
        //const route = '../src/data/questions.json';//本地数据
        const route = '/api/math/allPapers';
        const success = (data) => {
            dispatch({ type: TYPES.ALLQUESTIONSLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        //使用fetch发送数据时，headers格式如果是这种形式（默认）{"Content-Type": "application/x-www-form-urlencoded"}
        // 则body里面的参数格式应该为“a="paramsa&b=paramsb....."”
        console.log(opt.body);
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某套练习试卷的所有试题（即：1-25道考试题题目）
export function getQuestionList(opt) {
    return (dispatch) => {
        //const route = '../src/data/ExamsData/JSON/'+opt.body.param;//本地数据
        const route = '/api/math/questionsOfPaper';
        const success = (data) => {
            dispatch({ type: TYPES.QUESTIONSLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某个主试题的信息
export function getQuestion(opt) {
    return (dispatch) => {
        //const route = 'src/data/ExamsData/JSON/Question/'+opt.param;//本地数据
        const route = '/api/math/question';
        const success = (data) => {
            dispatch({ type: TYPES.GETMAINQUESTION_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某个试题的所有子试题（即：主题，观察，考点，分析。。。）
export function getAllChildOfQuestion(opt) {
    return (dispatch) => {
        const route = '/api/math/allChildOfQuestion';
        const success = (data) => {
            dispatch({ type: TYPES.SECONDTESTQUESTIONS_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//查询二测中某个试题的子题内容（观察or分析or 。。。）
export function getContentOfChildItems(opt) {
    return (dispatch) => {
        const route = '/api/math/contentOfChildItems';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
export function getContentOfChildItemsForQues(opt) {
    return (dispatch) => {
        const route = '/api/math/contentOfChildItemsForQues';
        const success = (data) => {
            dispatch({ type: TYPES.GETCONTENTOFCHILDQUES_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某道大题的小问题的子题信息
export function getChildQuestionsForQuestion(opt) {
    return (dispatch) => {
        const route = '/api/math/childQuestionsForQuestion';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取一测试卷的做题详情
export function getFirstDataOfPaper(opt) {
    return (dispatch) => {
        const route = '/api/math/firstDataOfPaper';
        const success = (data) => {
            dispatch({ type: TYPES.GETFIRSTDATAOFPAPER, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取知识点对应的试题
export function getKnowledgeIdList(opt) {
    return (dispatch) => {
        const route = '/api/math/knowledgeIdList';
        const success = (data) => {
            dispatch({ type: TYPES.GETFIRSTDATAOFPAPER, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//存储用户试卷的做题数据
export function sentUserPaperData(opt) {
    let data = opt.body.data;
    return (dispatch) => {
        const route = '/api/math/sentUserPaperData';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data)})
    }
}
export function setThematicQuestionAnswerInfo(opt){
    let data = opt.body.data;
    return (dispatch) => {
        const route = '/api/math/thematicQuestionAnswerInfo';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data)})
    }
}
//收藏试卷或者试题
export function doSetCollection(opt){
    return (dispatch)=>{
        const route = '/api/math/setCollection';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取所有真题模块训练的试题
export function getAllQuestionOfThematic(opt) {
    return (dispatch) => {
        const route = '/api/math/allQuestionOfThematic';//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.ALLQUESTIONOFTHEMATIC_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
