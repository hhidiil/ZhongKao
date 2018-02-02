/**
 * 全部试题列表页面
 * Created by gaoju on 2017/11/23.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getAllQuestionsList,getFirstDataOfPaper} from '../../../../redux/actions/math'
import {getAllExamList} from '../../../../redux/actions/math'
import {Storage_S} from '../../../../config'
import Preview from './preview'
import { Button } from 'antd';
import './style.css'


class QuestionAll extends Component{
    constructor(props){
        super(props);
        this.state={
            quiz_again_status:false,//二测标志
            indexNum:0,
            showStatus:true,//测试为true,模考为false
            allList:[],
            previewFlag:false,
            previewData:''
        };
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        if(this.props.params.quesParam=="questions"){
            console.log("-----------questions-----------------")
            this.props.actions.getAllQuestionsList({
                body:{userid:Storage_S.getItem('userid')},
                success:(data)=>{
                    this.getDataOfFirst(data)
                },
                error:(message)=>{console.warn("数据错误")}
            });
        }else if(this.props.params.quesParam=="exams"){
            console.log("-----------exams-----------------")
            this.props.actions.getAllExamList({
                body:{
                    username:"admin"
                },
                success:(data)=>{
                    this.setState({
                        showStatus:false,
                        allList:data
                    })
                },
                error:(message)=>{console.warn("数据错误")}
            });
        }
    };
    getDataOfFirst(items){
        let olddata = items;
        var len = olddata.length;
        let i;
        var dataArray = [];
        for(i=0;i<len;i++){
            let newdata = olddata[i];
            this.props.actions.getFirstDataOfPaper({
                body:{
                    userid: Storage_S.getItem('userid'),
                    exampaperid: newdata.examid
                },
                success:(data)=>{
                    newdata.doneDetails =data;
                    dataArray.push(newdata)
                },
                error:(mes)=>{console.error("数据获取失败")}
            })
        }
        setTimeout(()=>this.getNewData(dataArray),1000)
    }
    getNewData(data){
        console.log(data)
        this.setState({
            showStatus:true,
            allList:data
        })
    }
    /*试卷对应二测部分*/
    _renderShowExplain(data,index){
        return(
            <div id={"quizAgin"+index} className={(this.state.indexNum==index && this.state.quiz_again_status)?"transtionBefore transtionAfter":"transtionBefore"}>
                <div className="questionsAll-item-content">
                    <div className="title2"><p>{data.exampaper+"(此部分针对试题答题结果进行分析)"}</p></div>
                    <div className="btn_list">
                        <Button type="dashed" className="bttn" onClick={()=>this.preview(data)}>结果预览</Button>
                        <Button type="dashed" className="bttn" onClick={()=>this.expand_goto(data)}>巩固训练</Button>
                    </div>
                </div>
            </div>
            )
    }
    /*真题试卷列表*/
    _renderQuestionPage(data){
        let pageSize = data.length;
        if (pageSize > 0) {
            return data.map(function(item,index){
                let len = (item.doneDetails).length;
                return(
                    <div key={index} className="questionsAll-item">
                        <div className="questionsAll-item-content">
                            <div className="title"><p>{item.exampaper}</p></div>
                            <div className="btn_list">
                                {len>0?<span className="wancheng">已完成</span>:""}
                                {len>0?<span className="wancheng">总分：{(item.doneDetails)[0].Score}</span>:""}
                                <Button type="dashed" className="bttn " onClick={()=>this.preview(item)}>预览</Button>
                                <Button type="dashed" className="bttn " onClick={()=>this.gotoPractice(item)}>训练</Button>
                                <Button type="dashed" className="bttn " onClick={()=>this.quizAgain(item,index,len)}>巩固练习</Button>
                            </div>
                        </div>
                        {this._renderShowExplain(item,index)}
                    </div>
                )
            },this);
        }
    }
    /*考试试卷列表*/
    _renderExamPage(data){
        let pageSize = data.length;
        if (pageSize > 0) {
            return data.map(function(item,index){
                return(
                    <div key={index} className="examAll-item">
                        <div className="title">{item.title}</div>
                        <div className="btnContainer">
                            <button type="button" className="btn btn-primary" onClick={()=>this.preview(item)}>预览</button>
                            <button type="button" className="btn btn-primary" onClick={()=>this.exam_goto('1')}>测试</button>
                            <button type="button" className="btn btn-primary" onClick={()=>this.exam_goto('2')}>查看结果</button>
                        </div>
                    </div>
                )
            },this);
        }
    }
    gotoPractice(data){
        let id = data.examid;
        Storage_S.setItem(id,JSON.stringify(data))
        this.props.actions.push(`/home/math/questions/practice/${id}`);
    }
    quizAgain(data,index,flag){
        let domqiuz = "quizAgin"+index;
        //判断本套试题有没有测试完成过，只有一测完成了才能二测
        if(flag >0){
            this.setState({
                quiz_again_status : !this.state.quiz_again_status,
                indexNum : index
            });
        }else{
            alert("你还没有做完本套试题一测，请先做完一测！")
        }
    }
    preview(data){
        console.log("预览")
        this.setState({previewFlag : true,previewData:data});
    }
    closePreview(){
        console.log("关闭预览")
        this.setState({previewFlag : false});
    }
    expand_goto(data){
        let id = data.examid;
        this.props.actions.push(`/home/math/questions/question/${id}`);
    }
    exam_goto(param){
        let url = 'exam';
        if(param == '1'){
            this.props.actions.push(`/home/math/exams/${url}`);
        }else if(param == '2'){
            this.props.actions.push(`/home/math/exams/exam2`);
        }
    }
    render(){
        return(
            <div className="questionsAll">
                <header><h2>{this.state.showStatus?'往年真题':'模考'}</h2></header>
                <section>
                    {this.state.showStatus?this._renderQuestionPage(this.state.allList):this._renderExamPage(this.state.allList)}
                </section>
                {this.state.previewFlag?<Preview data={this.state.previewData} closePreview={()=>this.closePreview()} />:<div/>}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getAllQuestionsList,getAllExamList ,getFirstDataOfPaper}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAll)