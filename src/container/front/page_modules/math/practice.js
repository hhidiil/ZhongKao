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
import {getQuestionList,getQuestion} from '../../../../redux/actions/math'
import Timing from '../../../../components/timing'
import EditContent from '../../../../components/editer'
import PureRenderMixin from '../../../../method_public/pure-render'
import './question_style.css'
import { Pagination } from 'antd';

class Question extends Component{
    constructor(props){
        super(props);
        this.state={
            JSON_aLL:"Exam_19008687-3c57-4105-8b6c-18205a4616a3.json",//某套题的JSON串，可取到某套试题的所有数据
            cleartimeflag:false,
            current:1,//当前题号
            totalNum:0,//试题总数
            all_question:[],//所有题目
            dataAll:[],//整套试卷
            sentList:[],//组装答案列表，用来发送存储源数据
            questionType:'X'//题目类型
        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            body:{
                param : this.state.JSON_aLL
            },
            success:(data)=>{
                let new_data = data;//解析JSON
                let data_len = new_data.subquestions.length;//本套试题的所有题目数
                let all_question = new_data.subquestions;
                this.getData(all_question[0])
                this.setState({
                    dataAll:new_data,
                    totalNum:data_len,
                    all_question:all_question
                })
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
        //离开route的钩子处理事件
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
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
        this.props.actions.getQuestion({param : data.Content+'.json'})
    }
    _contentQtxt(data,index){
        let items = data.get('items');
        let option = items.get('selectoptions');
        let content = items.get('content');
        if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
            content = content.replace(/\s|_/g, '');
            content = content.replace(/blank/g, '<input type="text" class="input_blank"/>');
        }
        return (
            <div>
                <div className="displayflex QtxtContent_main_title">
                    <div className="QtxtContent_main_title_left">选择题：</div>
                </div>
                <div className="padding10">
                    <ul>
                        <li dangerouslySetInnerHTML={{__html:content}}></li>
                        <li>
                            { option.size<1 ? "":<p>
                                <label className="checkbox-inline"><input type="radio" value="A" name={"Qopts_selects"+index} />
                                    <span>(A)</span><span dangerouslySetInnerHTML={{__html:option.get(0)}}></span></label>
                                <label className="checkbox-inline"><input type="radio" value="B" name={"Qopts_selects"+index} />
                                    <span>(B)</span><span dangerouslySetInnerHTML={{__html:option.get(1)}}></span></label>
                                <label className="checkbox-inline"><input type="radio" value="C" name={"Qopts_selects"+index} />
                                    <span>(C)</span><span dangerouslySetInnerHTML={{__html:option.get(2)}}></span></label>
                                <label className="checkbox-inline"><input type="radio" value="D" name={"Qopts_selects"+index} />
                                    <span>(D)</span><span dangerouslySetInnerHTML={{__html:option.get(3)}}></span></label>
                            </p>}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    onChange = (page) => {
        console.error("onChange---",page)
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
    nextSubmit(page,answer){
        var isright = false;
        console.log('submit:',page,answer,this.state.questionType)
        var targetDom = '';
        var nextpage = page+1;
        if(this.state.current <=10){
            let doms = document.getElementsByTagName("input");
            //获取选择的答案
            for(let i=0;i<doms.length;i++){
                if(doms[i].checked){
                    targetDom = doms[i];
                }
            }
            //选择答案后执行
            if(targetDom){
                if(targetDom.value == answer){
                    isright = true;
                    console.log('选择正确')
                }else{
                    isright = false;
                    console.log('选择错误')
                }
                this.state.sentList[page-1] = {id:page,selectvalue:targetDom.value,isright:isright};
                let sentList = this.state.sentList;
                console.log("sentList====>",nextpage,sentList.length,sentList)
                this.setState({
                    current: nextpage,
                    sentList:sentList
                })
                this.getData(this.state.all_question[page])
            }else {
                alert('请选择一个答案！')
            }
        }else{
            this.state.sentList[page-1] = {id:page,selectvalue:'',isright:isright};
            let sentList = this.state.sentList;
            this.setState({
                current: nextpage,
                sentList:sentList
            })
            this.getData(this.state.all_question[page])
        }
    }
    submit(){
        alert("全部提交")
    }
    render(){
        console.warn("----------------render------------")
        const {GetQuestion} = this.props;
        let error = PureRenderMixin.Compare([GetQuestion]);
        if (error) return error;
        let answer = (GetQuestion.get('items')).get('answer');
        let title = (this.state.dataAll).topic;
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
                            {this.state.current <= 10?"":<EditContent/>}
                        </div>
                    </section>
                    <button type="button" className="btn btn-primary next_btn" disabled={(this.state.current==this.state.totalNum)?true:false} onClick={()=>this.nextSubmit(this.state.current,answer)}>下一题</button>
                    <button type="button" className="btn btn-primary submit_btn" disabled={(this.state.current==this.state.totalNum)?false:true} onClick={()=>this.submit(this)}>全部提交</button>
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
    questionType: PropTypes.string,
    JSON_aLL: PropTypes.string,
    cleartimeflag: PropTypes.bool
}
function mapStateToProps(state) {
    return {
        GetQuestion:state.GetQuestion,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getQuestionList,getQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
