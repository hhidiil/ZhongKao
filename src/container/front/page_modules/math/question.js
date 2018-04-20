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
import {getFirstDataOfPaper,getSecondTestQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion} from '../../../../redux/actions/math'
import PureRenderMixin from '../../../../method_public/pure-render'
import SelectMenu from '../../../../components/selectMenu/selectMenu'
import NoThisPart from '../../../../components/defaultJPG/nothispart'
import {Storage_S,Storage_L} from '../../../../config'
import moment from 'moment'
import './question_style.css'
import {Menu, Icon,Button } from 'antd'
import {Pagination,Pagination2} from '../../../../components/pagination'
import MultipleChoice from '../../../../components/multipleChoice/index'
import {BaseEditor,FormulaEditor,MathJaxEditor} from '../../../../components/editer'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
var num = 0;
const rootSubmenuKeys = ['sub0','sub1', 'sub2', 'sub3','sub4'];
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
        this.state={
            collapsed: false,
            activeId:activeId,
            all_question:[],//所有试题
            currentQuesData:[],//当前试题的所有内容
            analysisLeftContent:[],//当前试题的分析部分
            exerciseContent:[],//当前试题的分析部分
            current:null,//当前是第几题
            current1:null,
            current2:null,//默认先显示错误题
            total:0,
            errorArray : [],//一测做错的题
            mainContent:true,//主题干显隐，展开true闭合false
            mainContentH:0,//主题干显隐高度
            two_answer_flag:false,//主题干显隐，展开true闭合false
            tips_flag:false,
            two_answer_content:'',
            exerciseIndex:'',
            AnalysisMenu:'0',//分析解答中左侧menu
            AnalysisFlag:true,//分析解答
            nowAnalysisPart:'',//当前解析的是那一部分
            AnswerFlag:false,//标准答案
            Exercise1Flag:false,//巩固
            openKeys:['sub0'],
            radioState:'',
            showEditor:false,
            target_id:'',
            position:[]
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
                            if(!(datajson[ss].Contents[0].IsTrue)){
                                errorArray[ii] =  Number(ss)+1;
                                ii = ii+1;
                            }
                        }
                    }else {
                        errorArray[ii] =  Number(ss)+1;
                        ii = ii+1;
                    }
                }
                if(errorArray.length>0){
                    this.getData(datajson[errorArray[0]-1])
                    this.setState({
                        total:datajson.length,
                        errorArray:errorArray,
                        all_question:datajson,
                        current2:errorArray[0],
                        current:errorArray[0]
                    })
                }else {
                    this.getData(datajson[0])
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
    componentWillReceiveProps(nextProps){
        //this.props //当前的props,nextProps //下一阶段的props
    }
    componentDidUpdate(prevProps,prevState){
        //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
        if(prevState.analysisLeftContent != this.state.analysisLeftContent){
            this.addEventFuc(prevState.showEditor);//为填空题以及解答添加事件处理
        }
        if(prevState.mainContent != this.state.mainContent){
            let H = $('.QtxtContent_main').height();
            this.setState({mainContentH:H})
        }
    }
    requestQuestion(type,data){
        let childid = data[0].childsid;
        switch (type){
            case 'AnalyContent' :
                this.setState({AnalysisFlag:true, AnswerFlag:false, Exercise1Flag:false,mainContent:true});
                break;
            case 'Answer' :
                this.setState({AnalysisFlag:false, AnswerFlag:true, Exercise1Flag:false,mainContent:true});
                break;
            case 'Exercise1' :
                this.getDateOfPractice(type,childid)
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,mainContent:false});
                break;
            case 'Exercise2':
                this.getDateOfPractice(type,childid)
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,mainContent:false});
                break;
            default: break;
        }

    }
    handleClick = (e) =>{
        let type = e.key, whichOne=(e.keyPath[1]);
        let list = this.state.currentQuesData;
        let childid = list[0].childsid;
        let childs = list[0].childs;//大题的问题
        whichOne = whichOne?whichOne.replace(/sub/g,''):whichOne;
        console.warn(whichOne,type,childid,childs)
        if(childs.length >0){
            this.props.actions.getChildQuestionsForQuestion({
                body:[{id:childs[whichOne].questionid}],
                success:(data)=>{
                    childid =  childid.concat(data[0].data)
                    console.warn("getChildQuestionsForQuestion=======\\\\\\=======>>>>>",data[0].data,childid)
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
            case 'testSites' :
                this.getDateOfAnalysis('Review',childid);
                break;
            case 'answer':
                this.getDateOfAnalysis('Explain',childid);
                break;
            default: break;
        }
    }
    addEventFuc(flag){
        let _this = this;
        $(".div_input").each(function(i){
            $(this).on('click',function(event){
                _this.FocusHandle(this,i)
            })
        });
    }
    FocusHandle(e,num){
        console.log("88888888888")
        let tar_id,top='',left='',id='';
        let add_id = "answer"+this.state.current+num;
        if($(e)[0].localName == 'img'){
            tar_id= ($(e)[0].offsetParent);
        }else {
            tar_id = $(e)[0];
        }
        top = (tar_id.offsetTop + tar_id.clientHeight + 2)+"px";
        left = (tar_id.offsetLeft)+"px";
        id=tar_id.id;
        $(tar_id).addClass("inputfoucs-style");
        $(tar_id).attr("id",add_id);
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
            return <li key={index} dangerouslySetInnerHTML={{__html:item.get('content')}}></li>
        })
    }
    _contentQtxt(data,index){
        let items = ((data.get('items')).get(0)).get('data').get(0);
        let content = items.get('content');
        let questiontemplate = items.get('questiontemplate');
        let childs = items.get('childs');
        let optionArray=[];
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(questiontemplate == '选择题'){
            questionType = true;
        }
        return (
            <div>
                <div className="displayflex QtxtContent_main_title">
                    <div className="QtxtContent_main_title_left">{questiontemplate}：</div>
                    <div className="QtxtContent_main_title_right">
                        <Icon type={this.state.mainContent?"down":"up"} onClick={()=>this.setState({mainContent: !this.state.mainContent})}/></div>
                </div>
                <div className={this.state.mainContent?"":"height_none"}>
                    <ul>
                        <li dangerouslySetInnerHTML={{__html:content}}></li>
                        {questionType?<MultipleChoice type={items.get('questiontype')} index={index} choiceList={items.get('optionselect')} />:''}
                        {childs.size<1?"":this._childsList(childs)}
                    </ul>
                </div>
            </div>
        )
    }
    getDateOfAnalysis(type,data){
        console.log("getDateOfAnalysis::::",type,data)
        for(let i=0;i<data.length;i++){
            if(data[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                this.props.actions.getContentOfChildItems({
                    body:[{id:data[i].itemid}],
                    success:(data)=>{
                        if(data[0].code == 200){
                            let dataArray=[];
                            for(let i=0;i<(data[0].data).length;i++){
                                dataArray.push({id:(data[0].data)[i].itemid})
                            }
                            this.props.actions.getContentOfChildItemsForQues({
                                body:dataArray,
                                success:(data)=>{
                                    console.log("getDateOfAnalysis------getContentOfChildItemsForQues---->>",data)
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
    submitAnwser(index){
        this.setState({tips_flag:true,exerciseIndex:index})
        console.log("提交答案")
    }
    clickTip(index){
        if(this.state.exerciseIndex === index){
            this.setState({two_answer_flag:!this.state.two_answer_flag})
        }else {
            alert("请先提交答案再查看提示!")
        }
    }
    submitOne(data,index,type){
        console.log("提交答案：",data.answer,this.state.current,type,index)
    }
    _analysisQtxt(data,type){
        console.log('_analysisQtxt------\\\--------->',data,type)
        return data.map(function(item,index){
            let content = item.content;
            let knowledge = item.knowledge;
            let questionType=false;
            var regex=/\{\@(.+?)\@\}/g;
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\s/g,'')
                content = content.replace(/<u>blank<\/u>|blank|BLANK/g,'<span contenteditable="true" class="div_input"></span>')
            }
            content = content.replace(regex,'<span class="mustText">※</span>')//标记必填空
            if(item.questiontemplate == '选择题'){
                questionType = true;
            }

            if(knowledge){
                knowledge = (knowledge.replace(/["\[\]\s]/g,"")).replace(/\；|\|\|/g,"@");
                knowledge = knowledge.split('@');
            }
            return (
                <div style={{padding: "10px",borderBottom: '1px dashed gray'}} key={index}>
                    <div id="analysusQuesCont">
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questionType?<MultipleChoice type={item.questiontype} index={index} choiceList={item.optionselect} />:''}
                        </ul>
                        {(item.answer).length<1?"":<ul>
                            {knowledge.length>0 ? <span>知识点回顾：{knowledge.map((itm,index)=>{
                                return <a key={index} style={{marginLeft:"5px"}} onClick={(e)=>{alert($(e.target)[0].innerText)}} dangerouslySetInnerHTML={{__html:itm}}></a>
                            })}</span> :''}
                            <span style={{margin:"0 10px"}}>答案：<span dangerouslySetInnerHTML={{__html:item.answer}}></span></span>
                            <button className="marginl10" onClick={()=>{this.submitOne(item,index,type)}}>提交</button>
                        </ul>}
                    </div>
                </div>
            )
        },this)
    }
    _practicesQtxt(data){
        return data.map(function (item,index) {
            let items = (item.data)[0];
            let content = items.content;
            let questionType = false;
            var base = new Base64();//base64对象
            if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/blank/g,'<input type="text" class="input_blank"/>');
            }
            if(items.questiontemplate == '选择题'){
                questionType = true;//有两个选项以上
            }
            return (
                <div className="exercise2" key={index}>
                    <div className="exercise2-border">
                        <div className="exercise2_main_content">
                            <div>
                                <ul>
                                    <li style={{paddingTop:"6px"}} dangerouslySetInnerHTML={{__html:content}}></li>
                                    {questionType?<MultipleChoice type={items.questiontype} index={index} choiceList={items.optionselect} />:''}
                                    {items.childs.size<1?"":this._childsList(items.childs)}
                                </ul>
                            </div>
                            <div><span style={{cursor:'pointer',color:'palevioletred'}} onClick={()=>this.clickTip(index)}>tips:</span>
                                <Icon className="tips" type={this.state.exerciseIndex==index && this.state.two_answer_flag?"up":"down"}/>
                                <Button type="primary" size="small" style={{float:"right"}} onClick={()=>this.submitAnwser(index)}>提交答案</Button>
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
    getData(data){
        if(data){
            this.props.actions.getSecondTestQuestion({body:[{id:data.QuesID}],
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",data)
                    this.setState({currentQuesData:data[0].data})
                    $('#Explain_exer').click()//默认点击一下解析部分
                }})
        }
    }
    onChange = (page) => {
        console.log("page--",page)
        this.setState({
            current: page,
            current1: page,
            analysisLeftContent:[],
            exerciseContent:[],
            showEditor:false
        })
        this.getData(this.state.all_question[page-1])
    }
    onChange2=(page)=>{
        console.log("page--",page)
        this.setState({
            current2: page,
            current: page,
            analysisLeftContent:[],
            exerciseContent:[],
            showEditor:false
        })
        this.getData(this.state.all_question[page-1])
    }
    exitBack(){
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
                            <Menu.Item key="testSites">考点</Menu.Item>
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
                    <Menu.Item key="testSites">考点</Menu.Item>
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
        //let questiontype = ((SecondTestQuestions.get('items')).get(0)).get('questiontemplate');
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
                                {this._contentQtxt(SecondTestQuestions,this.state.current2)}
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
                                        {(this.state.analysisLeftContent).length>0?this._analysisQtxt(this.state.analysisLeftContent,this.state.nowAnalysisPart):<NoThisPart/>}
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
    return { actions: bindActionCreators({push,getFirstDataOfPaper,getSecondTestQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
