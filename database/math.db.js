/**
 * Created by gaoju on 2018/1/19.
 */


var mysql = require('mysql'),
    helper = require('../routes/helper'),
    config = require('./config.db');

var con = mysql.createConnection(config);

/*试题模块 构造方法*/
var Math = function(param) {
    this.props = param.props
};

/*查询全部练习试卷*/
Math.prototype.getAllPapersList = function(callback) {
    var _sql = "select * from tblExamPaper;";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getAllPapersList',
        callback: callback
    })
}
/*查询试卷的所有试题*/
Math.prototype.getQuestionsOfPaperList = function(callback) {
    var _sql = `select * from tblExamPaper2Question where examid='${this.props.paperid}' ORDER BY ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionsOfPaperList',
        callback: callback
    })
}
/*查询试题（可作为单独完整的试题用）*/
Math.prototype.getQuestionItems = function(callback){
    var _sql = `select * from tblQuestion where questionid='${this.props.paperid}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionItems',
        callback: callback
    })
}
/*查询试题,此处查询的是试题子试题的数据（不能说是一个完整的试题，即 观察，分析，开店部分的试题数据）*/
Math.prototype.getContentOfChildQuesItems = function(callback){
    var _sql = `select * from tblQuestionItem where itemid='${this.props.itemid}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getContentOfChildQuesItems',
        callback: callback
    })
}
/*查询试题的子题（主题的问题1.2.。）*/
Math.prototype.getQuestionChild = function(callback){
    var _sql = `select * from tblQuestion where parentid='${this.props.paperid}' ORDER BY ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionChild',
        callback: callback
    })
}
/*查询试题的所有关联的子题（考点，扩展，分析。。。）*/
Math.prototype.getQuestionChildItems = function(callback){
    var _sql = `select t1.parttype,t2.itemid,t1.questionid from tblQuestion2Part t1,tblQuestionPart2Item t2 where t1.partid=t2.partid and t1.questionid='${this.props.questionid}' ORDER BY t1.ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionChildItems',
        callback: callback
    })
}
/*添加用户试卷做题记录*/
Math.prototype.addUserPaperData = function (callback) {
    var _sql = `INSERT INTO tblStudentExamInfo (ExamInfoID,UserID,ExamPaperID,StartDate,FinishDate,SpendTime,ExamType,Score,ExamResult,DoExamInfo,IsDone)
                VALUES
                ('${this.props.ExamInfoID}','${this.props.UserID}','${this.props.ExamPaperID}','${this.props.StartDate}','${this.props.FinishDate}','${this.props.SpendTime}','${this.props.ExamType}','${this.props.Score}','${this.props.ExamResult}','${this.props.DoExamInfo}','${this.props.Done}');`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'addUserPaperData',
        callback: callback
    })
}
/*获取用户一测数据的做题数据(最新的一条数据)*/
Math.prototype.getFirstDataOfPaper = function (callback) {
    var _sql = `select * from tblStudentExamInfo where UserID='${this.props.userid}' and ExamPaperID='${this.props.exampaperid}' ORDER BY ExamInfoID DESC LIMIT 0,1;`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getFirstDataOfPaper',
        callback: callback
    })
}
module.exports = Math