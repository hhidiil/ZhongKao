/**
 * 数学真题
 * Created by gaoju on 2018/1/19.
 */

var Math = require('../../database/math.db');

module.exports={
    init: function(app) {
        app.post('/math/allPapers',this.getAllPapers);
        app.post('/math/questionsOfPaper',this.getQuestionsOfPaper);
        app.post('/math/question',this.getQuestion);
        app.post('/math/sentUserPaperData',this.sentUserPaperData);
        app.post('/math/firstDataOfPaper',this.getFirstDataOfPaper);
        app.post('/math/secondTestQuestion',this.getSecondTestQuestion);
        app.post('/math/contentOfChildQues',this.getContentOfChildQues)
    },
    getAllPapers: (req, res) => {
        let props = {};
        let math = new Math({props: props});
        math.getAllPapersList(function(err, data) {
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if (data.length>0) {
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                return res.send({
                    code: 500,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getQuestionsOfPaper: (req,res) => {
        var props = {
            paperid:req.body.paperid
        };
        var math = new Math({props: props});
        math.getQuestionsOfPaperList(function(err, data) {
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if (data.length>0) {
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                return res.send({
                    code: 500,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getQuestion: (req,res) => {
        console.log("getQuestion======>",req.body.paperid)
        let props = {
            paperid:req.body.paperid
        };
        let math = new Math({props: props});
        math.getQuestionItems(function(err, data) {
            if(!err){
                console.log("getQuestionItems======>",data)
                if (data.length>0) {
                    let olddata = data;
                    let props = {
                        paperid:data[0].questionid
                    };
                    let math = new Math({props: props});
                    math.getQuestionChild(function(err, data){
                        olddata[0].childs = data;
                        if(!err){
                            return res.send({
                                code: 200,
                                data: olddata
                            })
                        }else {
                            console.log(err);
                            return res.send({
                                code: 501,
                                message: '数据获取出错了^@^'
                            })
                        }
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '数据不存在^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getContentOfChildQues: (req,res) => {
        console.log("getQuestion======>",req.body.itemid)
        let props = {
            itemid:req.body.itemid
        };
        let math = new Math({props: props});
        math.getContentOfChildQuesItems(function(err, data) {
            if(!err){
                if (data.length>0) {
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '数据不存在^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getSecondTestQuestion: (req,res) => {
        let props = {
            paperid:req.body.questionid
        };
        let math = new Math({props: props});
        math.getQuestionItems(function(err, data) {
            if(!err){
                if (data.length>0) {
                    let olddata = data;
                    let props = {
                        paperid:data[0].questionid
                    };
                    let math = new Math({props: props});
                    math.getQuestionChild(function(err, data){
                        olddata[0].childs = data;
                        if(!err){
                            let props = {
                                questionid:olddata[0].questionid
                            };
                            let math = new Math({props: props});
                            //查出其所有子题，
                            math.getQuestionChildItems(function(err, data){
                                olddata[0].childsid = data;
                                if(!err){
                                    return res.send({
                                        code: 200,
                                        data: olddata
                                    })
                                }else {
                                    console.log(err);
                                    return res.send({
                                        code: 501,
                                        message: '数据获取出错了^@^'
                                    })
                                }
                            })
                        }else {
                            console.log(err);
                            return res.send({
                                code: 501,
                                message: '数据获取出错了^@^'
                            })
                        }
                    })
                } else {
                    console.log(err);
                    return res.send({
                        code: 500,
                        message: '数据不存在^@^'
                    })
                }
            }else{
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    sentUserPaperData: (req,res)=>{
        console.log("sentUserPaperData-------->>>",req.body)
        var props = req.body;
        props.DoExamInfo = JSON.stringify(req.body.DoExamInfo);
        props.ExamResult = JSON.stringify(req.body.ExamResult);
        var math = new Math({props: props});
        math.addUserPaperData(function(err, data){
            if(!err){
                return res.send({
                    code: 200,
                    data: data
                })
            }else {
                console.log(err);
                return res.send({
                    code: 501,
                    message: '数据获取出错了^@^'
                })
            }
        })
    },
    getFirstDataOfPaper: (req,res)=>{
        var prpos = req.body;
        var math = new Math({props:prpos});
        math.getFirstDataOfPaper(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else {
                console.log(err);
                return res.send({
                    code:501,
                    message:'数据获取出错了^@^'
                })
            }
        })

    }
}
