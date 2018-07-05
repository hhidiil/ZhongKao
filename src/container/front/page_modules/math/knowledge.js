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
import './question_style.css'
import ShowMask from '../../../../components/Alter/showMask'
import MultipleChoice from '../../../../components/multipleChoice/index'
import {MathJaxEditor} from '../../../../components/editer'
import {getCoords} from '../../../../method_public/public'
import { Menu, Icon,Button } from 'antd'


class Knowledge extends Component{
    constructor(props){
        super(props);
        this.state={
            knowledgeName:props.knowledgeName,//知识点名
            questionListOfKnowledge:[],//知识点对应的所有试题
            target_id:'',
            position:[],
            showEditor:false
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
    componentDidUpdate(prevProps,prevState){
        //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
       this.addEvent();
    }
    addEvent(){
        console.log("12312321321321311321213")
        let _this = this;
        $(".knowledgeContent .practice").find('.div_input').each(function(i){
            let add_id='';
            add_id = "knowledge-"+i;
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                _this.FocusHandle(this,add_id)
            })
        });
    }
    FocusHandle(e,add_id){
        let tar_id,top='',left='';
        if($(e)[0].localName == 'img'){
            tar_id= ($(e)[0].offsetParent);
        }else {
            tar_id = $(e)[0];
        }
        let positions = getCoords(tar_id);//获取当前点击的元素在页面中的位置
        top = (positions.top-40) + "px";
        left = (positions.left+50) + "px";
        $(tar_id).addClass("inputfoucs-style");
        this.setState({showEditor:true,position:[top,left],target_id:add_id})
    }
    exitBack(){
        this.props.closeKnowledge();
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        console.log("submit")
    }
    _QuestionContent(data){
        if(data.length<1){return <div/>}
        return data.map((item,index)=>{
            let content = item.content;
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                let qqq =  '<span class="div_input" contenteditable="true"></span>';
                content = content.replace(/#blank#|#BLANK#/g,qqq);
            }
            return(
                <div key={index} className="practice">
                    <ul>
                        <li dangerouslySetInnerHTML={{__html:content}}></li>
                        {item.questiontemplate == "选择题" ?<MultipleChoice type={item.questiontype} answer=""  index={index} choiceList={item.optionselect} />:''}
                    </ul>
                </div>
            )
        })
    }
    render(){
        let quetionList = this.state.questionListOfKnowledge;
        return(
            <div className="knowledgeContent">
                <MathJaxEditor position={this.state.position} editorId="knowledgeContainer" target_id={this.state.target_id} showEditor={this.state.showEditor}/>
                <form onSubmit={this.handleSubmit}>
                    {this._QuestionContent(quetionList)}
                    <button type="submit" className="btn btn-primary submit_btn">提交</button>
                </form>
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
