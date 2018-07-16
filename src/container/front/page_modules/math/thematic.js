/**
 * 考纲复习(知识点)页面
 * Created by gaoju on 2018/5/16.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'
import {requestData} from '../../../../method_public/public'
import {Pagination,Modal,message} from 'antd'
import {Storage_S} from '../../../../config'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getAllQuestionOfThematic,getAllChildOfQuestion,getKnowledgeIdList,setThematicQuestionAnswerInfo} from '../../../../redux/actions/math'
import {getProvinceList} from '../../../../redux/actions/page'
import MultipleChoice from '../../../../components/multipleChoice/index'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import Knowledge from './knowledge.js'
import { Collapse,Select } from 'antd';
const Panel = Collapse.Panel;
const Option = Select.Option;

function callback(key) {
    console.log(key);
}
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
class Thematic extends Component{
    constructor(props) {
        super(props)
        this.state = {
            knowledgeList:[],
            modalVisible:false,
            DialogMaskFlag:false,
            knowledgeName:'',
            whichPart:1,
            currentPage:1,
            totalNum:0,
            allQuestionList:[],//当前模块的所有试题
            selectQuestionList:[],//条件选择后的所有试题
            currentQuestionList:[],//当前页面所显示的试题
            currentQuestionId:'',
            questionDetails:[],//点击作答页面显示的试题详情
            jiexiFlag:false//解析按钮状态标志
        }
    }
    componentDidMount(){
        let _this = this;
        requestData('../src/data/knowledge.json',{},function(data){
            console.log("knowlege---->>>>",data)
            _this.setState({knowledgeList:data})
        })
        //获取省份列表
        this.props.actions.getProvinceList({});
        this.props.actions.getAllQuestionOfThematic({
            body:{},
            success:(data)=>{
                console.log("getAllQuestionOfThematic--===-->",data)
                this.setState({
                    allQuestionList:data,
                    totalNum:(data.length)
                })
                this.getCurrentDate('全部')
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    };
    getCurrentDate(type){
        let list = (this.state.allQuestionList);
        let newList = [];
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
            currentQuestionList:nowPageList
        })
    }
    onPageChange = (pagenum)=>{
        let nowPageList = (this.state.selectQuestionList).slice((10*pagenum-10),(10*pagenum));
        this.setState({
            currentPage:pagenum,
            currentQuestionList:nowPageList
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
    _optionList(data){
        let options = data.get('items');
        if(options.size>0){
            return options.map((item,index)=>{
                return <Option key={item.get('province')}>{item.get('province')}</Option>
            })
        }
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
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    }
    knowledgeSummary(key){
        //this.getCurrentDate(key);
    }
    getKnowledge(e){
        console.log($(e.target)[0].innerText)
        let knowledge = $(e.target)[0].innerText;
        console.log("getKnowledge-----constructor--------props--->",this.props.location.pathname)
        //this.props.actions.push(`/home/math/knowledge/${knowledge}`)
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
            default: this.getCurrentDate('全部');
                break;
        }
    }
    handleChange(value){
        console.log(`Selected: ${value}`);
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
    render(){
        let { provinceList } = this.props;
        let error = PureRenderMixin.Compare([provinceList]);//优化render
        if (error) return error
        const knowlist = this.state.knowledgeList;
        if(knowlist.length<1){
            return <div/>
        }
        return (
            <div className="mask2" style={{backgroundColor:'#eac28c'}}>
                <div className="thematic-wapper">
                    <div className="thematic-parts-left">
                        <div className="menuList">
                            <Collapse onChange={callback}>
                                {knowlist.map((item,index)=>{
                                    return <Panel header={item.name} key={index}>
                                        {(item.list).map((item2,index2)=>{
                                            return <Collapse key={index2}>
                                                <Panel header={item2.name} key={index2}>
                                                    {(item2.list).map((item3,index3)=>{
                                                        return <p key={index3}><a>{item3}</a></p>
                                                    },this)}
                                                </Panel>
                                            </Collapse>
                                        },this)}
                                    </Panel>
                                },this)}
                            </Collapse>
                        </div>
                    </div>
                    <section className="thematic-parts-right" style={{backgroundColor:'rgba(161, 101, 220, 0.76)'}}>
                        <div className="thematicQues-parts">
                            <div className="partTop">
                                <div className="parts" onClick={()=>{this.knowledgeSummary(1)}}><div>知识点回顾</div><div>（考点梳理）</div></div>
                                <div className="parts" onClick={()=>{this.knowledgeSummary(2)}}><div>重点考点、备考思路</div><div>（例题解析+习题训练）</div></div>
                                <div className="parts" onClick={()=>{this.knowledgeSummary(3)}}><div>聚焦中考</div><div>（针对性训练）</div></div>
                                <div className="parts" onClick={()=>{this.knowledgeSummary(4)}}><div>真题过关</div><div>（简单、中等、拔高）</div></div>
                            </div>
                            <div className="partOne" style={{backgroundColor:'white'}}>
                                <div className="selectorLine">
                                    <div className="selector-key"><strong>地区：</strong></div>
                                    <div className="selector-value">
                                       <Select size="default" defaultValue="全部" onChange={this.handleChange} style={{ width: 100,height:26 }}>
                                           <Option key="全部">全部</Option>
                                           {this._optionList(provinceList)}
                                       </Select>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="selectorLine">
                                    <div className="selector-key"><strong>题型：</strong></div>
                                    <div className="selector-value">
                                        <ul>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>全部</a></li>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>选择题</a></li>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>填空题</a></li>
                                            <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>简答题</a></li>
                                        </ul>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="questionNumber">找到<span style={{color:'red'}}>{this.state.totalNum}</span>个相关题</div>
                             </div>
                            {/*<div className="partOne">
                             这里是每一部分的head内容。可能是表格也可能是其他的东西
                             </div>*/}
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
                                    <Pagination showQuickJumper itemRender={itemRender} pageSize={10} current={this.state.currentPage} total={this.state.totalNum} onChange={this.onPageChange}></Pagination>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="clearfix"></div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        provinceList: state.provinceList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getAllQuestionOfThematic,getProvinceList,getAllChildOfQuestion,getKnowledgeIdList,setThematicQuestionAnswerInfo}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Thematic)