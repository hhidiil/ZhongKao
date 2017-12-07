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
import './style.css'


class QuestionAll extends Component{
    constructor(props){
        super(props);
        this.state={
            quiz_again_status:false,
            indexNum:0,
            showStatus:true//测试为true,模考为false
        };
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        console.log("this.props.params.quesParam-->"+this.props.params.quesParam)
        if(this.props.params.quesParam=="questions"){
            this.props.actions.getAllQuestionsList({});
        }else if(this.props.params.quesParam=="exams"){
            this.props.actions.getAllExamList({});
        }
    };
    _renderShowExplain(data,index){
        return(
            <div id={"quizAgin"+index} className={(this.state.indexNum==index && this.state.quiz_again_status)?"transtionBefore transtionAfter":"transtionBefore"}>
                <div className="questionsAll-item2">
                    <div className="title"><h4>{data.get('title')}</h4></div>
                    <div className="bttn looklook" onClick={()=>this.expand_goto('1')}>查看</div>
                    <div className="bttn doexam" onClick={()=>this.expand_goto('2')}>做题</div>
                </div>
            </div>
            )
    }
    _renderQuestionPage(data){
        let pageSize = data.get('items').size;
        if (pageSize > 0) {
            return data.get('items').map(function(item,index){
                return(
                    <div key={index} className="questionsAll-item">
                        <div className="questionsAll-item1">
                            <div className="title"><h4><a href ={item.get('url')}>{item.get('title')}</a></h4></div>
                            <div className="bttn looklook" onClick={()=>this.question_goto('1')}>查看</div>
                            <div className="bttn doexam" onClick={()=>this.question_goto('2')}>做题</div>
                            <div className="bttn quiz_again" onClick={()=>this.quizAgain(item,index)}>二测巩固</div>
                        </div>
                        {this._renderShowExplain(item,index)}
                    </div>
                )
            },this);
        }
    }
    _renderExamPage(data){
        let pageSize = data.get('items').size;
        if (pageSize > 0) {
            return data.get('items').map(function(item,index){
                return(
                    <div key={index} className="examAll-item">
                        <div className="title">{item.get('title')}</div>
                        <div className="btnContainer">
                            <button type="button" className="btn btn-primary" onClick={()=>this.exam_goto('1')}>查看</button>
                            <button type="button" className="btn btn-primary" onClick={()=>this.exam_goto('2')}>做题</button>
                            <button type="button" className="btn btn-primary" onClick={()=>this.exam_goto('3')}>查看结果</button>
                        </div>
                    </div>
                )
            },this);
        }
    }
    question_goto(data){
        alert("question 试题")
    }
    quizAgain(data,index){
        console.log(this.state.quiz_again_status,index)
        let domqiuz = "quizAgin"+index;
        //判断本套试题有没有测试完成过，只有一测完成了才能二测
        if(data.get('practice_status') == "1"){
            this.setState({
                quiz_again_status : !this.state.quiz_again_status,
                indexNum : index
            });
        }else{
            alert("你还没有做完本套试题一测，请先做完一测！")
        }
    }
    expand_goto(param){
        let url = 'question';
        console.log(url)
        if(param){
            this.props.actions.push(`/home/math/questions/${url}`);
        }
    }
    exam_goto(param){
        let url = 'exam';
        console.log(url)
        if(param){
            this.props.actions.push(`/home/math/exams/${url}`);
        }
    }
    render(){
        const {AllQuestionsList,AllExamList}=this.props;
        //let error = PureRenderMixin.loadDetection([AllQuestionsList,AllExamList]);//深度比较如果两次state没有变化，则不用render
        //if (error) return error

        return(
            <div className="questionsAll">
                <header><h2>{this.state.showStatus?'往年真题':'模考'}</h2></header>
                <section>
                    {this.state.showStatus?this._renderQuestionPage(AllQuestionsList):this._renderExamPage(AllExamList)}
                </section>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        AllQuestionsList:state.AllQuestionsList,
        AllExamList:state.AllExamList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getAllQuestionsList,getAllExamList }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAll)