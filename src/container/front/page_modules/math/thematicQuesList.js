/**
 * 专题子模块的所有试题列表页
 * Created by gaoju on 2018/5/17.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'
import {Pagination,Modal,message} from 'antd'
import {Storage_S} from '../../../../config'
import {getAllQuestionOfThematic,getAllChildOfQuestion,getKnowledgeIdList,setThematicQuestionAnswerInfo} from '../../../../redux/actions/math'
import MultipleChoice from '../../../../components/multipleChoice/index'

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
const modalParts = ["知识回顾","重点考点","备考思路","聚焦中考","真题过关"]
class ThematicQuesList extends Component{
    constructor(props) {
        super(props)
        this.state={
            modalVisible:false,
            currentPage:1,
            allQuestionList:[],//当前模块的所有试题
            totalNum:0,
            currentQuestionList:[],//当前页面的所显示的试题
            currentQuestionId:'',
            questionDetails:[],//点击作答页面显示的试题详情
            jiexiFlag:false//解析按钮状态标志
        }
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        this.props.actions.getAllQuestionOfThematic({
            body:{},
            success:(data)=>{
                console.log("getAllQuestionOfThematic--===-->",data)
                this.setState({
                    allQuestionList:data,
                    totalNum:(data.length),
                })
                this.getCurrentDate(1);
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    };
    getCurrentDate(page){
        let list = (this.state.allQuestionList).slice((10*page-10),(10*page));
        this.setState({
            currentPage:page,
            currentQuestionList:list
        })
    }
    onChange = (pagenum)=>{
        this.getCurrentDate(pagenum);
    }
    doIt(data){
        let id = data.questionid;
        this.props.actions.getAllChildOfQuestion({
            body:[{id:id}],
            success:(data)=>{
                console.log("getAllChildOfQuestion--===-->",data);
                this.setState({
                    modalVisible:true,
                    currentQuestionId:id,
                    questionDetails:data[0].data})
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    }
    setModalVisible(flag){
        this.setState({modalVisible:flag,jiexiFlag:flag})
    }
    //试题列表
    _questionList(list){
        let arraylist = list;
        console.log(arraylist)
        return arraylist.map(function(item,index){
            let options = item.optionselect;
            let options_end = options.trim().replace(/["\[\]]/g,"");
            let optionArray = options_end.split(",");
            let answerFlag = '';
            return (
                <div className="every-li-css" key={index}>
                    <li>
                        <fieldset className="fieldcontent">
                            <div className="content" dangerouslySetInnerHTML={{__html:item.content}}>
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
                        <div className="fieldtip">
                            <div className="col-md-5">
                                <span>真题：1</span><span>难度：0.5</span>
                            </div>
                            <div className="col-md-7 right">
                                <span onClick={()=>this.doIt(item)}>作答</span>
                            </div>
                        </div>
                    </li>
                </div>
            )
        },this)
    }
    //做题详情页面，弹框显示的内容
    showAnalysis(data){
       this.setState({jiexiFlag:true})
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
                //alert("提交成功")
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    }
    getKnowledge(e){
        console.log($(e.target)[0].innerText)
        let knowledge = $(e.target)[0].innerText;
        console.log("getKnowledge-----constructor--------props--->",this.props.location.pathname)
        this.props.actions.push(`/home/math/knowledge/${knowledge}`)
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
            </fieldset>
        )
    }
    render(){
        return (
            <div className="thematicQues-parts">
                <div className="partOne">
                   这里是每一部分的head内容。可能是表格也可能是其他的东西
                </div>
                <div className="partTwo">
                    <div className="pageslist">
                        <ul>
                            {this._questionList(this.state.currentQuestionList)}
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
                        <Pagination showQuickJumper itemRender={itemRender} pageSize={10} current={this.state.currentPage} total={this.state.totalNum} onChange={this.onChange}></Pagination>
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
        actions: bindActionCreators({push, getAllQuestionOfThematic,getAllChildOfQuestion,getKnowledgeIdList,setThematicQuestionAnswerInfo}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThematicQuesList)