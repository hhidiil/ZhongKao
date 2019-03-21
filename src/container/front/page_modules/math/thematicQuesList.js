/**
 * 考纲复习(专题模块复习)页面
 * Created by gaoju on 2018/5/17.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './question_style.css'
import {Pagination,Modal,message} from 'antd'
import {Storage_S} from '../../../../config'
import {thematicList} from '../../../../method_public/thematic'
import {getKnowledgeIdList,getEveryQuestion} from '../../../../redux/actions/math'

//修改翻页文字链接
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a>上一页</a>;
    } else if (type === 'next') {
        return <a>下一页</a>;
    }
    return originalElement;
}
var base = new Base64();//base64对象
class ThematicList extends Component{
    constructor(props) {
        super(props)
        this.state={
            thematicParts:thematicList,//专题模块
            questionListOfKnowledge:[],
            Pending:true
        }
    }
    componentDidMount(){
        this.props.actions.getKnowledgeIdList({
            body:[{knowledgeName:'圆'}],
            success:(data)=>{
                if(data[0].code != 200 || data[0].data.length<1){
                    setTimeout(()=>{
                        this.setState({
                            Pending:false
                        })
                    },500)
                    return ;
                }
                let newdata=[],alldata = data[0].data;
                let knowledgeId = alldata[0].knowledgeid;
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
                        this.setState({
                            questionListOfKnowledge:newData,
                            Pending:false
                        })
                    },
                    error:(message)=>{
                        console.log(message)
                    }
                })
            },
            error:(message)=>{
                console.log(message)
                this.setState({
                    questionListOfKnowledge:[],
                    Pending:false
                })
            }
        })
    };
    goToPart(data){
        console.log(data)
    }
    render(){
        return (
            <div className="mask2" style={{backgroundColor:'rgb(193, 223, 249)'}}>
                <div className="thematic-parts">
                    {this.state.thematicParts.map((item,index)=>{
                        return(
                            <div className="part" key={index} onClick={()=>this.goToPart('thematic')}>
                                {item.name}
                            </div>
                        )
                    },this)}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push,getKnowledgeIdList,getEveryQuestion}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ThematicList)