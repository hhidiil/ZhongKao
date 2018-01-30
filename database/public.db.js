/**
 * Created by gaoju on 2018/1/19.
 */

var mysql = require('mysql'),
    helper = require('../routes/helper'),
    config = require('./config.db');

var con = mysql.createConnection(config);

/*用户模块 构造方法*/
var Public_SQL = function(param) {
    this.props = param.props
};

/*获取首页展示的学生列表信息*/
Public_SQL.prototype.getMaxUserNumber = function(callback) {
    var _sql = "select userid from tblUser where id>0  ORDER BY userid DESC LIMIT 0,1";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getMaxUserNumber',
        callback: callback
    })
}
module.exports = Public_SQL