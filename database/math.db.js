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
        name: 'getAllQuestionsList',
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
/*查询试题*/
Math.prototype.getQuestionItems = function(callback){
    var _sql = `select * from tblQuestion where questionid='${this.props.paperid}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionItems',
        callback: callback
    })
}
/*查询试题的子试题*/
Math.prototype.getQuestionChildItems = function(callback){
    var _sql = `select * from tblQuestion where parentid='${this.props.paperid}' ORDER BY ordersn`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getQuestionChildItems',
        callback: callback
    })
}
/*添加用户试卷做题记录*/
Math.prototype.addUserPaperData = function (callback) {
    var _sql = `INSERT INTO tblStudentExamInfo (ExamInfoID,UserID,ExamPaperID,StartDate,FinishDate,SpendTime,ExamType,Score,ExamResult,DoExamInfo)
                VALUES
                ('${this.props.ExamInfoID}','${this.props.UserID}','${this.props.ExamPaperID}','${this.props.StartDate}','${this.props.FinishDate}','${this.props.SpendTime}','${this.props.ExamType}','${this.props.Score}','${this.props.ExamResult}','${this.props.DoExamInfo}');`;
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