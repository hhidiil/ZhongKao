/**
 * Created by gaoju on 2018/7/26.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'
import './question_style.css'
import {Storage_S,Storage_L} from '../../../../config'
import {getAllChildOfQuestion,getAllKnowledgeOfChapter,getKnowledgeIdListWithId,getEveryQuestion,setThematicQuestionAnswerInfo} from '../../../../redux/actions/math'
import {Pagination,Modal,message,Select,Tree,Spin } from 'antd'
import MultipleChoice from '../../../../components/multipleChoice/index'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import Knowledge from './knowledge.js'

const Option = Select.Option;
const TreeNode = Tree.TreeNode;
//修改翻页文字链接
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a>上一页</a>;
    } else if (type === 'next') {
        return <a>下一页</a>;
    }
    return originalElement;
}
var base = new Base64();//base64对象
class Chapter extends Component{
    constructor(props) {
        super(props)
        this.state = {
            modalVisible:false,
            DialogMaskFlag:false,
            knowledgeName:'',
            currentPage:1,
            totalNum:0,
            Pending : false,//加载转圈标志
            chapterList:[],//章节目录
            allQuestionList:[],//当前模块的所有试题
            selectQuestionList:[],//条件选择后的所有试题
            currentQuestionList:[],//当前页面所显示的试题(当前10条)
            currentQuestionId:'',
            questionDetails:[],//点击作答页面显示的试题详情
            jiexiFlag:false//解析按钮状态标志
        }
    }
    componentDidMount(){
        //查找章节知识点目录
        this.props.actions.getAllKnowledgeOfChapter({
            body:{},
            success:(data)=>{
                console.log("getAllKnowledgeOfChapter--===-->",data)
                setTimeout(()=>{
                    this.setState({
                        chapterList:data,
                    })
                },1000)
            },
            error:(message)=>{ console.error("getChapterTree--===-->",message)}
        })
    };
    getKnowledgeQuestion(id){
        this.props.actions.getKnowledgeIdListWithId({
            body:[{knowledgeId:id}],
            success:(data)=>{
                console.log("hahahahahhaha---222222222222222-->>>>",id,data)
                let alldata = data[0].data;
                if(alldata.length>0){
                    let newdata=[];
                    for(let i in alldata){
                        newdata[i] = {
                            id:alldata[i].questionid
                        }
                    }
                    this.props.actions.getEveryQuestion({
                        body:newdata,
                        success:(data)=>{
                            let newData = [];
                            for(let i in data){
                                newData.push((data[i].data)[0])
                            }
                            console.log("hahahahahhaha---33333333-->>>>",newData)
                            this.setState({
                                allQuestionList:newData,
                                currentPage:1,
                                totalNum:newData.length,
                                selectQuestionList:newData,
                                currentQuestionList:newData.slice(0,10),//默认取出前10条
                                questionDetails:[],
                                Pending:false
                            })
                        },
                        error:(message)=>{
                            console.log(message)
                        }
                    })
                }else {
                    this.setState({
                        allQuestionList:[],
                        currentPage:1,
                        totalNum:0,
                        selectQuestionList:[],
                        currentQuestionList:[],//默认取出前10条，
                        questionDetails:[],
                        Pending:false
                    })
                }
            },
            error:(message)=>{
                console.log(message)
            }
        })
    }
    getCurrentDate(type){
        let list = (this.state.allQuestionList);
        let newList = [];
        if(list.length<1){
            this.setState({
                currentPage:1,
                totalNum:0,
                selectQuestionList:[],
                currentQuestionList:[],
                questionDetails:[]
            })
        }else {
            if(type == '全部'){
                newList = list;
            }else {
                for (let i in list){
                    if(list[i].questiontemplate == type){
                        newList.push(list[i]);
                    }
                }
            }
            let nowPageList = newList.slice(0,10);//默认取出前10条
            this.setState({
                currentPage:1,
                totalNum:newList.length,
                selectQuestionList:newList,
                currentQuestionList:nowPageList,
                questionDetails:[]
            })
        }
    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys);
        this.setState({
            Pending:true
        })
        setTimeout(()=>{
            this.getKnowledgeQuestion(selectedKeys)
        },1000)
    }
    onPageChange = (pagenum)=>{
        let nowPageList = (this.state.selectQuestionList).slice((10*pagenum-10),(10*pagenum));
        this.setState({
            currentPage:pagenum,
            currentQuestionList:nowPageList,
            questionDetails:[]
        })
    }
    closeKnowledgeBox(){
        UE.delEditor('knowledgeContainer');
        this.setState({DialogMaskFlag:false})
    }
    doIt(data){
        let id = data.questionid;
        this.props.actions.getAllChildOfQuestion({
            body:[{id:id}],
            success:(data)=>{
                console.log("getAllChildOfQuestion--===-->",data);
                if(data[0].code == 200){
                    this.setState({
                        modalVisible:true,
                        currentQuestionId:id,
                        questionDetails:data[0].data})
                }
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    }
    getKnowledge(e){
        console.log($(e.target)[0].innerText)
        let knowledge = $(e.target)[0].innerText;
        this.setState({DialogMaskFlag:true,knowledgeName:knowledge})
    }
    selectorChange(e,flag){
        console.log("selectorChange====1111122222221111===》",e.target.text,flag)
        let type = e.target.text;
        switch (type){
            case "全部": this.getCurrentDate('全部');
                break;
            case "选择题": this.getCurrentDate('选择题');
                break;
            case "填空题": this.getCurrentDate('填空题');
                break;
            case "简答题": this.getCurrentDate('简答题');
                break;
            case "材料": this.getCurrentDate('材料');
                break;
            default: this.getCurrentDate('全部');
                break;
        }
    }
    //做题详情页面，弹框显示的内容
    showAnalysis(data){
        this.setState({jiexiFlag:true})
    }
    setModalVisible(flag){
        this.setState({modalVisible:flag,jiexiFlag:flag})
    }
    submitAnswer(data){
        let target_value='',sentdata={},isright = false,score = 0;
        $("#modalQuestion .parts .options").find("ul input:checked").each(function(ii){
            target_value += $(this).val();
        })
        if(!target_value){
            alert("请选择或填写答案！")
            return ;
        }
        isright = ((data.answer).trim() == target_value) ? true:false
        score = isright ? data.totalpoints : 0;
        console.log(target_value);
        sentdata = {
            userId: Storage_S.getItem('userid'),
            questionId: this.state.currentQuestionId,
            whereFrom:"专题",
            exerciseDetailInfo:{
                answer:target_value,
                isRight:isright,
                score:score
            }
        }
        this.props.actions.setThematicQuestionAnswerInfo({
            body:sentdata,
            success:(data)=>{
                console.log("getAllChildOfQuestion--===-->",data);
                message.success("提交成功")
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    }
    _fromContent(data){
        console.log("当前题的ID：",data[0])
        if(data.length<1) return;
        let item = data[0];
        let questionType=false;
        if(item.questiontemplate == '选择题'){
            questionType = true;//有两个选项以上
        }
        return(
            <fieldset id="modalQuestion" className="modal-main-content">
                <div className="parts">
                    <div className="content" dangerouslySetInnerHTML={{__html:item.content}}>
                    </div>
                    <div className="options">
                        <ul>
                            {questionType?<MultipleChoice type={item.questiontype} answer={''} index={1} choiceList={item.optionselect} />:''}
                        </ul>
                    </div>
                </div>
                <div className="parts answerContent">
                    {questionType ? "":<li id="solition" style={{paddingTop:"5px"}}>解：<span contentEditable="true" className="div_input"></span></li>}
                </div>
                <hr/>
                <div className="parts btn-jiexi">
                    <button onClick={()=>this.submitAnswer(item)}>提交</button>
                    <button onClick={()=>this.showAnalysis(item)}>解析</button></div>
                {!this.state.jiexiFlag?'':<div>
                    <div className="parts part-review">
                        <p>考点：<span className="head" onClick={(e)=>this.getKnowledge(e)}>有理数</span></p>
                    </div>
                    <div className="parts part-analysis">
                        <p>分析：<span className="head" dangerouslySetInnerHTML={{__html:item.analysis}}></span></p>
                    </div>
                    <div className="parts part-thematic">
                        <p><span className="head">专题：</span></p>
                    </div>
                    <div className="parts part-reslution">
                        <p>解答：<span className="head" dangerouslySetInnerHTML={{__html:item.answer}}></span></p>
                    </div>
                </div>}
                {!this.state.DialogMaskFlag?"":<DialogMask title={this.state.knowledgeName} closeDialog={()=>this.closeKnowledgeBox()}><Knowledge questionId={item.questionid}  knowledgeName={this.state.knowledgeName} /></DialogMask>}
            </fieldset>
        )
    }
    //试题列表
    _questionList(list){
        let arraylist = list;
        if(list.length<1){
            return <div className="center">没有查到数据^*^..</div>
        }
        return arraylist.map(function(item,index){
            let options = item.optionselect;
            let options_end = options.trim().replace(/["\[\]]/g,"");
            let optionArray = options_end.split(",");
            let objective = item.isobjective;
            let answerFlag = '';
            let content = item.content;
            if(!content){
                return <div className="every-li-css" key={index}></div>
            }
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\s/g,'');
                content = content.replace(/<u>blank<\/u>|blank|BLANK/g,'____')
            }
            return (
                <div className="every-li-css" key={index}>
                    <li>
                        <fieldset className="fieldcontent">
                            <div className="content" dangerouslySetInnerHTML={{__html:content}}>
                            </div>
                            <div className="options">
                                { optionArray.length<4 ? "":<div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='A' ? 'question-answer-2':'question-answer-1'}>(A)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[0])}}></span></label>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='B' ? 'question-answer-2':'question-answer-1'}>(B)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[1])}}></span></label>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='C' ? 'question-answer-2':'question-answer-1'}>(C)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[2])}}></span></label>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='D' ? 'question-answer-2':'question-answer-1'}>(D)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[3])}}></span></label>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>}
                            </div>
                        </fieldset>
                        {objective == "材料" ? "":(
                            <div className="fieldtip">
                            <div className="col-md-5">
                            <span>真题：1</span><span>难度：0.5</span>
                            </div>
                            <div className="col-md-7 right">
                            <span onClick={()=>this.doIt(item)}>作答</span>
                            </div>
                            </div>
                            )}
                    </li>
                </div>
            )
        },this)
    }
    _optionList(data,flag){
        if(!flag)return <Option key="无">无</Option>
        let options = data.get('items');
        if(options.size>0){
            return options.map((item,index)=>{
                return <Option key={item.get('province')}>{item.get('province')}</Option>
            })
        }
    }
    _chapterMenu(list){
        if(list.length<1)return <Spin />;
        return list.map(function(item,index){
            return (
                <TreeNode title={item.knowledge} key={item.knowledgeid}>
                    {item.child.length>0?this._chapterMenu(item.child):""}
                </TreeNode>
            )
        },this)
    }
    render(){
        let {chapterList,Pending} = this.state;
        let height_h = $(window).height()-180;
        const sentionH = {
            height:height_h+"px",
            overflowY:"auto"
        }
        return (
            <div className="mask2" style={{backgroundColor:'rgb(193, 223, 249)'}}>
                <div className="thematicChapter flex-box">
                    <div className="menu">
                        <div className="chapterMenu">章节目录</div>
                        <div className="chapterMenuTree">
                            <Tree
                                onSelect={this.onSelect}
                            >
                                {this._chapterMenu(chapterList)}
                            </Tree>
                        </div>
                    </div>
                    <div className="article" >
                        <div className="thematicQues-parts">
                            <div className="partOne" style={{backgroundColor:'white'}}>
                                <div className="selectorLine">
                                    <div className="selector-key"><strong>题型：</strong></div>
                                    <div className="selector-value">
                                        <ul>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>全部</a></li>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>材料</a></li>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>选择题</a></li>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>填空题</a></li>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>简答题</a></li>
                                        </ul>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="questionNumber">找到<span style={{color:'red'}}>{this.state.totalNum}</span>个相关题</div>
                            </div>
                            <div className="partTwo" style={sentionH}>
                                <div className="pageslist">
                                    <ul>
                                        {!Pending ? this._questionList(this.state.currentQuestionList):<Spin />}
                                    </ul>
                                    <Modal
                                        title="试题详情"
                                        wrapClassName="vertical-center-modal resetCss"
                                        visible={this.state.modalVisible}
                                        maskClosable={false}
                                        closable={false}
                                        destroyOnClose={true}
                                        onOk={() => this.setModalVisible(false)}
                                        onCancel={() => this.setModalVisible(false)}
                                    >
                                        {this._fromContent(this.state.questionDetails)}
                                    </Modal>
                                </div>
                                <div className="pagesfooter">
                                    <Pagination showQuickJumper itemRender={itemRender} pageSize={10} current={this.state.currentPage} total={this.state.totalNum} onChange={this.onPageChange}></Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push,getAllChildOfQuestion,setThematicQuestionAnswerInfo,getAllKnowledgeOfChapter,getKnowledgeIdListWithId,getEveryQuestion}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chapter)