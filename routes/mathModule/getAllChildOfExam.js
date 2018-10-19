/**
 * 单独拎出来的模块，由于此接口需要处理数据库返回的的数据，代码太多 还不如当做一个文件来处理。
 * 此接口查询某套试卷的所有题目，每个题目的所有子题。最终得到的是一个 json格式的dom树
 * Created by gaoju on 2018/8/20.
 *[
 * questionid:"111111-1",
 * childs:[{
 *    questionid:"22222-1",
 *    childs:[{
 *       questionid:"3333-1",
 *       childs:[{
 *          questionid:"4444-1",
 *       }],
 *       childparts:[{
 *          questionid:"4444-2",
 *       }]
 *     }]
 * }],
 * childparts:[{
 *    questionid:"111111-2"
 * }]
 * ]
 *
 *  select  * from tblExamPaper2Question where examid='6306179e-56af-484a-a2f2-92e20cd1295c' order by ordersn

    select  * from tblQuestion where parentid='Q_be4f1628-619c-4211-af76-c91e298a05ad'

    select  * from tblQuestion2Part  where questionid='Q_984268f2-d631-41dd-9f80-001f76bcbca3'  order by ordersn

    select  * from tblQuestionPart2Item  where partid='Q_def88163-1ff6-44d8-af29-d914b34e8027' order by ordersn
 *
 */
var Math = require('../../database/math.db');

//var questionAllJson = [];//总数据
var doGetAllChildOfExam = function (req,res) {
    var props = req.body;
    var questionAllJson = [];//总数据
    //查询每套试题对应的主题目
    var math = new Math({props:props});
    math.getQuestionsOfPaperList(function(err,data){
        if(!err){
            //questionAllJson = data;//主题目的所有ID
            //循环遍历每道题，查询对应信息
            for(let ii in data){
                let  questionid = data[ii].questionid;
                //查询每一个试题分五个部分
                FillQuestionPart(data[ii],questionid);

                ////查询每个主试题的小问题
                //newNodeData = data[ii];
                //let math = new Math({props:{id:questionid}});
                //math.getQuestionChild(function(err,data){
                //    if(!err){
                //        newNodeData.childs = data;
                //        questionAllJson[ii] = newNodeData;
                //        for(let jj in data){
                //            FillQuestionPart(data[jj],jj);
                //        }
                //    }
                //})
                questionAllJson = data;
            }
            return res.send({
                code:200,
                data:questionAllJson
            })
        }
    })
}
//查询试题的五个部分
function FillQuestionPart(nodedata,id){
    let  math = new Math({props:{id:id}});
    math.getChildQuestionsForQuestion(function(err,data){
        if(!err){
            nodedata.childs = data;
            for(let ii in data){
                var parttype = data[ii].parttype;
                var id = data[ii].partid;
                FillQuestionPartItem(data[ii],id)
            }
        }
    })
}
//查询五个部分的信息
function FillQuestionPartItem(part,id){
    var partid = id;
    var math = new Math({props:{id:partid}});
    math.getContentOfChildItems(function (err,data) {
        if(!err){
            part.items = data
        }
    })
}


module.exports = doGetAllChildOfExam;