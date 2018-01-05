/**
 * 预览查看试题
 * Created by gaoju on 2017/12/15.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList} from '../../../../redux/actions/math'
import ShowMask from '../../../../components/Alter/showMask'
import {requestData} from '../../../../method_public/public'
import {Button} from 'antd'

class Preview extends Component{
    constructor(props){
        super(props)
        this.state={
            JSON_aLL:"Exam_19008687-3c57-4105-8b6c-18205a4616a3.json",//某套题的JSON串，可取到某套试题的所有数据
            dataAll:[],
            total:0,
            all_question:[],
            question:[]
        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            body:{
                param : this.state.JSON_aLL
            },
            success:(data)=>{
                console.log("getQuestionList")
                let new_data = data;//解析JSON
                let data_len = new_data.subquestions.length;//本套试题的所有题目数
                let all_question = new_data.subquestions;
                this.getData(all_question)
                this.setState({
                    dataAll:new_data,
                    total:data_len,
                    all_question:all_question
                })
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    getData(data){
        var dataArray=[];
        for(let i=0;i<data.length;i++){
            let url = '../src/data/ExamsData/JSON/Question/'+data[i].Content+'.json';//本地数据
            requestData(url).then((data)=>{
                dataArray.push(data);
            });
        }
        //由于请求数据是异步的，所以需要延迟来更新state
        setTimeout(()=>this.getNewData(dataArray),2000)
    }
    getNewData(data){
        this.setState({
            question:data
        })
    }
    _showQuestionList(data){
        return data.map(function(item,index){
            let content = (item.content);
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
                                { item.selectoptions.length<1 ? "":<p>
                                    <label className="checkbox-inline"><input type="radio" title="A" name={"Qopts_selects"+index} />
                                        <span>(A)</span><span dangerouslySetInnerHTML={{__html:item.selectoptions[0]}}></span></label>
                                    <label className="checkbox-inline"><input type="radio" title="A" name={"Qopts_selects"+index} />
                                        <span>(B)</span><span dangerouslySetInnerHTML={{__html:item.selectoptions[1]}}></span></label>
                                    <label className="checkbox-inline"><input type="radio" title="A" name={"Qopts_selects"+index} />
                                        <span>(C)</span><span dangerouslySetInnerHTML={{__html:item.selectoptions[2]}}></span></label>
                                    <label className="checkbox-inline"><input type="radio" title="A" name={"Qopts_selects"+index} />
                                        <span>(D)</span><span dangerouslySetInnerHTML={{__html:item.selectoptions[3]}}></span></label>
                                </p>}
                            </li>
                        </ul>
                    </div>
                )
            }
        })
    }
    render(){
        let title = this.state.dataAll;
        let dataitem = this.state.question;
        if(dataitem.length<1){
            return <div/>;
        }
        return(
            <div>
                <ShowMask></ShowMask>
                <div className="Preview-content">
                    <Button className="exit" onClick={this.props.closePreview}>退出</Button>
                    <div className="Preview_header">
                        <div className="title">{title.topic}</div>
                        <div className="second-title">
                            <div>总分: 120</div>
                            <div>难度: 中等</div>
                            <div>收藏试卷</div>
                        </div>
                    </div>
                    <section>
                        {this._showQuestionList(this.state.question)}
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
    return { actions: bindActionCreators({getQuestionList}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)