/**
 * 查询页面基本信息
 * Created by gaoju on 2018/1/9.
 */

var helper = require('../routes/helper'),
    con = require('./config.db');

/*用户模块 构造方法*/
var Page = function(page) {
    this.props = page.props
};

/*获取首页展示的学生列表信息*/
Page.prototype.getDoorShowItems = function(callback) {
    var _sql = "select headimg,username,phone from tblUser limit 3";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getDoorShowItems',
        callback: callback
    })
}
/*根据用户名和密码匹配否正确*/
Page.prototype.getUserItemByUserName = function(callback) {
    var _sql = `select * from tblUser where name='${this.props.name}' and pwd='${this.props.password}'`;
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserItemByUserName',
        callback: callback
    })
}

module.exports = Page