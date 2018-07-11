/**
 * redux的命名
 * Created by gaoju on 2017/11/15.
 */
// 用户
export const USER_INFO = 'USER_INFO';
export const USERBASICINFO_UPDATA = 'USERBASICINFO_UPDATA';//用户信息列表
export const USERBASICINFO_CLEAN = 'USERBASICINFO_CLEAN';
export const USERCOLLECTINFO_UPDATA = 'USERCOLLECTINFO_UPDATA';//用户收集的试题列表信息
export const USERCOLLECTINFO_CLEAN = 'USERCOLLECTINFO_CLEAN'
//首页
export const HOMESHOW_LIST_UPDATA = 'HOMESHOW_LIST_UPDATA';//首页显示的学生列表信息
export const HOMESHOW_LIST_CLEAN = 'HOMESHOW_LIST_CLEAN';
export const Province_LIST_UPDATA = 'Province_LIST_UPDATA';//省份列表
export const Province_LIST_CLEAN = 'Province_LIST_CLEAN'
//page
export const PAGE_UPDATE_CURRENT = 'PAGE_UPDATE_CURRENT';
export const PAGE_CLEAN_CURRENT = 'PAGE_CLEAN_CURRENT';
//网络请求
export const REQUEST_LOADING = 'REQUEST_LOADING';
export  const REQUEST_DONE = 'REQUEST_DONE';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const REQUEST_ERROR = 'REQUEST_ERROR';
export const REQUEST_CLEAN = 'REQUEST_CLEAN';

//math
export const ALLQUESTIONSLIST_UPDATE = 'ALLQUESTIONSLIST_UPDATE';
export const ALLQUESTIONSLIST_CLEAN =  'ALLQUESTIONSLIST_CLEAN';
export const QUESTIONSLIST_UPDATE = 'QUESTIONSLIST_UPDATE';
export const ALLQUESTIONOFTHEMATIC_UPDATE = 'ALLQUESTIONOFTHEMATIC_UPDATE';
export const EXAMLIST_UPDATE = 'EXAMLIST_UPDATE';
export const GETMAINQUESTION_UPDATA = 'GETMAINQUESTION_UPDATA';
export const GETFIRSTDATAOFPAPER = 'GETFIRSTDATAOFPAPER';
export const SECONDTESTQUESTIONS_UPDATA = 'SECONDTESTQUESTIONS_UPDATA';
export const GETCONTENTOFCHILDQUES_UPDATA = 'GETCONTENTOFCHILDQUES_UPDATA';
//定时
export const SET_TIMING = 'SET_TIMING';
export const CLEAR_TIMING = 'CLEAR_TIMING';
//记录路由状态，每一次跳转的前一个路由地址
export const SET_PREROUTE = 'SET_PREROUTE'