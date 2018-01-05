/**
 * 训练，测试的
 * Created by gaoju on 2017/12/29.
 */
import React,{Component} from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion,setTiming} from '../../../../redux/actions/math'
import Timing from '../../../../components/timing'
import PureRenderMixin from '../../../../method_public/pure-render'
import './question_style.css'
import { Pagination } from 'antd';

class Question extends Component{
    constructor(props){
        console.warn("11111111111111111---------constructor--------1111111111111111111111")
        super(props);
        this.state={
            JSON_aLL:"Exam_19008687-3c57-4105-8b6c-18205a4616a3.json",//某套题的JSON串，可取到某套试题的所有数据
            cleartimeflag:false,
            current:1,//当前题号
            totalNum:0,//试题总数
            all_question:[],//所有题目
            dataAll:[],//整套试卷
            errList:[],//错误题号列表
            questionType:'X'//题目类型
        }
    }
    componentWillMount(){
        console.log("------------------componentWillMount-------------")
    }
    componentWillReceiveProps(nextProps){
        console.warn("----------------componentWillReceiveProps------------")
    }
    shouldComponentUpdate(nextProps, nextState){
        console.warn("----------------shouldComponentUpdate------------")
        return true
    }
    componentWillUpdate(nextProps, nextState){
        console.warn("----------------componentWillUpdate------------")
    }
    componentDidUpdate(){
        console.warn("----------------componentDidUpdate------------")
    }
    componentDidMount(){
        console.warn("----------------componentDidMount------------")
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
        let aaa = $('#Content_Qtxt').find('input[type=radio]');
        console.log("targetdom:::::::",aaa)
        //离开route的钩子处理事件
        //this.props.router.setRouteLeaveHook(
        //    this.props.route,
        //    this.routerWillLeave
        //)
    }
    routerWillLeave=(nextLocation)=> {
        // 返回 false 会继续停留当前页面，否则，返回一个字符串，会显示给用户，让其自己决定
            if(confirm('确认要离开？')){
                console.log("routerWillLeave")
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
        console.log(page)
        //试题类型。先这样写以后有真是数据判断
        if(page<=10){
            this.setState({
                questionType:'X',
                current: page
            })
        }else if(page<=16){
            this.setState({
                questionType:'T',
                current: page
            })
        }else{
            this.setState({
                questionType:'Z',
                current: page
            })
        }
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
    submit(page,answer){
        console.log('submit',page,answer,this.state.questionType)
        let targetDom = '';
        if(this.state.questionType == 'X'){
            console.log("find the dom")
            let doms = document.getElementsByTagName("input");
            for(let i=0;i<doms.length;i++){
                if(doms[i].checked){
                    targetDom = doms[i];
                }
            }
        }
        if(targetDom){
            console.log(targetDom)
            let nextpage = page+1;
            if(targetDom.value == answer){
                console.log('选择正确')
            }else{
                alert('选择错误')
            }
            this.setState({
                current: nextpage
            })
            this.getData(this.state.all_question[nextpage])
        }else {
            alert('请选择一个答案！')
        }

    }
    render(){
        console.warn("----------------render------------")
        const {GetQuestion} = this.props;
        let error = PureRenderMixin.Compare([GetQuestion]);
        if (error) return error;
        console.log("timeflag-----------------------",this.state.cleartimeflag)
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
                            请您在后面的输入框中输入<span className="mark">x^2</span>：<span className="mathquill-editable"></span><br/>
                            <p>
                                <textarea className="contentArea"></textarea>
                            </p>
                        </div>
                    </section>
                    <button type="button" className="btn btn-primary submit_btn" onClick={()=>this.submit(this.state.current,answer)}>提交</button>
                    <button type="button" className="btn btn-primary" onClick={()=>{this.setState({cleartimeflag:true})}}>停止</button>
                </div>
            </div>
        )
    }
}
//<div id="content" contentEditable="true" className="editDemo">
//    编辑框一
//</div>
//Question.propTypes = {
//    value: PropTypes.number.isRequired,
//    onIncreaseClick: PropTypes.func.isRequired
//}
function mapStateToProps(state) {
    return {
        GetQuestion:state.GetQuestion,
        TimingFlag:state.TimingFlag
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getQuestionList,getQuestion,setTiming}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
