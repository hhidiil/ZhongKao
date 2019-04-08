/**
 * @desc 用户 控制器
 * @dateTime 2017-11-29
 **/

var User = require('../../database/user.db');
var Helper = require('../helper');
var errorMessage = require('../errorMessageTypes.js');
//var doGetUserBasicInfo = require('../userModule/getUserInfo')//将处理函数单独放在一个模块文件中来处理。
var request = require('request');
var WXBizDataCrypt = require('../WXBizDataCrypt');//解密算法
var AppID = Helper.appInfo.AppID;
var AppSecret = Helper.appInfo.AppSecret;

module.exports = {
    // 模块初始化
    init: function(app) {
        app.get('/user', this.doGetUserAllItems);
        app.post('/user/token', this.doGetUserItemByPhone);
        app.post('/user/token_name', this.doGetUserItemByUserName);
        app.post('/user/password', this.doPutPassword);
        app.post('/user/register', this.doRegister);
        app.post('/user/resetPassword',this.doResetPassword);
        app.post('/user/basic_info', this.doGetUserBasicInfo);
        app.post('/user/updateBasicInfo',this.doUpdateBasicInfo);
        app.post('/user/updateHeadImg',this.doUpdateHeadImg);
        app.post('/user/getCollection',this.doGetCollection);
        app.get('/user/get_wx_access_token',this.get_wx_access_token);
        app.get('/user/getUnionId',this.getUnionId);

    },
    // 获取所有用户信息
    doGetUserAllItems: function(req, res,next) {
        var props = {};
        var user = new User({props: props});
        user.getUserAllItems(function(err, data) {
            if(!err){
                if (data.length>0) {
                    //删除所有的密码
                    data.forEach(function(item){
                        delete item.pwd;
                    })
                }
                return res.send({
                    code: 200,
                    data: data
                })
            }else {
                let error = new Error(err.code);
                return next(error);
            }
        })
    },
    // 用户登录，通过用户名登陆
    doGetUserItemByUserName: function(req, res,next) {
        var props = req.body;
        props.password = Helper.getMD5(req.body.password);
        var user = new User({ props: props });
        user.getUserItemByUserName(function(err, data) {
            if(!err){
                if (data.length>0) {
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    return res.send({
                        code: 400,
                        message: '用户名不存在或密码错误'
                    })
                }
            }else {
                console.log(err)
                let error = new Error(err.code);
                return next(error);
            }
        })
    },
    // 用户登录，通过手机号登陆
    doGetUserItemByPhone: function(req, res,next) {
        var props = req.body;
        props.password = Helper.getMD5(req.body.password);
        var user = new User({ props: props });
        user.getUserItemByPhone(function(err, data) {
            if(!err){
                if (data.length) {
                    console.log(data)
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    return res.send({
                        code: 500,
                        message: '用户名或密码不正确'
                    })
                }
            }else {
                console.log(err)
                let error = new Error(err.code);
                return next(error);
            }
        })
    },

    // 修改密码
    doPutPassword: function(req, res,next) {
        var props = {
            id: req.body.id,
            new_password: Helper.getMD5(req.body.new_password),
        };
        var user = new User({ props: props });
        user.putUserPassword(function(err, data) {
            if(!err){
                if (data.changedRows >= 0) {
                    return res.send({
                        code: 200
                    })
                } else {
                    return res.send({
                        code: 500,
                        message: '重置密码出错'
                    })
                }
            }else {
                let error = new Error(err.code);
                return next(error);
            }
        })
    },
    // 重置密码
    doResetPassword: function (req,res,next) {
        let props = req.body;
        let user = new User({props:props});
        user.getUserWithNameAndPwd(function (err,data) {
            if(!err){
                if(data.length>0){
                    let props = {
                        id: data[0].id,
                        new_password: Helper.getMD5(req.body.new_password)
                    };
                    let user = new User({props:props});
                    user.putUserPassword(function(err, data) {
                        if(!err){
                            return res.send({
                                code: 200,
                                message:data
                            })
                        }else {
                            return res.send({
                                code: 500,
                                message: '重置密码出错'
                            })
                        }
                    })
                }else {
                    return res.send({
                        code:500,
                        message:'此用户不存在或者手机号不正确'
                    })
                }
            }else {
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了'
                })
            }
        })
    },
    // 注册
    doRegister: function(req, res, next) {
        //检测参数
        if(!req.body.username || !req.body.password){
            let err = new Error(errorMessage['400']);
            err.status = 400;
            return next(err);
        }
        const params = {
            username:req.body.username
        };
        let user = new User({ props: params });
        //判断用户名是否存在
        user.getUserInfo(function(err, data){
            if(err){
                let error = new Error(err.code);
                return next(error);
            }
            if(data.length<1){
                const params = {};
                let user = new User({ props: params });
                //获取当前最新用户id
                user.getMaxUserId(function(err, data){
                    let num = data[0].userid;
                    let props = req.body;
                    if (num.length>0) {//有用户
                        props.idiilumber = Helper.createUserId(data[0].userid);
                    } else {
                        props.idiilumber = 'IDIIL00000001';//第一个用户
                    }
                    props.password = Helper.getMD5(req.body.password);
                    let user = new User({ props: props });
                    //添加新用户
                    user.addUser(function(err, data) {
                        if(err){
                            console.log(err)
                            return res.send({
                                code: 501,
                                message: '出错了0.0'
                            });
                        }
                        if (data.insertId>0) {
                            return res.send({
                                code: 200,
                                data:data.insertId
                            })
                        } else {
                            console.log(err)
                            return res.send({
                                code: 500,
                                type:'register',
                                message: '注册出错了,请重新注册'
                            })
                        }
                    })
                })
            }else {
                return res.send({
                    code: 500,
                    type:'username',
                    message: '用户名已存在，请重新输入！'
                })
            }
        })
    },
    doGetUserBasicInfo: function (req,res,next) {
        var props = {
            username: req.body.params
        };
        var user = new User({props:props});
        user.getUserBasicInfo(function(err,data){
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if(data.length>0){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code: 500,
                    message: '获取信息错误'
                })
            }
        })
    },
    doUpdateBasicInfo: function (req,res,next){
        var props = req.body;
        var user = new User({props:props});
        user.UpdateBasicInfo(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                let error = new Error(err.code);
                return next(error);
            }
        })
    },
    doUpdateHeadImg: function (req,res,next){
        var props = req.body;
        var user = new User({props:props});
        user.UpdateHeadImg(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                let error = new Error(err.code);
                return next(error);
            }
        })
    },
    doGetCollection: function(req,res,next){
        var props = req.body;
        var user = new User({props:props});
        user.getCollection(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                let error = new Error(err.code);
                return next(error);
            }
        })
    },
    /**
     * 获取微信用户的唯一的unionid
     * 参数：code,登录临时凭证（必须的）
     * encryptedData,微信获取的用户加密信息，需要解密
     * iv,
     * **/
    getUnionId: function(req,res,next){
        // 第二步：通过code换取网页授权access_token
        console.log("getUnionId==>",req.query);
        let reqs = req.query;
        let appId = 'wxf6fbc01845361e67';
        let appSecret = '491974216d8c1db42b2dfd7cab0ffab3';
        request('https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+appSecret+'&js_code='+reqs.code+'&grant_type=authorization_code',function(error,response,body){
            if(!error && response.statusCode === 200){	//通过前端传过来的code获取sessionKey
                console.log('获取sessionKey返回的信息==>',body)
                //console.log(typeof body)
                var bodyJson = JSON.parse(body)
                var sessionKey = bodyJson.session_key;
                console.log('-------------bodyJson--------------------',bodyJson)
                if(bodyJson.unionid){//用户如果有关注公众号可以直接获取到，不用再进行解密
                    return res.json({
                        code:200,
                        data:bodyJson
                    })
                }else {
                    //获取到sessionKey后，开始进行解密，获取uninoid
                    try {
                        var encryptedData = reqs.encryptedData.replace(/ /g,'+');	//要把空格替换成+，不然会报错，因为前端数据传到后端时+号会被解析成空格，要再换回去
                        var iv = reqs.iv.replace(/ /g,'+');
                        console.log(encryptedData,'-------------encryptedData--------------------')
                        console.log(iv,'==========================iv=================')
                        console.log(sessionKey,'++++++++++++++++++++++sessionKey++++++++++++++++++++++++++')
                        var pc = new WXBizDataCrypt(appId, sessionKey)
                        var data = pc.decryptData(encryptedData , iv)
                        console.log('解密后 data: ', data);
                        return res.json({
                            code:200,
                            data:data
                        })
                    }catch (error){
                        let err = new Error(error.code);
                        return next(err);
                    }
                }
            }else {
                let err = new Error(error.code);
                return next(err);
            }
        })
    },
    get_wx_access_token: function(req,res,next){
        console.log("wechat_req==>",req.query);
        var code = req.query.code;
        request.get({
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
        }, function(error, response, body){
            if(response.statusCode == 200){
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                console.log("获取的数据2==>",JSON.parse(body));
                var data = JSON.parse(body);
                var access_token = data.access_token;
                var openid = data.openid;
                request.get({url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'},
                    function(error, response, body){
                        if(response.statusCode == 200){
                            // 第四步：根据获取的用户信息进行对应操作
                            var userinfo = JSON.parse(body);
                            console.log('获取微信信息成功！');
                            //到这就写完了，你应该拿到微信信息以后去干该干的事情，比如对比数据库该用户有没有关联过你们的数据库，如果没有就让用户关联....等等等...
                            res.json({
                                code:200,
                                data:userinfo
                            })
                        }else{
                            console.log(response.statusCode);
                            res.json({
                                code:response.statusCode,
                                data:userinfo
                            })
                        }
                    }
                );
            }else{
                console.log(response.statusCode);
                let err = new Error(error.code);
                return next(err);
            }
        })
    }


}
