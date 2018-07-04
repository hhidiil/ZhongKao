/**
 * 知识点页面
 * Created by gaoju on 2018/5/28.
 */
import React,{Component} from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getKnowledgeIdList,getEveryQuestion} from '../../../../redux/actions/math'
import Form from '../../../../components/form/form1'
import './question_style.css'
import ShowMask from '../../../../components/Alter/showMask'
import MultipleChoice from '../../../../components/multipleChoice/index'
import { Menu, Icon,Button } from 'antd'


class Knowledge extends Component{
    constructor(props){
        super(props);
        this.state={
            knowledgeName:props.knowledgeName,//知识点名
            questionListOfKnowledge:[]//知识点对应的所有试题
        }
    }
    componentDidMount(){
        let knowledgeName = this.state.knowledgeName;
        console.log("knowledgeName:::-22222->",knowledgeName)
        this.props.actions.getKnowledgeIdList({
            body:[{knowledgeName:knowledgeName}],
            success:(data)=>{
                console.log(data)
                let newdata=[],alldata = data[0].data;
                for(let i in alldata){
                    newdata[i] = {
                        id:alldata[i].questionid
                    }
                }
                this.props.actions.getEveryQuestion({
                    body:newdata,
                    success:(data)=>{
                        let newData = [];
                        for(let i in data){
                            newData.push((data[i].data)[0])
                        }
                        console.log("hahahahahhaha---33333333-->>>>",newData)
                        this.setState({questionListOfKnowledge:newData})
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
    handleSubmit=(e)=>{
        e.preventDefault();
        console.log("submit")
        //this.props.handleMask();
    }
    _QuestionContent(data){
        if(data.length<1){return <div/>}
        return data.map((item,index)=>{
            return(
                <div key={index} className="practice">
                    <div className="title">
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:item.content}}></li>
                            {item.questiontemplate == "选择题" ?<MultipleChoice type={item.questiontype} answer=""  index={index} choiceList={item.optionselect} />:''}
                        </ul>
                    </div>
                </div>
            )
        })
    }
    render(){
        let quetionList = this.state.questionListOfKnowledge;
        return(
            <div>
                <ShowMask></ShowMask>
                <div className="maskknowledge">
                    <div className="math-question-content">
                        <header>
                            <div className="title" id="title">{this.state.knowledgeName}</div>
                            <button type="button" className="btn btn-default" onClick={()=>this.exitBack()}>关闭</button>
                        </header>
                        <section>
                            <div className="form1">
                                <form onSubmit={this.handleSubmit}>
                                    {this._QuestionContent(quetionList)}
                                    <button type="submit" className="btn btn-primary submit_btn">提交</button>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getKnowledgeIdList,getEveryQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Knowledge)
