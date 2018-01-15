/**
 * Created by gaoju on 2018/1/9.
 */

var Page = require('../../database/page.db');
var Helper = require('../helper');

module.exports={
    init: function(app) {
        app.get('/page/homelist', this.doGetDoorShowItems)
    },
    // 获取首页展示学生的列表信息
    doGetDoorShowItems: function(req, res) {
        var props = {};
        var page = new Page({props: props});
        page.getDoorShowItems(function(err, data) {
            if (data.length>0) {
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '出错了'
                })
            }
        })
    }
}