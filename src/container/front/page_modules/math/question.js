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
import { Pagination } from 'antd';

class Question extends Component{
    constructor(props){
        super(props)
        this.state={
            dataAll:[],
            current: 1,
            total:5,
            flag:false,
            questionParams:{},
            questions:{}
        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            body:{
                param:'Exam_19008687-3c57-4105-8b6c-18205a4616a3.json'
            },
            success:(data)=>{
                console.log("ALL success-->:"+data);
                let new_data = JSON.parse(data);//解析JSON
                let data_len = new_data.subquestions.length;//本套试题的所有题目数
                let data_question = new_data.subquestions[0];//本套试题的第一道题,默认
                this.setState({
                    dataAll:new_data,
                    total:data_len,
                    questionParams:data_question
                })
                this.requestQuestion(this.state.questionParams,"Content")
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    componentWillMount(){
    }
    requestQuestion(data,type){
        let dataitem = data;
        let content_json = "";
        console.log("content_json type---->"+type)
        switch (type){
            case 'Content' : content_json = dataitem.Content[0]; break;
            case 'Objective' :  content_json = dataitem.Objective[0]; break;
            case 'Analysis' :   content_json = dataitem.Analysis[0]; break;
            case 'Explain' :    content_json = dataitem.Explain[0]; break;
            case 'Exercise1' :  content_json = dataitem.Exercise1[0]; break;
            case 'Exercise2':   content_json = dataitem.Exercise2[0]; break;
            default:    content_json = dataitem.Content[0]; break;
        }
        console.log(content_json)
        this.props.actions.getQuestionList({
            body:{
                param:"Question/" + content_json + ".json"
            },
            success:(data)=>{
                console.log("requestQuestion success-->:"+data);
                this.setState({
                    questions:JSON.parse(data),
                    flag:true
                })
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    _contentQtxt(data){
        return (
            <ul>
                <li>{data.content}</li>
                <li>
                    <p>
                    <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                        <span>(A)</span><span>{data.selectoptions[0]}</span></label>
                    <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                        <span>(B)</span><span>{data.selectoptions[1]}</span></label>
                    <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                        <span>(C)</span><span>{data.selectoptions[2]}</span></label>
                    <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                        <span>(D)</span><span>{data.selectoptions[3]}</span></label>
                    </p>
                </li>
                <li>考点：<b>{data.knowledge}</b></li>
            </ul>
        )
    }
    onChange = (page) => {
        console.log(page);
        this.setState({
            current: page
        });
    }
    exitBack(){
        this.props.actions.push("/home/math/questions")
    }
    render(){
        const dataAll = this.state.dataAll;
        const questions = this.state.questions;
         const params = this.state.questionParams;
        return(
            <div className="mask">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{dataAll.topic}</div>
                        <div className="exit" onClick={this.exitBack.bind(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="pagination_content">
                        <div className="pagination_before"><Pagination current={this.state.current} pageSize={1}  onChange={this.onChange} total={this.state.total} /></div>
                        <div className="btnContainer" id="btnContainer">
                            <button id="Content_exer" type="button" className="btn btn-primary"
                                    onClick={()=>this.requestQuestion(this.state.questionParams,"Content")}>
                                返回原题
                            </button>
                            <button id="Objective_exer" type="button" className="btn btn-primary " style={params.Objective<1 ?{display:"none"}:{display:""}}
                                    onClick={()=>this.requestQuestion(params,"Objective")} >
                                观察/想法
                            </button>
                            <button id="Analysis_exer" type="button" className="btn btn-primary" style={params.Analysis<1 ?{display:"none"}:{display:""}}
                                    onClick={()=>this.requestQuestion(params,"Analysis")} >
                                提示分析
                            </button>
                            <button id="Explain_exer" type="button" className="btn btn-primary" style={params.Explain<1 ?{display:"none"}:{display:""}}
                                    onClick={()=>this.requestQuestion(params,"Explain")}>
                                简解引导
                            </button>
                            <button id="Exercise1_exer" type="button" className="btn btn-primary" style={params.Exercise1<1 ?{display:"none"}:{display:""}}
                                    onClick={()=>this.requestQuestion(params,"Exercise1")} >
                                巩固练习
                            </button>
                            <button id="Exercise2_exer" type="button" className="btn btn-primary" style={params.Exercise2<1 ?{display:"none"}:{display:""}}
                                    onClick={()=>this.requestQuestion(params,"Exercise2")} >
                                拓展练习
                            </button>
                        </div>
                    </div>
                    <section className="QtxtContent">
                        <div id="Content_Qtxt" className="QContet">
                            {this.state.flag ? this._contentQtxt(questions):""}
                        </div>
                        <div id="Analysis_Qtxt" className="QContet"></div>
                        <div id="Exercise1_Qtxt" className="QContet"></div>
                        <div id="Exercise2_Qtxt" className="QContet"></div>
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
