/**
 * 查询用户信息基本信息
 * Created by gaoju on 2017/11/15.
 */


var mysql = require('mysql'),
    helper = require('../routes/helper'),
    config = require('./config.db');

var con = mysql.createConnection(config);

/*用户模块 构造方法*/
var User = function(user) {
    this.props = user.props
};

/*获取全部数据,正式上线时请关闭*/
User.prototype.getUserAllItems = function(callback) {
    var _sql = "select * from tblUser where rank=0";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserAllItems',
        callback: callback
    })
}
/*获取当前最新的用户id*/
User.prototype.getMaxUserId = function(callback) {
    var _sql = "select userid from tblUser where id>0  ORDER BY userid DESC LIMIT 0,1";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getMaxUserId',
        callback: callback
    })
}
/*根据用户名和密码匹配否正确*/
User.prototype.getUserItemByUserName = function(callback) {
    var _sql = `select * from tblUser where username='${this.props.name}' and pwd='${this.props.password}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserItemByUserName',
        callback: callback
    })
}
/*根据用户手机号和密码匹配否正确*/
User.prototype.getUserItemByPhone = function(callback) {
    var _sql = `select * from tblUser where phone='${this.props.phone}' and pwd='${this.props.password}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserItemByPhone',
        callback: callback
    })
}

/*修改用户登录密码*/
User.prototype.putUserPassword = function(callback) {
    var _sql = `update tblUser set pwd = '${this.props.new_password}' where id = ${this.props.id}`;
    console.log(_sql)
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'putUserPassword',
        callback: callback
    })
}
/*注册用户*/
User.prototype.addUser = function(callback) {
    var _sql = `INSERT INTO tblUser(userid,username,pwd,phone) VALUES ('${this.props.idiilumber}','${this.props.username}','${this.props.password}','${this.props.phone}');`;
    console.log(_sql)
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'addUser',
        callback: callback
    })
}
User.prototype.getUserBasicInfo = function (callback) {
    var _sql = `select * from tblUser where username='${this.props.username}';`
    console.log(_sql)
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserBasicInfo',
        callback: callback
    })
}
User.prototype.UpdateBasicInfo = function (callback) {
    var _sql = `update tblUser set
                    phone='${this.props.phone}',
                    actualname='${this.props.actualname}',
                    username='${this.props.username}',
                    sex='${this.props.sex}',
                    school='${this.props.school}',
                    grade='${this.props.grade}',
                    familyaddress='${this.props.familyaddress}',
                    birthday='${this.props.birthday}',
                    email='${this.props.email}' WHERE userid='${this.props.userid}'`
    console.log(_sql)
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'UpdateBasicInfo',
        callback: callback
    })
}
User.prototype.getUserInfo = function(callback){
    var _sql = `select * from tblUser where username='${this.props.username}';`
    console.log(_sql)
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserBasicInfo',
        callback: callback
    })
}

module.exports = User