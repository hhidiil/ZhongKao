/**
 * Created by gaoju on 2017/11/23.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getAllExamList} from '../../../../redux/actions/user'
import './style.css'


class ExamAll extends Component{
    constructor(props){
        super(props);
        this.state={
            itemData:[],
            quiz_again_status:false
        };
    }
    componentDidMount(){
        this.props.actions.getAllExamList({
            body: {
            },
            success: (data) => {
                console.log("getQuestionsList success-->:"+data);
                //真实数据的时候可以去掉此判断，判断已在后台执行
                let data1 = JSON.parse(data);
                this.setState({itemData:data1})
            },
            error: (message) => {}
        })
    };
    _renderItemPage(items){
        return items.map(function(item,index){
            return(
                <div key={index} className="examAll-item">
                    <div className="examAll-item1">
                        <div className="title"><h2><a href ={item.url}>{item.title}</a></h2></div>
                        <div className="btn looklook" onClick={()=>this.lookView(item.url)}>查看</div>
                        <div className="btn doexam" onClick={()=>this.doExam(item.url)}>做题</div>
                        <div className="btn quiz_again" onClick={()=>this.quizAgain(item,index)}>查看结果</div>
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
        console.log(this.state.quiz_again_status)
        this.setState({
            quiz_again_status : !this.state.quiz_again_status
        });
    }
    render(){
        const items = this.state.itemData;
        return(
            <div className="questionsAll">
                <header><h2>模考</h2></header>
                <section>
                    {this._renderItemPage(items)}
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
        actions: bindActionCreators({ push,getAllExamList }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamAll)