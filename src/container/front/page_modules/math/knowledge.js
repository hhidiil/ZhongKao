/**
 * 知识点页面
 * Created by gaoju on 2018/5/28.
 */
import React,{Component} from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getKnowledgeIdList,getQuestion} from '../../../../redux/actions/math'
import Form from '../../../../components/form/form1'
import './question_style.css'
import { Menu, Icon,Button } from 'antd'


class Knowledge extends Component{
    constructor(props){
        super(props);
        this.state={
            knowledgeName:props.knowledgeName
        }
    }
    componentDidMount(){
        let knowledgeName = this.state.knowledgeName;
        console.log("knowledgeName:::-22222->",knowledgeName)
        this.props.actions.getKnowledgeIdList({
            body:[{knowledgeName:'有理数的大小比较'}],
            success:(data)=>{
                console.log(data)
                let newdata=[],alldata = data[0].data;
                for(let i in alldata){
                    newdata[i] = {
                        id:alldata[i].questionid
                    }
                }
                this.props.actions.getQuestion({
                    body:newdata,
                    success:(data)=>{
                        console.log("hahahahahhaha----->>>>",data[0].data)
                    },
                    error:(message)=>{
                        console.log(message)
                    }
                })
            },
            error:(message)=>{
                console.log(message)
            }
        })
    }
    exitBack(){
        this.props.closeKnowledge();
    }
    render(){
        return(
            <div className="maskknowledge">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">反比例函数</div>
                        <button type="button" className="btn btn-default" onClick={()=>this.exitBack()}>关闭</button>
                    </header>
                    <section>
                        <Form></Form>
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
    return { actions: bindActionCreators({push,getKnowledgeIdList,getQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Knowledge)
