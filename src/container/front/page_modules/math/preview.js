/**
 * 预览查看试题
 * Created by gaoju on 2017/12/15.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion} from '../../../../redux/actions/math'
import ShowMask from '../../../../components/Alter/showMask'
import {requestData} from '../../../../method_public/public'
import {Button} from 'antd'

class Preview extends Component{
    constructor(props){
        super(props)
        let alldata = props.data;
        let questionDetails = [];
        if((alldata.doneDetails.data).length > 0){
            questionDetails = JSON.parse(alldata.doneDetails.data[0].ExamResult);
        }
        console.log('this.state.alldata=========>',alldata,questionDetails)
        this.state={
            questionDetails:questionDetails,
            JSON_aLL:alldata.examid,//某套题的试卷id，可取到某套试题的所有数据
            paper_title:alldata.exampaper,//试卷标题
            type:props.type || '',
            questions:[]
        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            body:[{id:this.state.JSON_aLL}],
            success:(data)=>{
                let all_question = data[0].data;//解析JSON
                this.getData(all_question)
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    getData(data){
        var dataArray=[];
        for(let i=0;i<data.length;i++){
            dataArray.push({id:data[i].questionid})
        }
        this.props.actions.getQuestion({
            body:dataArray,
            success:(data)=>{
                if(this.state.type == '1'){//结果预览有答案及错误情况
                    let details = this.state.questionDetails;
                    for(let i in data){
                        data[i].details =details[i];
                    }
                }
                this.setState({questions:data})
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
        })
    }
    _showQuestionList(data){
        return data.map(function(item,index){
            let detail = item.details;
            let newitem = item.data[0];
            let content = (newitem.content);
            let options = newitem.optionselect;
            let childs = newitem.childs;
            $.trim(options);//去掉前后的空格
            let ss = options.replace(/["\[\]]/g,"");
            let optionArray = ss.split(",");
            var base = new Base64();//base64对象
            let detailFlag = true;
            let answerFlag = '';
            if(detail && detail.Contents.length>0){
                detailFlag = (detail.Contents[0]).IsTrue;
                answerFlag = (detail.Contents[0]).content;
            }
            if(content){
                if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                    content = content.replace(/\s|_/g, '');
                    content = content.replace(/blank|BLANK/g, '___');
                }
                return(
                    <div key={index} className={detailFlag?'question-css':'question-css-err'}>
                        {detailFlag?'':<img style={{width:'20px',position:'absolute',left:'5px'}} src="public/images/error.png"/>}
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            <li>
                                { optionArray.length<4 ? "":<p>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='A' ? 'question-answer-2':'question-answer-1'}>(A)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[0])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='B' ? 'question-answer-2':'question-answer-1'}>(B)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[1])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='C' ? 'question-answer-2':'question-answer-1'}>(C)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[2])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='D' ? 'question-answer-2':'question-answer-1'}>(D)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[3])}}></span></label>
                                </p>}
                            </li>
                            {childs.length<1?"":this._childsList(childs)}
                        </ul>
                    </div>
                )
            }
        },this)
    }
    render(){
        let title = this.state.paper_title;
        let dataitem = this.state.questions;
        if(dataitem.length<1){
            return <div/>;
        }
        return(
            <div>
                <ShowMask></ShowMask>
                <div className="Preview-content">
                    <Button className="exit" onClick={this.props.closePreview}>退出</Button>
                    <div className="Preview_header">
                        <div className="title">{title}</div>
                        <div className="second-title">
                            <div>总分: 120</div>
                            <div>难度: 中等</div>
                        </div>
                    </div>
                    <section>
                        {this._showQuestionList(dataitem)}
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({getQuestionList,getQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)