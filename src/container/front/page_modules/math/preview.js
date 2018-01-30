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
        this.state={
            JSON_aLL:alldata.examid,//某套题的试卷id，可取到某套试题的所有数据
            paper_title:alldata.exampaper,//试卷标题
            questions:[]
        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            body:{
                paperid : this.state.JSON_aLL
            },
            success:(data)=>{
                console.log("getQuestionList----preview-->",data)
                let all_question = data;//解析JSON
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
            let url = data[i].questionid;
            this.props.actions.getQuestion({
                    body:{
                        paperid : url
                    },
                    success:(data)=>{
                        dataArray.push(data);
                    },
                    error:(mes)=>{
                        console.error('数据接收发生错误');
                    }
            })
        }
        //由于请求数据是异步的，所以需要延迟来更新state
        setTimeout(()=>this.getNewData(dataArray),2000)
    }
    getNewData(data){
        this.setState({
            questions:data
        })
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
        })
    }
    _showQuestionList(data){
        return data.map(function(item,index){
            let content = (item[0].content);
            let options = item[0].optionselect;
            let childs = item[0].childs;
            $.trim(options);//去掉前后的空格
            let ss = options.replace(/["\[\]]/g,"");
            let optionArray = ss.split(",");
            var base = new Base64();//base64对象
            if(content){
                if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                    content = content.replace(/\s|_/g, '');
                    content = content.replace(/blank/g, '_____');
                }
                return(
                    <div key={index} className='question-css'>
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            <li>
                                { optionArray.length<4 ? "":<p>
                                    <label className="checkbox-inline">
                                        <span style={{margin:"0 3px"}}>(A)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[0])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span style={{margin:"0 3px"}}>(B)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[1])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span style={{margin:"0 3px"}}>(C)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[2])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span style={{margin:"0 3px"}}>(D)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[3])}}></span></label>
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
                            <div>收藏试卷</div>
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