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
import {getFirstDataOfPaper,getSecondTestQuestion,getContentOfChildQues,getQuestion} from '../../../../redux/actions/math'
import PureRenderMixin from '../../../../method_public/pure-render'
import SelectMenu from '../../../../components/selectMenu/selectMenu'
import NoThisPart from '../../../../components/defaultJPG/nothispart'
import {Storage_S,Storage_L} from '../../../../config'
import moment from 'moment'
import './question_style.css'
import { Pagination } from 'antd';
import { Menu, Icon,Button } from 'antd'

const SubMenu = Menu.SubMenu;
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
            current:1,
            current2:1,
            errorArray : [],//一测做错的题
            mainContent:true,//主题干显隐，展开true闭合false
            two_answer_content:false,//主题干显隐，展开true闭合false
            AnalysisMenu:'0',//分析解答中左侧menu
            AnalysisFlag:true,//分析解答
            AnswerFlag:false,//标准答案
            Exercise1Flag:false,//巩固
            Exercise2Flag:false,//扩展
            defaultMeun:[['sub'],['observe']],
            radioState:''
        }
    }
    componentDidMount(){
        this.props.actions.getFirstDataOfPaper({
            body:{
                userid: Storage_S.getItem('userid'),
                exampaperid: this.state.activeId,
            },
            success:(data)=>{
                let datajson = JSON.parse(data[0].ExamResult);
                let errorArray=[];//错误题号
                var ii=0;
                console.warn(datajson)
                for(let ss in datajson){
                    if(datajson[ss]){
                        if(!(datajson[ss].Contents[0].IsTrue)){
                            errorArray[ii] =  Number(ss);
                            ii = ii+1;
                        }
                    }else {
                        errorArray[ii] =  Number(ss);
                        ii = ii+1;
                    }
                }
                this.getData(datajson[errorArray[0]])
                this.setState({
                    errorArray:errorArray,
                    all_question:datajson
                })
            },
            error:(message)=>{
                console.error(message)
            }

        })
    }
    componentWillReceiveProps(nextProps){
        //this.props //当前的props,nextProps //下一阶段的props
    }
    itemRender =(current, type, originalElement) =>{
        if (type === 'page') {
            return <a>{this.state.errorArray[current-1]+1}</a>;
        }
        return originalElement;
    }
    requestQuestion(type,data){
        let childid = data[0].childsid;
        switch (type){
            case 'AnalyContent' :
                this.setState({AnalysisFlag:true, AnswerFlag:false, Exercise1Flag:false, Exercise2Flag:false,mainContent:true});
                break;
            case 'Answer' :
                this.setState({AnalysisFlag:false, AnswerFlag:true, Exercise1Flag:false, Exercise2Flag:false,mainContent:true});
                break;
            case 'Exercise1' :
                this.getDateOfPractice(type,childid)
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true, Exercise2Flag:false,mainContent:false});
                break;
            case 'Exercise2':
                this.getDateOfPractice(type,childid)
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:false, Exercise2Flag:true,mainContent:false});
                break;
            default: break;
        }

    }
    handleClick = (e) =>{
        let type = e.key;
        let list = this.state.currentQuesData;
        let childid = list[0].childsid;
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
        let items = (data.get('items')).get(0);
        let content = items.get('content');
        let quetiontype = items.get('questiontemplate');
        let childs = items.get('childs');
        let optionArray=[];
        let questionType=false;
        var base = new Base64();//base64对象
        //选择题的时候要处理返回的选项格式
        if(quetiontype == '选择题'){
            let option = items.get('optionselect');
            $.trim(option);//去掉前后的空格
            let ss = option.replace(/["\[\]\s]/g,"");
            optionArray = ss.split(",");
            questionType = true;
        }
        return (
            <div>
                <div className="displayflex QtxtContent_main_title">
                    <div className="QtxtContent_main_title_left">{quetiontype}：</div>
                    <div className="QtxtContent_main_title_right">
                        <Icon type={this.state.mainContent?"down":"up"}/></div>
                </div>
                <div className={this.state.mainContent?"":"height_none"}>
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
    getDateOfAnalysis(type,data){
        for(let i=0;i<data.length;i++){
            if(data[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                this.props.actions.getContentOfChildQues({
                    body:{
                        itemid: data[i].itemid
                    },
                    success:(data)=>{
                        console.log("getContentOfChildQues---->>",data)
                        this.setState({analysisLeftContent:data});
                    },
                    error:(err)=>{console.error(err)}
                })
            }else {
                this.setState({analysisLeftContent:[]});
            }
        }
    }
    getDateOfPractice(type,data){
        let exerciseArray = [];
        for(let i=0;i<data.length;i++){
            if(data[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                this.props.actions.getQuestion({
                    body:{
                        paperid: data[i].itemid
                    },
                    success:(data)=>{
                        console.log("getQuestion---->>",data)
                        exerciseArray.push(data)
                    },
                    error:(err)=>{console.error(err)}
                })
            }
        }
        setTimeout(()=>{this.setState({exerciseContent:exerciseArray});},1000)
    }
    _analysisQtxt(data){
        let content = data[0].content;
        if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
            content = content.replace(/blank/g,'<input type="text" class="input_blank"/>');
        }
        return (
            <div style={{padding: "0 10px"}}>
                <div id="observer">
                    <ul>
                        <li dangerouslySetInnerHTML={{__html:content}}></li>
                        <li dangerouslySetInnerHTML={{__html:data[0].knowledge}}></li>
                    </ul>
                </div>
            </div>
        )
    }
    _practicesQtxt(data){
        return data.map(function (item,index) {
            let items = item[0];
            let content = items.content;
            let questionType = false;
            let optionArray=[];
            var base = new Base64();//base64对象
            if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                console.log("------------11111111-----------")
                content = content.replace(/blank/g,'<input type="text" class="input_blank"/>');
            }
            console.log("------------2222222222-----------")
            if(items.questiontemplate == '选择题'){
                let option = items.optionselect;
                $.trim(option);//去掉前后的空格
                optionArray = option.split(",");
                questionType = optionArray.length>2?true:false;//有两个选项以上
            }
            return (
                <div className="exercise2">
                    { !questionType ? "":<div className="exercise2-border">
                        <div className="exercise2_main_content">
                            <div>
                                <ul>
                                    <li dangerouslySetInnerHTML={{__html:content}}></li>
                                    <li>
                                        <p>
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
                                        </p>
                                    </li>
                                    {items.childs.size<1?"":this._childsList(items.childs)}
                                </ul>
                            </div>
                            <div className="exercise2_main_sites">
                                <Button type="dashed" size="small" onClick={()=>{this.setState({two_answer_content:!this.state.two_answer_content})}}>考点</Button>
                                <Button type="dashed" size="small">答案</Button>
                                <Button type="dashed" size="small">解析</Button>
                            </div>
                        </div>
                        <div className={this.state.two_answer_content?"exercise2_help":"displaynone"}>
                            <p><span>考点：</span>分式的化简求值</p>
                            <p><span>答案：</span>1/6</p>
                            <p><span>解析：</span>代数式(a-b)/(3a^2-6a)/[a+2-5/(a-2)] 可化简为 (1/3a(a+3))=(1/3a^+9a) ，由已知a^2+3a－2=0，所以3a^2+9a = 6。</p>
                        </div>
                    </div>}

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
            this.props.actions.getSecondTestQuestion({body:{questionid : data.QuesID},
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",data)
                    //let childid = data[0].childsid;
                    //this.getDateOfAnalysis('Objective',childid);
                    this.setState({currentQuesData:data})
                }})
        }
    }
    onChange = (page) => {
        this.setState({
            current: page,
        })
    }
    onChange2=(page)=>{
        this.setState({
            current2: page,
            defaultMeun:[['sub','sub1'],[]],
            analysisLeftContent:[],
            exerciseContent:[],
        })
        this.getData(this.state.all_question[this.state.errorArray[page-1]])
    }
    exitBack(){
        this.props.actions.push("/home/math/questions")
    }
    _menuList(len){
        const menulist = (length)=>{
            const list = [];
            for(let i=0;i<length;i++){
                list.push(<SubMenu key={"sub"+(i+1)} title={"第("+(i+1)+")问"}>
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
                <SubMenu key="sub" title={<span><Icon type="mail" /><span>试题分析</span></span>}>
                    { menulist(len)}
                </SubMenu>
            )

        }else {
            return (
                <SubMenu key="sub" title={<span><Icon type="mail" /><span>试题分析</span></span>}>
                    <Menu.Item key="observe" id="ddddd" ref={(item)=>{this.observe = item}}>观察</Menu.Item>
                    <Menu.Item key="testSites">考点</Menu.Item>
                    <Menu.Item key="analysis">分析</Menu.Item>
                    <Menu.Item key="answer">解答</Menu.Item>
                </SubMenu>
            )
        }
    }
    render(){
        const {SecondTestQuestions,GetFirstDataOfPaper} = this.props;
        let error = PureRenderMixin.Compare([SecondTestQuestions,GetFirstDataOfPaper]);
        if (error) return error;
        //let title = ((SecondTestQuestions.get('items')).get(0)).get('content');
        //let questiontype = ((SecondTestQuestions.get('items')).get(0)).get('questiontemplate');
        let errLength = (this.state.errorArray).length;
        let childslen=0;
        if(this.state.currentQuesData.length>0){
            childslen = this.state.currentQuesData[0].childs.length;
        }else {return <div/>}

        let hh = ($(window).height()-$('.QtxtContent_main').height()-320)+'px';
        console.log("QtxtContent_main---------",$(window).height(),$('.QtxtContent_main').height(),hh)
        const contH = {
            height:hh,
            overflowY:'auto'
        }
        return(
            <div className="mask">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">2017年北京大学内部专家通宵熬夜出版中考考试真题</div>
                        <div className="exit" onClick={this.exitBack.bind(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="pagination_content">
                        <div className="pagination_before">
                            <div className="row">
                                <div className="col-md-1 padding0">题号:</div>
                                <div className="col-md-10 padding0"><Pagination current={this.state.current} pageSize={1} onChange={this.onChange} total={20} /></div>
                            </div>
                            <div className="row margint10">
                                <div className="col-md-1 padding0">错题:</div>
                                <div className="col-md-10 padding0">
                                    <Pagination className="pagination_error" size="small" current={this.state.current2} pageSize={1} itemRender={this.itemRender} onChange={this.onChange2} total={errLength} /></div>
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
                    <section className="QtxtContent">
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this.state.mainContent?this._contentQtxt(SecondTestQuestions,this.state.current2):'完成以下练习：'}
                            </div>
                        </div>
                        <div style={contH}>
                            <div id="Analysis_Qtxt" className={this.state.AnalysisFlag?'':'displaynone'}>
                                <div className="content_three">
                                    <div className={this.state.collapsed?"content_three_left2":"content_three_left"}>
                                        <menu>
                                            <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 5 }}>
                                                <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                                            </Button>
                                            <Menu
                                                ref={(e) => { this.Menu = e; }}
                                                onClick={this.handleClick}
                                                defaultOpenKeys={this.state.defaultMeun[0]}
                                                mode="inline"
                                                inlineCollapsed={this.state.collapsed}
                                            >
                                                {this._menuList(childslen)}
                                            </Menu>
                                        </menu>
                                    </div>
                                    <div className="content_three_right">
                                        {(this.state.analysisLeftContent).length>0?this._analysisQtxt(this.state.analysisLeftContent):<NoThisPart/>}
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
                            <div id="Exercise2_Qtxt" className={this.state.Exercise2Flag?'':'displaynone'}>
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
    return { actions: bindActionCreators({push,getFirstDataOfPaper,getSecondTestQuestion,getContentOfChildQues,getQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
