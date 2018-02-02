/**
 * 训练，测试的
 * Created by gaoju on 2017/12/29.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion,sentUserPaperData,getFirstDataOfPaper} from '../../../../redux/actions/math'
import Timing from '../../../../components/timing'
import {BaseEditor,FormulaEditor} from '../../../../components/editer'
import PureRenderMixin from '../../../../method_public/pure-render'
import {Storage_S,Storage_L} from '../../../../config'
import './question_style.css'
import moment from 'moment'
import { Pagination } from 'antd';

var sentJson = {
    "ExamInfoID":"", "UserID":"", "ExamPaperID":"",
    "StartDate":null, "FinishDate":null, "SpendTime":0, "ExamType":"", "Score":0,
    "ExamResult":[],
    "DoExamInfo":[],
    "currentquesid":0,
    "Done":'no'
}
class Question extends Component{
    constructor(props){
        super(props);
        let activeId = window.location.hash.split('/')[window.location.hash.split('/').length-1];//当前页面的id
        let paper = JSON.parse(Storage_S.getItem(activeId))//缓存中取出试卷的对应数据
        let paperItems = JSON.parse(Storage_L.getItem('sentDataOfUser'))//缓存中取出做题情况的对应数据
        this.state={
            dataAll:paper,//整套试卷,可取到某套试题的所有数据
            activeId: activeId,
            cleartimeflag:true,
            current: !paperItems ? 1 : paperItems.currentquesid,//当前题号
            totalNum:0,//试题总数
            all_question:[],//所有题目
            sentList: !paperItems? sentJson : paperItems,//组装答案列表，用来发送存储源数据
            radioState:''
        }
    }
    componentDidMount(){
        sentJson.ExamInfoID = moment().format('x');//当前时间戳作为此次做题id
        sentJson.UserID =Storage_S.getItem('userid');
        sentJson.ExamPaperID = this.state.activeId;
        sentJson.StartDate = moment().format();
        sentJson.ExamType = "二测";
        this.props.actions.getQuestionList({
            body:{
                paperid : this.state.activeId//试卷id
            },
            success:(data)=>{
                let all_question = data;//解析JSON
                let data_len = all_question.length;//本套试题的所有题目数
                this.getData(all_question[this.state.current-1])
                this.setState({
                    totalNum:data_len,
                    all_question:all_question
                })
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
        //离开route的钩子处理事件
        //this.props.router.setRouteLeaveHook(
        //    this.props.route,
        //    this.routerWillLeave
        //)
    }
    routerWillLeave=(nextLocation)=> {
        // 返回 false 会继续停留当前页面，否则，返回一个字符串，会显示给用户，让其自己决定
        if(confirm('确认要离开？')){
            this.setState({cleartimeflag:true})
            setTimeout(()=>{
                return true;
            },1000)
        }else {
            return false;
        }
    }
    getData(data){
        if(data){
            this.props.actions.getQuestion({body:{paperid : data.questionid},
                success:(data)=>{
                    let isHave = (this.state.sentList).ExamResult[this.state.current-1];//做过了就显示选择的答案
                    if(isHave){
                        let selected = (isHave.Contents[0]).content[0];
                        this.setState({radioState:selected})
                    }
                }})
        }
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.get('content')}}></li>
        })
    }
    radioChange =(e)=>{
        this.setState({radioState: e.target.value})
    }
    _contentQtxt(data,index){
        let items = (data.get('items')).get(0);
        let content = items.get('content');
        let quetiontype = items.get('questiontemplate');
        let childs = items.get('childs');
        let optionArray=[];
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(quetiontype == '选择题'){
            let option = items.get('optionselect');
            $.trim(option);//去掉前后的空格
            let ss = option.replace(/["\[\]\s]/g,"");
            optionArray = ss.split(",");
            questionType = true;
        }
        var base = new Base64();//base64对象
        if(content){
            if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\s|_/g, '');
                content = content.replace(/blank/g, '<input type="text" class="input_blank"/>');
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{quetiontype}：</div>
                    </div>
                    <div className="padding10">
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            <li>
                                { !questionType ? "":<p>
                                    <label className="checkbox-inline">
                                        <input type="radio" value="A" id={"selectsA"+index} checked={(this.state.radioState=='A')?true:false}
                                               onChange={this.radioChange} name={"Qopts_selects"+index} />
                                        <span>(A)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[0])}}></span></label>
                                    <label className="checkbox-inline">
                                        <input type="radio" value="B" id={"selectsB"+index} checked={(this.state.radioState=='B')?true:false}
                                               onChange={this.radioChange} name={"Qopts_selects"+index} />
                                        <span>(B)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[1])}}></span></label>
                                    <label className="checkbox-inline">
                                        <input type="radio" value="C" id={"selectsC"+index} checked={(this.state.radioState=='C')?true:false}
                                               onChange={this.radioChange} name={"Qopts_selects"+index} />
                                        <span>(C)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[2])}}></span></label>
                                    <label className="checkbox-inline">
                                        <input type="radio" value="D" id={"selectsD"+index} checked={(this.state.radioState=='D')?true:false}
                                               onChange={this.radioChange} name={"Qopts_selects"+index} />
                                        <span>(D)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[3])}}></span></label>
                                </p>}
                            </li>
                            {childs.size<1?"":this._childsList(childs)}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    onChange = (page) => {
        this.setState({
            current: page
        })
        this.getData(this.state.all_question[page-1])
    }
    endHandle(data){
        confirm('时间已到！')
    }
    exitBack(){
        this.setState({cleartimeflag:true})
        setTimeout(()=>{
            this.props.actions.push("/home/math/questions")
        },1000)

    }
    nextSubmit(page,GetQuestion){
        var nextpage = page+1;
        var isright = false;
        var targetDom = '';
        var AnswerContent = '';
        let dataItems = (GetQuestion.get('items')).get(0);//试题数据
        let answer = $.trim(dataItems.get('answer'));
        let type = dataItems.get('questiontemplate');
        let quesId = dataItems.get('questionid');
        let nexflag = true
        console.log('submit:::::::::::',page,answer,type)
        if(type == "选择题"){
            let doms = document.getElementsByTagName("input");
            //获取选择的答案
            for(let i=0;i<doms.length;i++){
                if(doms[i].checked){
                    targetDom = doms[i];
                }
            }
            //选择答案后执行
            if(targetDom){
                AnswerContent = targetDom.value;
                if(AnswerContent == answer){
                    isright = true;
                    console.error("选择正确")
                }else{
                    isright = false;
                    console.error("选择错误")
                }
            }else {
                nexflag = false;
                alert('请选择一个答案！')
            }
        }
        if(nexflag){
            let nowList = (this.state.sentList).ExamResult;
            (this.state.sentList).currentquesid = page;//当前题号，断点续做
            nowList[page-1] = {
                "QuesID": quesId,
                "QuesType": type,
                "Contents": [{
                    "content": [AnswerContent],
                    "url":"",
                    "IsTrue": isright,
                    "scroe":0
                }]
            }
            this.setState({
                current: nextpage,
                radioState:''
            })
            Storage_L.setItem("sentDataOfUser",JSON.stringify(this.state.sentList))//每做完一个题缓存一个
            this.getData(this.state.all_question[page])
        }
    }
    allSubmit(){
        if(confirm("确定提交吗？")){
            (this.state.sentList).FinishDate = moment().format();//结束时间
            (this.state.sentList).Done = "yes";
            let sentItems = this.state.sentList;
            this.props.actions.sentUserPaperData({
                body:{
                    data:sentItems
                },
                success:(data)=>{
                    alert("提交成功")
                    Storage_L.clear()
                    this.exitBack()
                },
                error:(mes)=>{
                    console.error('数据接收发生错误');
                }
            })
        }
    }
    render(){
        const {GetQuestion} = this.props;
        let error = PureRenderMixin.Compare([GetQuestion]);
        if (error) return error;
        let answer = ((GetQuestion.get('items')).get(0)).get('answer');
        let questiontype = ((GetQuestion.get('items')).get(0)).get('questiontemplate');
        let title = (this.state.dataAll).exampaper;//试卷标题
        let cleartime = this.state.cleartimeflag;
        return(
            <div className="mask" id="practice">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{title}</div>
                        <div className="exit" onClick={()=>this.exitBack(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="pagination_content">
                        <div className="pagination_before"><Pagination current={this.state.current} pageSize={1} onChange={this.onChange} total={this.state.totalNum} /></div>
                        <Timing duration={2*60*60} clearTime={cleartime} endHandle={()=>this.endHandle(this)}></Timing>
                    </div>
                    <section className="QtxtContent">
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(GetQuestion,this.state.current)}
                            </div>
                        </div>
                        <div id="MathContent">
                            {(questiontype == '选择题')?'':<BaseEditor/>}
                        </div>
                    </section>
                    <button type="button" className="btn btn-primary next_btn" disabled={(this.state.current==(this.state.totalNum+1))?true:false} onClick={()=>this.nextSubmit(this.state.current,GetQuestion)}>下一题</button>
                    <button type="button" className="btn btn-primary submit_btn" disabled={(this.state.current==(this.state.totalNum+1))?false:true} onClick={()=>this.allSubmit(this)}>全部提交</button>
                </div>
            </div>
        )
    }
}
//array: shim,bool: shim,func: shim,number: shim,object: shim,string: shim,symbol: shim,
Question.propTypes = {
    getQuestion: PropTypes.func,
    getQuestionList:PropTypes.func,
    current: PropTypes.number,
    totalNum: PropTypes.number,
    all_question: PropTypes.array,
    dataAll: PropTypes.array,
    sentList: PropTypes.array,
    cleartimeflag: PropTypes.bool
}
function mapStateToProps(state) {
    return {
        GetQuestion:state.GetQuestion,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getQuestionList,getQuestion,sentUserPaperData,getFirstDataOfPaper}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
