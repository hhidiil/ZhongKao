/**
 * 模考试题
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getExamList} from '../../../../redux/actions/user'
import './question_style.css'

class Exam extends Component{
    constructor(props){
        super(props)
        this.state={
            dataAll:[]

        }
    }
    componentDidMount(){
        this.props.actions.getExamList({
            success:(data)=>{
                console.log("getQuestionList success-->:"+data);
                this.setState({dataAll:JSON.parse(data)})
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    render(){
        const dataAll = this.state.dataAll;
        return(
            <div>
                <header><h2>idiil模考试题</h2></header>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getExamList}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Exam)
