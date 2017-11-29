/**
 * Created by gaoju on 2017/11/23.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getAllQuestionsList} from '../../../../redux/actions/user'
import {getAllExamList} from '../../../../redux/actions/user'
import './style.css'


class QuestionAll extends Component{
    constructor(props){
        super(props);
        this.state={
            itemData:[],
            quiz_again_status:false,
            indexNum:0,
            showStatus:true
        };
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        console.log("this.props.params.quesParam-->"+this.props.params.quesParam)
        if(this.props.params.quesParam=="questions"){
            this.props.actions.getAllQuestionsList({
                body: {
                },
                success: (data) => {
                    console.log("getQuestionsList success-->:"+data);
                    //真实数据的时候可以去掉此判断，判断已在后台执行
                    let data1 = JSON.parse(data);
                    this.setState({itemData:data1,
                        showStatus:true
                    })
                },
                error: (message) => {}
            })
        }else if(this.props.params.quesParam=="exams"){
            this.props.actions.getAllExamList({
                body: {
                },
                success: (data) => {
                    console.log("getAllExamList success-->:"+data);
                    //真实数据的时候可以去掉此判断，判断已在后台执行
                    let data1 = JSON.parse(data);
                    this.setState({
                        itemData:data1,
                        showStatus:false
                    })
                },
                error: (message) => {}
            })
        }
    };
    _renderQuestionPage(items){
        return items.map(function(item,index){
            return(
                <div key={index} className="questionsAll-item">
                    <div className="questionsAll-item1">
                        <div className="title"><h2><a href ={item.url}>{item.title}</a></h2></div>
                        <div className="btn looklook" onClick={()=>this.lookView(item.url)}>查看</div>
                        <div className="btn doexam" onClick={()=>this.doExam(item.url)}>做题</div>
                        <div className="btn quiz_again" onClick={()=>this.quizAgain(item,index)}>二测巩固</div>
                    </div>
                    <div id={"quizAgin"+index} className={(this.state.indexNum==index && this.state.quiz_again_status)?"transtionBefore transtionAfter":"transtionBefore"}>
                        <div className="questionsAll-item2">
                            <div className="title"><h2><a href ={item.expand_practice.url}>{item.expand_practice.title}</a></h2></div>
                            <div className="btn looklook" onClick={()=>this.lookAgainView(item.expand_practice.url)}>查看</div>
                            <div className="btn doexam" onClick={()=>this.doAgainExam(item.expand_practice.url)}>做题</div>
                        </div>
                    </div>
                </div>
            )
        },this);
    }
    _renderExamPage(items){
        return items.map(function(item,index){
            return(
                <div key={index} className="examAll-item">
                    <div className="examAll-item1">
                        <div className="title"><h2><a href ={item.url}>{item.title}</a></h2></div>
                        <div className="btn looklook" onClick={()=>this.lookView2(item.url)}>查看</div>
                        <div className="btn doexam" onClick={()=>this.doExam2(item.url)}>做题</div>
                        <div className="btn quiz_again" onClick={()=>this.quizAgain2(item,index)}>查看结果</div>
                    </div>
                    <div id={"quizAgin"+index} className={this.state.quiz_again_status?"transtionBefore transtionAfter":"transtionBefore"}>
                        <div className="neibu">
                            <div className="title"><h2><a
                                href={item.expand_practice.url}>{item.expand_practice.title}</a></h2></div>
                        </div>
                    </div>
                </div>
            )
        },this);
    }
    lookView(data){
        alert("lookView")
    }
    doExam(data){
        alert("doExam")
    }
    quizAgain(data,index){
        console.log(this.state.quiz_again_status,index)
        let domqiuz = "quizAgin"+index;
        if(data.practice_status == "1"){
            this.setState({
                quiz_again_status : !this.state.quiz_again_status,
                indexNum : index
            });
        }else{
            alert("你还没有做完本套试题一测，请先做完一测！")
        }
    }
    lookAgainView(){
        alert("二测lookView")
    }
    doAgainExam(param){
        let url = 'question';
        console.log(url)
        this.props.actions.push(`/home/math/questions/${url}`);
        //this.props.actions.push('home/math');
    }
    render(){
        const items = this.state.itemData;
        return(
            <div className="questionsAll">
                <header><h2>{this.state.showStatus?'往年真题':'模考'}</h2></header>
                <section>
                    {this.state.showStatus?this._renderQuestionPage(items):this._renderExamPage(items)}
                </section>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getAllQuestionsList,getAllExamList }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAll)