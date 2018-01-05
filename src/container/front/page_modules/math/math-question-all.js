/**
 * Created by gaoju on 2017/11/23.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getAllQuestionsList} from '../../../../redux/actions/math'
import {getAllExamList} from '../../../../redux/actions/math'
import Preview from './preview'
import { Button } from 'antd';
import './style.css'


class QuestionAll extends Component{
    constructor(props){
        super(props);
        this.state={
            quiz_again_status:false,
            indexNum:0,
            showStatus:true,//测试为true,模考为false
            allList:[],
            previewFlag:false
        };
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        if(this.props.params.quesParam=="questions"){
            console.log("-----------questions-----------------")
            this.props.actions.getAllQuestionsList({
                success:(data)=>{
                    this.setState({
                        showStatus:true,
                        allList:data
                    })
                },
                error:(message)=>{console.warn("数据错误")}
            });
        }else if(this.props.params.quesParam=="exams"){
            console.log("-----------exams-----------------")
            this.props.actions.getAllExamList({
                success:(data)=>{
                    this.setState({
                        showStatus:false,
                        allList:data
                    })
                },
                error:(message)=>{console.warn("数据错误")}
            });
        }
    };
    _renderShowExplain(data,index){
        return(
            <div id={"quizAgin"+index} className={(this.state.indexNum==index && this.state.quiz_again_status)?"transtionBefore transtionAfter":"transtionBefore"}>
                <div className="questionsAll-item-content">
                    <div className="title2"><p>{data.title}</p></div>
                    <div className="btn_list">
                        <Button type="dashed" className="bttn" onClick={()=>this.preview(data)}>预览</Button>
                        <Button type="dashed" className="bttn" onClick={()=>this.expand_goto('2')}>巩固训练</Button>
                    </div>
                </div>
            </div>
            )
    }
    _renderQuestionPage(data){
        let pageSize = data.length;
        if (pageSize > 0) {
            return data.map(function(item,index){
                return(
                    <div key={index} className="questionsAll-item">
                        <div className="questionsAll-item-content">
                            <div className="title"><p><a href ={item.url}>{item.title}</a></p></div>
                            <div className="btn_list">
                                <Button type="dashed" className="bttn " onClick={()=>this.preview()}>预览</Button>
                                <Button type="dashed" className="bttn " onClick={()=>this.gotoPractice()}>训练</Button>
                                <Button type="dashed" className="bttn " onClick={()=>this.quizAgain(item,index)}>巩固练习</Button>
                            </div>
                        </div>
                        {this._renderShowExplain(item,index)}
                    </div>
                )
            },this);
        }
    }
    _renderExamPage(data){
        let pageSize = data.length;
        if (pageSize > 0) {
            return data.map(function(item,index){
                return(
                    <div key={index} className="examAll-item">
                        <div className="title">{item.title}</div>
                        <div className="btnContainer">
                            <button type="button" className="btn btn-primary" onClick={()=>this.preview()}>预览</button>
                            <button type="button" className="btn btn-primary" onClick={()=>this.exam_goto('1')}>测试</button>
                            <button type="button" className="btn btn-primary" onClick={()=>this.exam_goto('2')}>查看结果</button>
                        </div>
                    </div>
                )
            },this);
        }
    }
    gotoPractice(){
        this.props.actions.push(`/home/math/questions/practice`);
    }
    quizAgain(data,index){
        let domqiuz = "quizAgin"+index;
        //判断本套试题有没有测试完成过，只有一测完成了才能二测
        if(data.practice_status == "1"){
            this.setState({
                quiz_again_status : !this.state.quiz_again_status,
                indexNum : index
            });
        }else{
            alert("你还没有做完本套试题一测，请先做完一测！")
        }
    }
    preview(){
        console.log("预览")
        this.setState({previewFlag : true});
    }
    closePreview(){
        console.log("关闭预览")
        this.setState({previewFlag : false});
    }
    expand_goto(param){
        let url = 'question';
        if(param){
            this.props.actions.push(`/home/math/questions/${url}`);
        }
    }
    goto_practice(param){
        let url = 'question';
        if(param){
            this.props.actions.push(`/home/math/questions/${url}`);
        }
    }
    exam_goto(param){
        let url = 'exam';
        if(param == '1'){
            this.props.actions.push(`/home/math/exams/${url}`);
        }else if(param == '2'){
            this.props.actions.push(`/home/math/exams/exam2`);
        }
    }
    render(){
        return(
            <div className="questionsAll">
                <header><h2>{this.state.showStatus?'往年真题':'模考'}</h2></header>
                <section>
                    {this.state.showStatus?this._renderQuestionPage(this.state.allList):this._renderExamPage(this.state.allList)}
                </section>
                {this.state.previewFlag?<Preview closePreview={()=>this.closePreview()} />:<div/>}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        AllQuestionsList:state.AllQuestionsList || [],
        AllExamList:state.AllExamList || []
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getAllQuestionsList,getAllExamList }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAll)