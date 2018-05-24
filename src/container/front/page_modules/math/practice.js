/**
 * 训练，测试的
 * Created by gaoju on 2017/12/29.
 */
import React,{Component} from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion,sentUserPaperData,getFirstDataOfPaper} from '../../../../redux/actions/math'
import Timing from '../../../../components/timing'
import {BaseEditor} from '../../../../components/editer'
import PureRenderMixin from '../../../../method_public/pure-render'
import {Storage_S,Storage_L} from '../../../../config'
import './question_style.css'
import moment from 'moment'
import Pagination from '../../../../components/pagination/pagination'
import MultipleChoice from '../../../../components/multipleChoice/index'

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
        let paper = JSON.parse(Storage_S.getItem(activeId))//用id来从缓存中取出试卷的对应数据
        let paperItems = JSON.parse(Storage_L.getItem(activeId))//缓存中取出做题情况的对应数据
        this.state={
            dataAll:paper,//整套试卷,可取到某套试题的所有数据
            activeId: activeId,
            cleartimeflag:true,
            current: !paperItems ? 1 : paperItems.currentquesid,//当前题号
            totalNum:0,//试题总数
            all_question:[],//所有题目
            sentList: !paperItems? sentJson : paperItems,//组装答案列表，用来发送存储源数据
            oldAnwers:'',//答案
            target_id:'',//当前要操作的dom
            img_url:'',
            AnswerContent:[],
            questionList:''
        }
    }
    componentDidMount(){
        sentJson.ExamInfoID = moment().format('x');//当前时间戳作为此次做题id
        sentJson.UserID =Storage_S.getItem('userid');
        sentJson.ExamPaperID = this.state.activeId;
        sentJson.StartDate = moment().format();
        sentJson.ExamType = "一测";
        this.props.actions.getQuestionList({
            body:[{id:this.state.activeId}],
            success:(data)=>{
                let newdata = data[0];
                if(newdata.code == 200){
                    let all_question = newdata.data;//解析JSON
                    let data_len = all_question.length;//本套试题的所有题目数
                    this.getData(all_question[this.state.current-1]);
                    this.setState({
                        totalNum:data_len,
                        all_question:all_question
                    })
                }
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
    componentDidUpdate(prevProps,prevState){
        if(prevState.questionList != this.state.questionList){
            this.addEventFuc()//为填空题以及解答添加事件处理
        }
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
    addEventFuc(){
        let _this = this;
        $(".div_input").each(function(i){
            let add_id = "practice"+_this.state.current+i;
            let oldAnwers = _this.state.oldAnwers[i] ? _this.state.oldAnwers[i].content :'';
            $(this).attr("id",add_id);
            $(this).text(oldAnwers);
            $(this).on('click',function(event){
                $(this).addClass("inputfoucs-style")
                _this.setState({target_id: add_id})
            })
        });
    }
    getData(data){
        if(data){
            this.props.actions.getQuestion({body:[{id:data.questionid}],
                success:(data)=>{
                    console.log("getQuestion=======555555=========>",data)
                    if(data[0].code == 200){
                        let isHave = (this.state.sentList).ExamResult[this.state.current-1];//做过了就显示选择的答案
                        let oldAnwers = '';
                        if(isHave){
                            console.log("----------isHave------------------------>>>>",isHave)
                            oldAnwers = isHave.Contents;
                        }
                        this.setState({oldAnwers: oldAnwers,questionList:data[0].data})
                    }
                }})
        }
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.get('content')}}></li>
        })
    }
    _doAndAnswer(data){
        let imgurl = data[0] ? data[0].url : '';
        return (
            <p>
                <li>解：<span contentEditable="true" className="div_input"></span></li>
                <li>附件(提交的答案)：<img width="80px" height="80px" src={imgurl}/></li>
            </p>
        )
    }
    _contentQtxt(data,index){
        let item = (data.get('items')).get(0);
        let items = item.get('data').get(0);
        let content = items.get('content');
        let questiontype = items.get('questiontemplate');
        let childs = items.get('childs');
        let oldAnwers = this.state.oldAnwers[0] ? this.state.oldAnwers[0].content :'';
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\s/g,'');
                content = content.replace(/<u>blank<\/u>|blank|BLANK/g,'<span contenteditable="true" class="div_input"></span>')
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{questiontype}：</div>
                    </div>
                    <div className="padding10">
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questiontype == "选择题" ?<MultipleChoice type={items.get('questiontype')} answer={oldAnwers}  index={index} choiceList={items.get('optionselect')} />:''}
                            {childs.size<1?"":this._childsList(childs)}
                            {questiontype == '简答题' ? this._doAndAnswer(this.state.oldAnwers) :''}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    onChange = (page) => {
        this.setState({
            current: page,
            oldAnwers:'',
            img_url:'',
            AnswerContent:[]
        })
        this.getData(this.state.all_question[page-1])
    }
    endHandle(data){
        confirm('时间已到！')
    }
    exitBack(){
        this.setState({cleartimeflag:true})
        setTimeout(()=>{
            this.props.actions.push("/home/math/exams")
        },1000)

    }
    nextSubmit(page,GetQuestion){
        var nextpage = page+1;
        var isright = false;
        var targetDom = '';
        let AnswerArr = [];
        let dataItems = ((GetQuestion.get('items')).get(0)).get('data').get(0);//试题数据
        let answer = $.trim(dataItems.get('answer'));
        let type = dataItems.get('questiontemplate');
        let quesId = dataItems.get('questionid');
        let nexflag = true;
        let score = dataItems.get('totalpoints');//先把题的得分拿出来，错了在赋值为0
        console.log(page,nextpage,"正确答案：",answer)
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
                let myAnswer = targetDom.value;
                if(myAnswer == answer){
                    isright = true;
                    console.log("选择正确")
                }else{
                    isright = false;
                    score = 0;
                    console.error("选择错误")
                }
                AnswerArr = [{
                    "domid":'',
                    "content": myAnswer,
                    "url":"",
                    "IsTrue": isright,
                }]
                this.state.AnswerContent = AnswerArr;
            }else {
                nexflag = false;
                alert('请选择一个答案！')
            }
        }else {//除了选择题，其他的先统一按照简答题来处理
            //nexflag = false;
            let _this = this;//全局this赋给新的值
            $(".div_input").each(function(i){
                let myAnswer = $(this).text();
                let myId = $(this).attr("id");
                if( myAnswer == answer){
                    isright = true;
                    console.log("正确")
                }else{
                    isright = false;
                    score = 0;
                    console.error("错误")
                }
                AnswerArr[i] = {
                    "domid":myId,
                    "content": myAnswer,
                    "url": _this.state.img_url,
                    "IsTrue": isright
                }
            });
            console.warn(AnswerArr)
            this.state.AnswerContent = AnswerArr;
        }
        if(nexflag){
            let nowList = (this.state.sentList).ExamResult,endscore=0;
            (this.state.sentList).currentquesid = page;//当前题号，断点续做
            nowList[page-1] = {
                "QuesID": quesId,
                "QuesType": type,
                "Contents": this.state.AnswerContent,
                "score":score
            }
            this.setState({
                current: nextpage,
                oldAnwers:'',
                img_url:''
            })
            Storage_L.setItem(this.state.activeId,JSON.stringify(this.state.sentList))//每做完一个题缓存一个
            this.getData(this.state.all_question[page])
        }
    }
    allSubmit(){
        let endList = (this.state.sentList).ExamResult;
        for(let i=0;i<endList.length;i++){
            if(!endList[i]){
                alert("第"+(i+1)+"个题还没有做，请切到第"+(i+1)+"个题提交并点击下一题")
                return
            }
        }
        if(confirm("确定提交吗？")){
            (this.state.sentList).FinishDate = moment().format();//结束时间
            (this.state.sentList).AllDone = "yes";
            let endalllist = (this.state.sentList).ExamResult,allscore=0;
            for(let ii in endalllist){
                allscore += Number(endalllist[ii].score);
            }
            (this.state.sentList).Score = allscore;
            let sentItems = this.state.sentList;
            this.props.actions.sentUserPaperData({
                body:{data:sentItems},
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
    getEditContent(cont,dom,url){
        console.warn(cont,url)
        this.setState({img_url: url})
    }
    render(){
        const {GetQuestion} = this.props;
        let error = PureRenderMixin.Compare([GetQuestion]);
        if (error) return error;
        if((this.state.totalNum)<1) return (<div />);
        let questiontype = ((GetQuestion.get('items')).get(0)).get('data').get(0).get('questiontemplate');
        let objective = ((GetQuestion.get('items')).get(0)).get('data').get(0).get('isobjective');
        let objectiveFlag = (objective== "主观") ? true:false;
        let title = (this.state.dataAll).exampaper;//试卷标题
        let cleartime = this.state.cleartimeflag;
        return(
            <div className="mask" id="practice">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{title}<Timing duration={2*60*60} clearTime={cleartime} endHandle={()=>this.endHandle(this)}></Timing></div>
                        <div className="exit" onClick={()=>this.exitBack(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="pagination_content">
                        <div className="pagination_before pagination_all">
                            <div className="widthPrecent5 margint10">题号:</div>
                            <div className="padding0">
                                <Pagination total={this.state.totalNum} current={this.state.current} onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>
                    <section className="QtxtContent">
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(GetQuestion,this.state.current)}
                            </div>
                        </div>
                        <div id="MathContent">
                            {!objectiveFlag ? '':<BaseEditor inputDom={this.state.target_id} editContent={this.getEditContent.bind(this)} />}
                        </div>
                    </section>
                    <button type="button" className="btn btn-primary next_btn" disabled={(this.state.current==(this.state.totalNum+1))?true:false} onClick={()=>this.nextSubmit(this.state.current,GetQuestion)}>下一题</button>
                    <button type="button" className="btn btn-primary submit_btn" disabled={(this.state.current==(this.state.totalNum+1))?false:true} onClick={()=>this.allSubmit(this)}>全部提交</button>
                </div>
            </div>
        )
    }
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
