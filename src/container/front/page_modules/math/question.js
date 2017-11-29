/**
 * 试题
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList} from '../../../../redux/actions/user'
import './question_style.css'

class Question extends Component{
    constructor(props){
        super(props)
        this.state={
            dataAll:[]

        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            success:(data)=>{
                console.log("getQuestionList success-->:"+data);
                this.setState({dataAll:JSON.parse(data)})
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    exitBack(){
        console.log("exitback")
        this.props.actions.push("/home/math/questions")
    }
    render(){
        const dataAll = this.state.dataAll;
        return(
            <div className="mask">
                <div className="math-question-content">
                    <header>
                        <div className="title">2017年全国统一考试卷</div>
                        <div className="exit" onClick={this.exitBack.bind(this)}>退出</div>
                    </header>
                    <section>

                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getQuestionList}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
