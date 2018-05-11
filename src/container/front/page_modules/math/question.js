/**
 * 二测试题
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getFirstDataOfPaper,getSecondTestQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion,doSetCollection} from '../../../../redux/actions/math'
import PureRenderMixin from '../../../../method_public/pure-render'
import SelectMenu from '../../../../components/selectMenu/selectMenu'
import NoThisPart from '../../../../components/defaultJPG/nothispart'
import {Storage_S,Storage_L} from '../../../../config'
import {sentJson_Question,EveryChildInfo} from '../../../../method_public/sentJson'
import moment from 'moment'
import './question_style.css'
import {Menu, Icon,Button,Input } from 'antd'
import {Pagination,Pagination2} from '../../../../components/pagination'
import MultipleChoice from '../../../../components/multipleChoice/index'
import {BaseEditor,FormulaEditor,MathJaxEditor} from '../../../../components/editer'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
var num = 0;
const rootSubmenuKeys = ['sub0','sub1', 'sub2', 'sub3','sub4'];
var everyChildInfo = JSON.stringify(EveryChildInfo);
var newChildList = JSON.parse(everyChildInfo);
var sentJson = {
    "ExamInfoID":"", "UserID":"", "ExamPaperID":"",
    "StartDate":null, "FinishDate":null, "SpendTime":0, "ExamType":"", "Score":0,
    "ExamResult":[],
    "DoExamInfo":[],
    "currentquesid":0,
    "AllDone":'no'
}
class Question extends Component{
    constructor(props){
        super(props);
        let activeId = window.location.hash.split('/')[window.location.hash.split('/').length-1];//当前页面的id
        let paperItems = JSON.parse(Storage_L.getItem(activeId+"-second"))//缓存中取出做题情况的对应数据
        this.state={
            collapsed: false,
            activeId:activeId,
            sentAllList: !paperItems? sentJson : paperItems,//组装答案列表，用来发送存储源数据
            all_question:[],//所有试题
            currentQuesData:[],//当前试题的所有内容
            analysisLeftContent:[],//当前试题的分析部分
            exerciseContent:[],//当前试题的分析部分
            current:null,//当前是第几题
            current1: !paperItems ? null : paperItems.currentquesid,
            current2:null,//错误题页码
            total:0,
            errorArray : [],//一测做错的题
            mainContent:true,//主题干显隐，展开true闭合false
            mainContentH:0,//主题干显隐高度
            two_answer_flag:false,//主题干显隐，展开true闭合false
            two_answer_content:'',
            exerciseIndex:'',
            AnalysisMenu:'0',//分析解答中左侧menu
            AnalysisFlag:true,//分析解答
            nowAnalysisPart:'',//当前解析的是那一部分
            nowPart:'',//当前显示的是那一部分：解析，答案，巩固，拓展
            AnswerFlag:false,//标准答案
            Exercise1Flag:false,//巩固
            openKeys:['sub0'],
            radioState:'',
            showEditor:false,
            target_id:'',
            position:[],
            solution:false
        }
    }
    componentDidMount(){
        sentJson.ExamInfoID = moment().format('x');//当前时间戳作为此次做题id
        sentJson.UserID =Storage_S.getItem('userid');
        sentJson.ExamPaperID = this.state.activeId;
        sentJson.StartDate = moment().format();
        sentJson.ExamType = "二测";
        this.props.actions.getFirstDataOfPaper({
            body:[{
                userid: Storage_S.getItem('userid'),
                id: this.state.activeId,
            }],
            success:(data)=>{
                let datajson = JSON.parse((data[0].data)[0].ExamResult);
                let errorArray=[];//错误题号
                var ii=0;
                for(let ss in datajson){
                    if(datajson[ss]){
                        if(datajson[ss].Contents.length>0){
                            if(!(datajson[ss].Contents[0].IsTrue)){//获取错题列表
                                errorArray[ii] =  Number(ss)+1;
                                ii = ii+1;
                            };
                        }
                    }else {
                        errorArray[ii] =  Number(ss)+1;
                        ii = ii+1;
                    }
                }
                console.log("--------------all_question------------------->>",datajson)
                if(errorArray.length>0){
                    this.getData(datajson[errorArray[0]-1],errorArray[0]-1)
                    this.setState({
                        total:datajson.length,
                        errorArray:errorArray,
                        all_question:datajson,
                        current2:errorArray[0],
                        current:errorArray[0]
                    })
                }else {
                    this.getData(datajson[0],0)
                    this.setState({
                        total:datajson.length,
                        errorArray:errorArray,
                        all_question:datajson,
                        current:1,
                        current1:1
                    })
                }

            },
            error:(message)=>{
                console.error(message)
            }

        })
    }
    componentWillReceiveProps(){
        console.log('componentWillReceiveProps')
    }
    componentWillUpdate(){
        console.log('componentWillUpdate')
    }
    componentDidUpdate(prevProps,prevState){
        //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
        if(prevState.analysisLeftContent != this.state.analysisLeftContent){
            this.addEventFuc('0');//为填空题以及解答添加事件处理
        }
        if(prevState.solution != this.state.solution){
            this.addEventFuc('1');//为填空题以及解答添加事件处理
        }
        if(prevState.mainContent != this.state.mainContent){
            let H = $('.QtxtContent_main').height();
            this.setState({mainContentH:H})
        }
        if(prevState.nowAnalysisPart != this.state.nowAnalysisPart){
            this.addAnswer(this.state.nowAnalysisPart);//为填空题以及解答添加事件处理
        }
    }
    requestQuestion(type,data){
        let childid = data[0].childsid;
        switch (type){
            case 'AnalyContent' :
                this.setState({AnalysisFlag:true, AnswerFlag:false, Exercise1Flag:false,mainContent:true,showEditor:false,nowPart:type});
                break;
            case 'Answer' :
                this.setState({AnalysisFlag:false, AnswerFlag:true, Exercise1Flag:false,mainContent:true,showEditor:false,nowPart:type});
                break;
            case 'Exercise1' :
                this.getDateOfPractice(type,childid);
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,mainContent:false,showEditor:false,nowPart:type});
                break;
            case 'Exercise2':
                this.getDateOfPractice(type,childid);
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,mainContent:false,showEditor:false,nowPart:type});
                break;
            default: break;
        }

    }
    handleClick = (e) =>{
        let type = e.key, whichOne=(e.keyPath[1]);
        let list = this.state.currentQuesData;
        let childid = list[0].childsid;
        let childs = list[0].childs;//大题的问题
        whichOne = whichOne?whichOne.replace(/sub/g,''):whichOne;//某个试题下的小题（解答题的小问）
        console.warn(whichOne,type,childid,childs)
        if(childs.length >0){
            this.props.actions.getChildQuestionsForQuestion({
                body:[{id:childs[whichOne].questionid}],
                success:(data)=>{
                    childid =  childid.concat(data[0].data)
                    this.toGetPartData(type,childid)
                },
                error:(err)=>{console.error(err)}
            })
        }else {
            this.toGetPartData(type,childid)
        }
    }
    toGetPartData(type,childid){
        switch (type){
            case 'observe' :
                this.getDateOfAnalysis('Objective',childid);
                break;
            case 'analysis' :
                this.getDateOfAnalysis('Analysis',childid);
                break;
            case 'review' :
                this.getDateOfAnalysis('Review',childid);
                break;
            case 'answer':
                this.getDateOfAnalysis('Explain',childid);
                break;
            default: break;
        }
    }
    addEventFuc(type){
        let _this = this;
        console.log("addEventFuc----------------->>>>>>>",type)
        $(".div_input").each(function(i){
            let add_id='';
            if(type == '0'){
                add_id = "answer-"+_this.state.current+"-"+_this.state.nowAnalysisPart+"-"+i;
            }else if(type == '1'){
                add_id = "main-answer-"+_this.state.current;
            }
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                _this.FocusHandle(this,add_id)
            })
        });
    }
    addAnswer(type){
        let childsLen = this.state.sentAllList.ExamResult[this.state.current-1];
        let ddd = !childsLen ? '':childsLen.childs[0][type];
        $(".analysisContent").each(function(ii){
            $(this).find('.div_input').each(function(i){
                let oldAnswer = (ddd && ddd.length>0) ?  ddd[ii].content[i].answer:'';
                $(this).text(oldAnswer);
            })
        })
    }
    FocusHandle(e,add_id){
        let tar_id,top='',left='',id='';
        if($(e)[0].localName == 'img'){
            tar_id= ($(e)[0].offsetParent);
        }else {
            tar_id = $(e)[0];
        }
        top = (tar_id.offsetTop - 40)+"px";
        left = (tar_id.offsetLeft)+"px";
        id=tar_id.id;
        $(tar_id).addClass("inputfoucs-style");
        if(add_id != this.state.target_id){
            this.setState({showEditor:true,position:[top,left],target_id:add_id})
        }else {
            if(!this.state.showEditor){
                this.setState({showEditor:true,position:[top,left],target_id:add_id})
            }
        }
    }
    toggleCollapsed = ()=>{
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    radioChange =(e)=>{
        this.setState({radioState: e.target.value})
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
        })
    }
    doCollection(){
        console.log("收藏！！！！")
        let ques = this.state.all_question[this.state.current-1];
        let setdata={
            userId: Storage_S.getItem('userid'),
            questionId:ques.QuesID,
            questionType:ques.QuesType,
            parentId: this.state.activeId,
            title: "我是题目"
        }
        this.props.actions.doSetCollection({
            body: setdata,
            success:()=>{alert("收藏成功！")},
            error:(mes)=>{alert("收藏失败！("+mes+")")}
        })
    }
    redoIt(){
        this.setState({solution: true})
    }
    redoSubmit(type,index){
        let value =[];
        if(type){//选择题
            let answers = $("#mainTopic").find("input:checked");//选项;
            let answer = '';
            answers.each(function(ii){
                answer += $(this).val();//用户填写的答案
            })
            value[0] ={
                "content":answer,
                "url":''
            }
        }else{
            let answers = $("#mainTopic").find("div_input");//选项;
            answers.each(function(ii){
                value[ii] = {
                    "content":$(this).text(),
                    "url":''
                };
            })
        }
        newChildList.answer = value;
        (this.state.sentAllList).ExamResult[index-1] = newChildList;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
    }
    _contentQtxt(data,index){
        let items = data[0];
        let content = items.content;
        let questiontemplate = items.questiontemplate;
        let childs = items.childs;
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(questiontemplate == '选择题'){
            questionType = true;
        }
        let oldcontent = this.state.sentAllList.ExamResult[index-1];
        let oldanswer = oldcontent && oldcontent.answer?oldcontent.answer: this.state.all_question[index-1].Contents;
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\_|\s/g,"");
                let qqq =  '<span class="div_input"></span>';
                content = content.replace(/blank|BLANK/g,qqq);
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{questiontemplate}：</div>
                        <div className="QtxtContent_main_title_right">
                            <Button onClick={()=>this.doCollection()}>收藏</Button>
                            <Button onClick={()=>this.redoIt()}>重做</Button>
                            <Button id="redosubimt" onClick={()=>this.redoSubmit(questionType,index)}>提交</Button>
                            <Icon type={this.state.mainContent?"down":"up"} onClick={()=>this.setState({mainContent: !this.state.mainContent})}/>
                        </div>
                    </div>
                    <div className={this.state.mainContent?"":"height_none"}>
                        <ul id="mainTopic" style={{padding:"8px 0"}}>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questionType?<MultipleChoice type={items.questiontype} answer={oldanswer[0].content} index={index} choiceList={items.optionselect} />:''}
                            {childs.size<1?"":this._childsList(childs)}
                            {questiontemplate!='简答题' || !this.state.solution ? "":<li id="solition" style={{paddingTop:"5px"}}>解：<span contentEditable="true" className="div_input"></span></li>}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    getDateOfAnalysis(type,alldata){
        for(let i=0;i<alldata.length;i++){
            if(alldata[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                this.props.actions.getContentOfChildItems({
                    body:[{id:alldata[i].itemid}],
                    success:(data)=>{
                        if(data[0].code == 200){
                            let dataArray=[];
                            for(let i=0;i<(data[0].data).length;i++){
                                dataArray.push({id:(data[0].data)[i].itemid})
                            }
                            this.props.actions.getContentOfChildItemsForQues({
                                body:dataArray,
                                success:(data)=>{
                                    console.warn("888888888888888888---->",data)
                                    if(data[0].code == 200){
                                        this.setState({analysisLeftContent:data[0].data,showEditor:false,nowAnalysisPart:type});
                                    }else {
                                        console.error(data[0].message)
                                    }
                                },
                                error:(err)=>{console.error(err)}
                            })
                        }else {
                            console.error(data[0].message)
                        }
                    },
                    error:(err)=>{console.error(err)}
                })
            }else {
                this.setState({analysisLeftContent:[],showEditor:false});
            }
        }
    }
    getDateOfPractice(type,data){
        let exerciseArray = [];
        for(let i=0;i<data.length;i++){
            if(data[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                exerciseArray.push({id:data[i].itemid})
            }
        }
        this.props.actions.getQuestion({
            body:exerciseArray,
            success:(data)=>{
                console.log("getQuestion---->>",data)
                this.setState({exerciseContent:data})
            },
            error:(err)=>{console.error(err)}
        })
    }
    getEditContent(cont,dom,url){
        console.warn(cont,url)
        $("#"+dom).text('').append(cont);
    }
    closeHandle (flag){
        this.setState({showEditor:flag})
    }
    seeAnswer (data){
        this.setState({two_answer_content:data})
    }
    submitAnwser(index,data){
        let target_exe = "exerciseTopic"+index,target_value='',type = this.state.nowPart;
        $("#"+target_exe).find("ul input:checked").each(function(ii){
            target_value += $(this).val();
        })
        console.log("提交答案",index,target_value,this.state.nowPart,data.answer)
        if(!target_value){
           alert("请选择答案再提交！")
            return;
        }
        newChildList.childs[0][type][index] = {
            "questionid": data.questionid,
            "answer": target_value,
            "isRight": (data.answer == target_value)?true:false,
            "isdone":true
        };
        (this.state.sentAllList).currentquesid = this.state.current;
        (this.state.sentAllList).ExamResult[this.state.current-1] = newChildList;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
        this.setState({exerciseIndex:index})
    }
    makeScore(index,total){
        let tar = "makescore"+index,score = '';
        score = $("#"+tar).val();
        if(score-total>0){
            alert("此题分数不能大于"+total+",请重新输入!")
        }
        console.log("打分",tar,$("#"+tar).val(),total)
    }
    clickTip(index,olddata){
        console.error(olddata)
        if(olddata && olddata.isdone == true){
            this.setState({two_answer_flag:!this.state.two_answer_flag,exerciseIndex:index})
        }else {
            alert("请先提交答案再查看提示!")
        }
    }
    submitOne(e,data,index,type,questionType){
        console.log("提交的答案：=======",data,this.state.current,type,index,questionType);
        if(!(newChildList.childs[0][type][index])){
            newChildList.childs[0][type][index] = {
                "itemid": "",
                "content":[]
            };
        }
        if(questionType){//当前题目是选择题
            let value = '', isRight = false, knowledgesCont=[],knowledge_new = [];
            let knowledge = ((data.knowledge).replace(/\<B\>|\<\/B\>/g,"")).split("；");//知识点
            let rightanswer = (data.answer).trim().replace(/\s|，/g,"");//正确答案
            let inputList = $(e.target).parent().parent().find(".main_cont input:checked");//选项
            inputList.each(function(ii){
                value += $(this).val();//用户填写的答案
            })
            isRight = value==rightanswer? true : false;
            if(knowledge.length>0){
                for(let ss in knowledge){
                    knowledge_new[ss] = {
                        "name":knowledge[ss]?knowledge[ss]:"",
                        "rightRank":"0"
                    }
                }
            };
            newChildList.childs[0][type][index].content[0] = {
                "answer":value,
                "isRight": isRight,
                "knowledges":knowledge_new
            };
        }else{
            let knowledge = ((data.knowledge).replace(/["\[\]\s]/g,"")).split('||');//知识点
            let inputList = $(e.target).parent().parent().find(".div_input");
            inputList.each(function(ii){
                let value = '', isRight = false, knowledgesCont=[];
                let rightanswer = (data.answer).trim().replace(/\s/g,"").split("||");//正确答案
                let knowledges = knowledge[ii] ? knowledge[ii].split('@#'):[];//每一个空所包含的知识点
                let knowledge_new = [];
                value = $(this).attr("data")?$(this).attr("data"): $(this)[0].innerText;//用户填写的答案
                isRight = rightanswer[ii]==value? true : false;
                if(knowledges.length>0){
                    for(let ss in knowledges){
                        knowledge_new[ss] = {
                            "name":knowledges[ss]?knowledges[ss]:"",
                            "rightRank":"0"
                        }
                    }
                };
                newChildList.childs[0][type][index].content[ii] = {
                    "answer":value,
                    "isRight": isRight,
                    "knowledges":knowledge_new
                };
            });
        }
        newChildList.childs[0][type][index].itemid = data.itemid;
        (this.state.sentAllList).currentquesid = this.state.current;
        (this.state.sentAllList).ExamResult[this.state.current-1] = newChildList;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
    }
    _analysisQtxt(data,type){
        let num = this.state.current;
        let childsLen = this.state.sentAllList.ExamResult[num-1];
        let ddd = !childsLen ? '':childsLen.childs[0][type];
        return data.map(function(item,index){
            let content = item.content;
            let knowledge = item.knowledge;
            let questionType=false;
            let ddd_content = (ddd && ddd.length>0) ? ddd[index].content : [];//解析的某部分的第几个content所有内容（比如考点中的第一个小题全部内容）
            let regex=/\{\@(.+?)\@\}/g;
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\s/g,'');
                content = content.replace(/<u>blank<\/u>|blank|BLANK/g,'<span contenteditable="true" class="div_input"></span>')
            }
            content = content.replace(regex,'<span class="mustText">※</span>')//标记必填空
            if(item.questiontemplate == '选择题'){
                questionType = true;
            }
            if(knowledge){
                knowledge = (knowledge.replace(/["\[\]\s]/g,"")).split('||');
            }
            return (
                <div className="analysisContent" style={{padding: "10px",borderBottom: '1px dashed gray'}} key={index} >
                    <ul className="main_cont">
                        <li dangerouslySetInnerHTML={{__html:content}}></li>
                        {questionType?<MultipleChoice type={item.questiontype} answer={ddd_content.length>0?ddd_content[0].answer:''} index={index} choiceList={item.optionselect} />:''}
                    </ul>
                    {(item.answer).length<1?"":<ul>
                        {knowledge.length>0 ? <span>知识点回顾：{knowledge.map((itm,index)=>{
                            return <a key={index} style={{marginLeft:"5px"}} onClick={(e)=>{alert($(e.target)[0].innerText)}} dangerouslySetInnerHTML={{__html:itm.replace(/\@\#/g,',')}}></a>
                        })}</span> :''}
                        <span style={{margin:"0 10px"}}>答案：<span dangerouslySetInnerHTML={{__html:item.answer}}></span></span>
                        <button className="marginl10" onClick={(e)=>{this.submitOne(e,item,index,type,questionType)}}>提交</button>
                    </ul>}
                </div>
            )
        },this)
    }
    _practicesQtxt(data){
        let num = this.state.current,type = this.state.nowPart;
        let childsLen = this.state.sentAllList.ExamResult[num-1];
        let ddd = !childsLen ? '':childsLen.childs[0][type];
        return data.map(function (item,index) {
            let items = (item.data)[0];
            let content = items.content;
            let questionType = false;
            let ddd_content = (ddd && ddd[index]) ? ddd[index] : '';//解析的某部分的第几个content所有内容（比如考点中的第一个小题全部内容）
            if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/blank/g,'<input type="text" class="input_blank"/>');
            }
            if(items.questiontemplate == '选择题'){
                questionType = true;//有两个选项以上
            }
            if(content){
                return (
                    <div className="exercise2" key={index}>
                        <div className="exercise2-border">
                            <div className="exercise2_main_content">
                                <div id={"exerciseTopic"+index}>
                                    <ul>
                                        <li style={{paddingTop:"6px"}} dangerouslySetInnerHTML={{__html:content}}></li>
                                        {questionType?<MultipleChoice type={items.questiontype} answer={ddd_content?ddd_content.answer:''} index={index} choiceList={items.optionselect} />:''}
                                        {items.childs.size<1?"":this._childsList(items.childs)}
                                        {questionType ? "":<li id="solition" style={{paddingTop:"5px"}}>解：<span contentEditable="true" className="div_input"></span></li>}
                                    </ul>
                                </div>
                                <div><span style={{cursor:'pointer',color:'palevioletred'}} onClick={()=>this.clickTip(index,ddd_content)}>tips:</span>
                                    <Icon className="tips" type={this.state.exerciseIndex==index && this.state.two_answer_flag?"up":"down"}/>
                                    <div className="submitAndscore">
                                        <Button type="primary" size="small" onClick={()=>this.submitAnwser(index,items)}>提交答案</Button>
                                        {questionType ? "":<label>打分：<input type="tel" maxLength = "2" id={"makescore"+index} style={{width:"30px"}} />
                                            <a onClick={()=>this.makeScore(index,items.totalpoints)}>确定</a></label>}
                                    </div>
                                </div>
                                <div className={this.state.exerciseIndex==index && this.state.two_answer_flag ?"exercise2_help":"displaynone"}>
                                    <div className="exercise2_main_sites">
                                        <Button type="dashed" size="small" onClick={()=>this.seeAnswer(items.knowledge)}>考点</Button>
                                        <Button type="dashed" size="small" onClick={()=>this.seeAnswer(items.answer)}>答案</Button>
                                        <Button type="dashed" size="small" onClick={()=>this.seeAnswer(items.analysis)}>解析</Button>
                                    </div>
                                    <div>
                                        <p><span dangerouslySetInnerHTML={{__html:this.state.two_answer_content}}></span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        },this)
    }
    _AnswerFlag(type,data){
        return (
            <div>
                <div>答案为：</div>
                <div dangerouslySetInnerHTML={{__html:data[0].answer}}></div>
            </div>
        )
    }
    getData(data,page){
        if(data){
            let olddata = this.state.sentAllList.ExamResult[page-1];
            if(!olddata){//有缓存
                newChildList.isRight = data.Contents[0]?data.Contents[0].IsTrue:'';//取出一测的做题答案信息
                newChildList.answer = data.Contents[0]?data.Contents[0].content:'';
            }
            this.props.actions.getSecondTestQuestion({body:[{id:data.QuesID}],
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",(data[0].data));
                    newChildList.questionid = (data[0].data)[0].questionid;
                    newChildList.QuesType = (data[0].data)[0].questiontemplate;
                    this.setState({currentQuesData:data[0].data})
                    $('#Explain_exer').click()//默认点击一下解析部分
                }})
        }
    }
    onChange = (page) => {
        console.log("page--",page)
        newChildList = !this.state.sentAllList.ExamResult[page-1] ? JSON.parse(everyChildInfo):this.state.sentAllList.ExamResult[page-1];
        this.setState({
            current: page,
            current1: page,
            analysisLeftContent:[],
            exerciseContent:[],
            showEditor:false,
            solution: false
        })
        this.getData(this.state.all_question[page-1])
    }
    onChange2=(page)=>{
        console.log("page--",page)
        newChildList = !this.state.sentAllList.ExamResult[page-1] ? JSON.parse(everyChildInfo):this.state.sentAllList.ExamResult[page-1];
        this.setState({
            current2: page,
            current: page,
            analysisLeftContent:[],
            exerciseContent:[],
            showEditor:false,
            solution: false
        })
        this.getData(this.state.all_question[page-1],page)
    }
    exitBack(){
        UE.delEditor('container');//退出的时候删除实例化的编辑器
        this.props.actions.push("/home/math/questions")
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    _menuList(len){
        const menulist = (length)=>{
            const list = [];
            for(let i=0;i<length;i++){
                list.push(<SubMenu key={"sub"+(i)} title={"第("+(i+1)+")问"}>
                            <Menu.Item key="observe" id="ddddd" ref={(item)=>{this.observe = item}}>观察</Menu.Item>
                            <Menu.Item key="review">考点</Menu.Item>
                            <Menu.Item key="analysis">分析</Menu.Item>
                            <Menu.Item key="answer">解答</Menu.Item>
                        </SubMenu>)
            }
            return list;
        }
        if(len>0){
            return (
                <MenuItemGroup key="sub" title={<span>试题分析</span>}>
                    { menulist(len)}
                </MenuItemGroup>
            )

        }else {
            return (
                <MenuItemGroup key="sub" title={<span>试题分析</span>}>
                    <Menu.Item key="observe" id="ddddd" ref={(item)=>{this.observe = item}}>观察</Menu.Item>
                    <Menu.Item key="review">考点</Menu.Item>
                    <Menu.Item key="analysis">分析</Menu.Item>
                    <Menu.Item key="answer">解答</Menu.Item>
                </MenuItemGroup >
            )
        }
    }
    render(){
        num = num+1;
        console.log("-------------num-------------->",num)
        const {SecondTestQuestions,GetFirstDataOfPaper} = this.props;
        let error = PureRenderMixin.Compare([SecondTestQuestions,GetFirstDataOfPaper]);
        if (error) return error;
        let title = JSON.parse(Storage_S.getItem(this.state.activeId)).exampaper;
        let errLength = (this.state.errorArray).length;
        let childslen=0;
        if(this.state.currentQuesData.length>0){
            childslen = this.state.currentQuesData[0].childs.length;
        }else {return <div/>}
        //获取各部分的高度
        let hh = ($(window).height()-$('.pagination_content').height()-$('header').height()- this.state.mainContentH -210)+'px';
        const contH = {
            height:hh,
            overflowY:'auto'
        };
        return(
            <div className="mask">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{title+"（检测提升）"}</div>
                        <div className="exit" onClick={this.exitBack.bind(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div>
                        <MathJaxEditor position={this.state.position} target_id={this.state.target_id} showEditor={this.state.showEditor}/>
                        <div className="pagination_all">
                            <div className="widthPrecent5 margint10">题号:</div>
                            <div className="padding0">
                                <Pagination2 total={this.state.total} scoreArraylist={[3,3,3,3,3,0,0,3,3,0,5,5,5,5,0,6,8,15,10,10]} current={this.state.current1}  onChange={this.onChange}/></div>
                        </div>
                        <div className="pagination_content">
                            <div className="pagination_before">
                                <div className="pagination_all">
                                    <div className="widthPrecent7 margint10">错题:</div>
                                    <div className="padding0">
                                        <Pagination className="pagination_error" wordNum={this.state.errorArray} current={this.state.current2} onChange={this.onChange2} total={errLength} /></div>
                                </div>
                            </div>
                            <div className="btnContainer" id="btnContainer">
                                <button id="Explain_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("AnalyContent",this.state.currentQuesData)}>
                                    解答分析
                                </button>
                                <button id="Explain_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Answer",this.state.currentQuesData)}>
                                    标准答案
                                </button>
                                <button id="Exercise1_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Exercise1",this.state.currentQuesData)}>
                                    巩固练习
                                </button>
                                <button id="Exercise2_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Exercise2",this.state.currentQuesData)}>
                                    拓展练习
                                </button>
                            </div>
                        </div>
                    </div>
                    <section className="QtxtContent">
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(this.state.currentQuesData,this.state.current)}
                            </div>
                        </div>
                        <div style={contH}>
                            <div id="Analysis_Qtxt" style={{height:"100%"}} className={this.state.AnalysisFlag?'':'displaynone'}>
                                <div className="content_three">
                                    <div className={this.state.collapsed?"content_three_left2":"content_three_left"}>
                                        <menu>
                                            <div onClick={this.toggleCollapsed} className="shrink">
                                                <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                                            </div>
                                            <Menu
                                                ref={(e) => { this.Menu = e; }}
                                                onClick={this.handleClick}
                                                openKeys={this.state.openKeys}
                                                onOpenChange={this.onOpenChange}
                                                mode="inline"
                                                inlineCollapsed={this.state.collapsed}
                                            >
                                                {this._menuList(childslen)}
                                            </Menu>
                                        </menu>
                                    </div>
                                    <div className="content_three_right">
                                        <p style={{color:"darkgoldenrod",fontSize:"12px"}}>tips：标有红色※的空必须填写奥！</p>
                                        <div id="analysusQuesCont">
                                            {(this.state.analysisLeftContent).length>0?this._analysisQtxt(this.state.analysisLeftContent,this.state.nowAnalysisPart):<NoThisPart/>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="AnswerFlag" className={this.state.AnswerFlag?'':'displaynone'}>
                                <div className="content_three_right">
                                    {this._AnswerFlag('Exercise1',this.state.currentQuesData)}
                                </div>
                                <div style={{clear:"both"}}></div>
                            </div>
                            <div id="Exercise1_Qtxt" className={this.state.Exercise1Flag?'':'displaynone'}>
                                <div className="content_three_right">
                                    {(this.state.exerciseContent).length>0?this._practicesQtxt(this.state.exerciseContent):''}
                                </div>
                                <div style={{clear:"both"}}></div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        SecondTestQuestions:state.SecondTestQuestions,
        GetFirstDataOfPaper:state.GetFirstDataOfPaper
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getFirstDataOfPaper,getSecondTestQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion,doSetCollection}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
