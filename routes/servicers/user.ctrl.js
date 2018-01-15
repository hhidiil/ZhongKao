/**
 * @desc 用户 控制器
 * @author Jafeney <692270687@qq.com>
 * @dateTime 2016-11-29
 **/

var User = require('../../database/user.db');
var Helper = require('../helper');

module.exports = {
    // 模块初始化

    init: function(app) {
        app.get('/user', this.doGetUserAllItems)
        app.post('/user/token', this.doGetUserItemByPhone)
        app.post('/user/token_name', this.doGetUserItemByUserName)
        app.post('/user/password', this.doPutPassword)
        app.post('/user/register', this.doRegister)
        app.post('/user/basic_info', this.doGetUserBasicInfo)
    },

    // 获取所有用户信息
    doGetUserAllItems: function(req, res) {
        var props = {};
        var user = new User({props: props});
        user.getUserAllItems(function(err, data) {
            if (data.length) {
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
    },
    // 用户登录，通过用户名登陆
    doGetUserItemByUserName: function(req, res) {
        var props = req.body;
        props.password = Helper.getMD5(req.body.password);
        var user = new User({ props: props });
        user.getUserItemByUserName(function(err, data) {
            console.log(data)
            if (data.length) {
                console.log(data)
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '用户名不存在或密码错误'
                })
            }
        })
    },

    // 用户登录，通过手机号登陆
    doGetUserItemByPhone: function(req, res) {
        var props = req.body;
        props.password = Helper.getMD5(req.body.password);
        var user = new User({ props: props });
        user.getUserItemByPhone(function(err, data) {
            if (data.length) {
                console.log(data)
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '用户名或密码不正确'
                })
            }
        })
    },

    // 重置密码
    doPutPassword: function(req, res) {
        var props = {
            id: req.body.id,
            new_password: Helper.getMD5(req.body.new_password),
        };
        var user = new User({ props: props });
        user.putUserPassword(function(err, data) {
            if (data.changedRows >= 0) {
                return res.send({
                    code: 200
                })
            } else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '出错了'
                })
            }
        })
    },
    // 注册
    doRegister: function(req, res) {
        var props = req.body;
        props.password = Helper.getMD5(req.body.password);
        var user = new User({ props: props });
        user.addUser(function(err, data) {
            console.log("register------->>>>>>>>>>>>",data)
            if (data.insertId>0) {
                return res.send({
                    code: 200,
                    data:data.insertId
                })
            } else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '注册出错了'
                })
            }
        })
    },
    doGetUserBasicInfo: function (req,res) {
        console.log("doGetUserBasicInfo::::",req)
        var props = {
            username: req.body.params
        };
        var user = new User({props:props});
        user.getUserBasicInfo(function(err,data){
            console.log("doGetUserBasicInfo::::",data)
            if(data.length>0){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                console.log(err)
                return res.send({
                    code: 500,
                    message: '获取信息错误'
                })
            }
        })
    }


}
