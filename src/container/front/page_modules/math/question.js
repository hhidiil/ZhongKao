/**
 * 试题
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList} from '../../../../redux/actions/math'
import './question_style.css'
import { Pagination } from 'antd';

class Question extends Component{
    constructor(props){
        super(props);
        this.state={
            JSON_aLL:"Exam_19008687-3c57-4105-8b6c-18205a4616a3.json",//某套题的JSON串，可取到某套试题的所有数据
            dataAll:[],
            current: 1,
            total:5,
            flag:false,
            questionNum:0,//当前题号
            questions:[],
            questionParams:{},//具体某道题所有数据,默认第一道题
            analysisFlag:false,//试题分析显示标志
            analysisQuestions:{}//具体某道题的分析
        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            body:{
                param : this.state.JSON_aLL
            },
            success:(data)=>{
                let new_data = JSON.parse(data);//解析JSON
                let data_len = new_data.subquestions.length;//本套试题的所有题目数
                let data_question = new_data.subquestions[this.state.questionNum];
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
    requestQuestion(data,type){
        let dataitem = data;
        let content_json = [];//取数据的参数

        let content = dataitem.Content;
        console.log("content_json type---->"+type)
        switch (type){
            case 'Content' : content_json = dataitem.Content; break;
            case 'Objective' :  content_json = dataitem.Objective; break;
            case 'Analysis' :   content_json = dataitem.Analysis; break;
            case 'Explain' :    content_json = dataitem.Explain; break;
            case 'Exercise1' :  content_json = dataitem.Exercise1; break;
            case 'Exercise2':   content_json = dataitem.Exercise2; break;
            default:    content_json = dataitem.Content; break;
        }
        console.log(content_json,content_json.length);
        //判断每一部分题的长度，即：是否有多个题
        for(let i=0;i<content_json.length;i++){
            let json = content_json[i];
            //var return_content=[];//返回的数据
            this.props.actions.getQuestionList({
                body:{
                    param:"Question/" + json + ".json"
                },
                success:(data)=>{
                   return JSON.parse(data);
                    //this.setState({
                    //    questions:JSON.parse(data),
                    //    flag:true,
                    //    analysisFlag:false
                    //})
                },
                error:(mes)=>{
                    console.error('数据接收发生错误');
                }
            })
            console.log(return_content)
        }
        //console.log(this.state.questions)

        //this.props.actions.getQuestionList({
        //    body:{
        //        param:"Question/" + content_json + ".json"
        //    },
        //    success:(data)=>{
        //        console.log("requestQuestion success-->:"+data);
        //        if(type == "Analysis"){
        //            this.setState({
        //                analysisQuestions:JSON.parse(data),
        //                flag:true,
        //                analysisFlag:true
        //            })
        //        }else{
        //            this.setState({
        //                questions:JSON.parse(data),
        //                flag:true,
        //                analysisFlag:false
        //            })
        //        }
        //
        //    },
        //    error:(mes)=>{
        //        console.error('数据接收发生错误');
        //    }
        //})
    }
    _contentQtxt(data){
        return (
            <div>
                <ul>
                    <li dangerouslySetInnerHTML={{__html:data.content}}></li>
                    <li>
                        <p>
                            <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                                <span>(A)</span><span dangerouslySetInnerHTML={{__html:data.selectoptions[0]}}></span></label>
                            <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                                <span>(B)</span><span dangerouslySetInnerHTML={{__html:data.selectoptions[1]}}></span></label>
                            <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                                <span>(C)</span><span dangerouslySetInnerHTML={{__html:data.selectoptions[2]}}></span></label>
                            <label className="checkbox-inline"><input type="radio" title="A" name="Qopts_selects" />
                                <span>(D)</span><span dangerouslySetInnerHTML={{__html:data.selectoptions[3]}}></span></label>
                        </p>
                    </li>
                    <li><span>考点：</span><span dangerouslySetInnerHTML={{__html:data.knowledge}}></span></li>
                </ul>
            </div>
        )
    }
    _analysisQtxt(data){
        return (
            <div>
                <ul>
                    <li dangerouslySetInnerHTML={{__html:data.content}}></li>
                    <li>考点：<b>{data.knowledge}</b></li>
                </ul>
            </div>

        )
    }
    onChange = (page) => {
        console.log(page-1);
        let newpage = page-1;
        let data_question = this.state.dataAll.subquestions[newpage];
        this.requestQuestion(data_question,"Content")
        this.setState({
            questionParams:data_question,
            current: page,
            questionNum : newpage
        })
        console.log(this.state.questionParams)

    }
    exitBack(){
        this.props.actions.push("/home/math/questions")
    }
    render(){
        const dataAll = this.state.dataAll;
        const questions = this.state.questions;
        const analysisQuestions = this.state.analysisQuestions;
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
                                扩展练习
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
                        <div>
                            <div id="Content_Qtxt" className="QContet">
                                {this.state.flag ? this._contentQtxt(questions):""}
                            </div>
                            <div id="Analysis_Qtxt" className="QContet">
                                {this.state.analysisFlag ? this._analysisQtxt(analysisQuestions):""}
                            </div>
                        </div>
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
