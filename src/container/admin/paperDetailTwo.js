/**
 * 二测试卷的批改页面（专门单独写）
 * Created by gaoju on 2018/6/29.
 */
/**
 * Created by gaoju on 2018/6/26.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon,Button,Modal,Collapse } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import PureRenderMixin from '../../method_public/pure-render'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {getAllChildOfQuestion} from '../../redux/actions/math'
import {updateMarkExamInfo,getDataOfPaper} from '../../redux/actions/teacher'
import {Pagination} from '../../components/pagination'
import MultipleChoice from '../../components/multipleChoice/index'
import * as Modals from '../../method_public/antd-modal'
import {Storage_S} from '../../config'

function callback(key) {
    console.log(key);
}
const Panel = Collapse.Panel;
const sectionParts = ["观察部分试题","分析部分试题","考点部分试题","解析部分试题","巩固练习部分试题","拓展练习部分试题"];
class PaperDetail extends Component {
    constructor(props) {
        super(props)
        let name = this.props.params;
        this.state = {
            userid:name.userid||'',
            paperid:name.paperid||'',
            total:5,
            current: 0,//当前是第几题
            allQuestionetails:[],
            currentQuesData:[],
            errorArray:[],
            previewVisible:false,
            examInfoID:'',//试卷唯一ID
            marktipsFlag:false
        };
    };
    componentDidMount(){
        console.log(this.state.userid,this.state.paperid);
        let userid = this.state.userid;
        this.props.actions.getDataOfPaper({//获取最近一测考试的结果
            body:{id: this.state.paperid},
            success:(data)=>{
                console.log("getDataOfPaper------->>>----->>>>",data);
                let dealData = (data[0].ExamResult).replace(/\\/g,"@&@")//json中有\的时候会出错
                let datajson = JSON.parse(dealData);
                let errorArray=[];//错误题号
                var ii=0;
                for(let ss in datajson){
                    if(datajson[ss] && datajson[ss]!= "null"){
                        if(datajson[ss].Contents.length>0){
                            if(!(datajson[ss].Contents[0].IsTrue)){//获取错题列表
                                errorArray[ii] =  Number(ss)+1;
                                ii = ii+1;
                            };
                        }
                    }else {
                        errorArray[ii] =  Number(ss)+1;
                        ii = ii+1;
                    }
                }
                console.log("--------------allQuestionetails------------------->>",datajson)
                console.log("--------------errorArray------------------->>",errorArray)
                this.getData(datajson[0],0)
                this.setState({
                    total:datajson.length,
                    errorArray:errorArray,
                    allQuestionetails:datajson,
                    current:0,
                    examInfoID:data[0].ExamInfoID,
                })
            },
            error:(message)=>{
                console.error(message)
            }
        })
    };
    getData(data,page){
        let allQuestionetails = this.state.allQuestionetails[page];
        if(data){
            this.props.actions.getAllChildOfQuestion({body:[{id:data.QuesID}],
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",(data[0].data));
                    this.setState({
                        current: page+1,
                        currentQuesData:data[0].data
                    })
                }})
        }
    }
    exitBack(){
        let _this = this;
        Modals.showConfirm("是否已经全部提交？", function () {
            let url = (_this.props.location.pathname).split('/');
            //let tar = url.pop();
            url = url.splice(0,url.length-3);
            let endurl = url.join('/');
            _this.props.actions.push(endurl)
        })
    }
    onChange = (page) => {
        console.log("page--",page);
        this.getData(this.state.allQuestionetails[page-1],page-1)
    }
    submitMark(){
        console.log(this.state.allQuestionetails[this.state.current-1])
        this.setState({marktipsFlag:false})
    }
    submitAllQuestion(){
        let ExamResult = this.state.allQuestionetails;
        let allscore = 0;
        for(let i in ExamResult){
            allscore = allscore + Number(ExamResult[i].score);
        }
        let sentList={
            ExamInfoID:this.state.examInfoID,
            ExamResult:this.state.allQuestionetails,
            markFlag:"已批改",
            Score:allscore,
            marker:Storage_S.getItem("username")
        }
        console.log(sentList)
        this.props.actions.updateMarkExamInfo({
            body:{data:sentList},
            success:(data)=>{
                alert("提交成功！")
            },
            error:(message)=>{
                alert("提交出错！")
            }
        })
    }
    MarkTips(){
        this.setState({marktipsFlag:true})
    }
    _studentAnwser(data){
        console.log("_studentAnwser------------------->>>>>",data)
        return (
            <div className="studentAnwser">
                <div className="studenttext">
                    <span>学生答案：</span>
                </div>
                {!(data && data.length>0)?"":<div>
                    <span dangerouslySetInnerHTML={{__html:data[0].content}}></span>
                    {!(data[0].url)?"":<div className="studentimg">
                        <img width="260px" src={data[0].url}/>
                        <div className="chakan" onClick={()=>{this.setState({previewVisible: true})}}>查看</div>
                    </div>}
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible: false})}}>
                        <img alt="preview" style={{ width: '100%' }} src={data[0].url} />
                    </Modal>
                </div>}
            </div>
        )
    }
    _childsList(data){
        if(data.length>0){
            return data.map(function(item,index){
                return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
            })
        }
    }
    _contentQtxt(data,index){
        console.log("_contentQtext------||||||\\\\//////--------------------->>>>>",data)
        let items = data[0];
        let content = items.content;
        let questiontemplate = items.questiontemplate;
        let childs = items.childs;
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(questiontemplate == '选择题'){
            questionType = true;
        }
        let oldanswer = this.state.allQuestionetails[index-1].Contents ;//做过一次的数据
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\_|\s/g,"");
                let qqq =  '<span class="div_input"></span>';
                content = content.replace(/blank|BLANK/g,qqq);
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{questiontemplate}：{"（本题15分）"}</div>
                    </div>
                    <div>
                        <ul id="mainTopic" style={{padding:"8px 0"}}>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questionType?<MultipleChoice type={items.questiontype} answer={oldanswer[0].content} isCando="false" index={index} choiceList={items.optionselect} />:''}
                            {childs.length<1?"":this._childsList(childs)}
                            {questionType?"":this._studentAnwser(oldanswer)}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    _partQuestions(num){
        const base = new Base64();
        return (
            <div>
                <div key="1" className="erveryQuestion">
                    <ul>
                        <li>1.如图，数轴上两点A，B表示的数互为相反数，则点B表示的数为（    ）。</li>
                        <MultipleChoice type="单选题" answer="A" isCando="false" index={num} choiceList="[MTA=,MjA=,MzA=,40]" />
                    </ul>
                    <div className="pigaiTips" onClick={()=>{this.MarkTips()}}>批改</div>
                </div>
                <div key="2" className="erveryQuestion">
                    <ul>
                        <li> 本题主要考查的知识点有:</li>
                        <MultipleChoice type="多选题" answer="A,C" isCando="false" index={num} choiceList="[5peL6L2s5oCn6LSo,5YWo562J5LiJ6KeS5b2i55qE5oCn6LSo,5q2j5pa55b2i55qE5oCn6LSo]" />
                    </ul>
                    <div className="pigaiTips" onClick={()=>{this.MarkTips()}}>批改</div>
                </div>
                <div key="3" className="erveryQuestion">
                    <ul>
                        <li> 由旋转的性质，知点A不动，AD边绕点A顺时针旋转90°后，与_BC_（AB/BC/CD）边重合，不难知选项A符合题意。</li>
                    </ul>
                    <div className="pigaiTips" onClick={()=>{this.MarkTips()}}>批改</div>
                </div>
                <div key="4" className="erveryQuestion">
                    <ul>
                        <li>（1）、如图，AB是⊙O的直径，C是AD的中点，⊙O的切线BD交AC的延长线于点D，E是OB上一点，CE的延长线交DB的延长线于点F，AF交⊙O于点H，连接BH。</li>
                        <li><img src="http://localhost:10000/all_images/admin/tDo3fh3Hc1530149490200.png" width="200px"/></li>
                        <li>1）求证:AB=BD；</li>
                        <li>2）若tan∠BEF=2，求证:E是CF的中点；</li>
                        <li>3）在2）的条件下，若OB=2，求BH的值</li>
                        <li>答案：<img src="http://localhost:10000/all_images/admin/tDo3fh3Hc1530149490200.png" width="200px"/></li>
                    </ul>
                    <div className="pigaiTips" onClick={()=>{this.MarkTips()}}>批改</div>
                </div>
            </div>
        )
    }
    render() {
        let currentQuesData =  this.state.currentQuesData;
        if(currentQuesData.length<1){
            return <div/>
        }
        return (
            <div className="mask3 paperDetail">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{"2018年中考题"+"（一测试卷）"}</div>
                        <div className="exit" >
                            <button type="button" className="btn btn-default" onClick={()=>this.submitAllQuestion()}>全部提交</button>
                            <button type="button" className="btn btn-default" onClick={()=>this.exitBack()}>退出</button>
                        </div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="Question_content">
                        <div className="pagination_all">
                            <div className="widthPrecent5 margint10">题号:</div>
                            <div className="padding0">
                                <Pagination total={this.state.total} current={this.state.current} errorList={this.state.errorArray}   onChange={this.onChange}/></div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <hr/>
                    <section>
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(currentQuesData,this.state.current)}
                            </div>
                        </div>
                    </section>
                    <hr/>
                    <section>
                        <div className="childContent">
                            {
                                sectionParts.map((item,index)=>{
                                    return (
                                        <Collapse key={index} onChange={callback}>
                                            <Panel header={item} key={index}>
                                                {this._partQuestions(index)}
                                            </Panel>
                                        </Collapse>
                                    )
                                },this)
                            }
                        </div>
                    </section>
                    <section style={{display:"flex",justifyContent:"center"}}>
                        {!this.state.marktipsFlag?"":(
                            <div className="teacherMark">
                                <div><span>评语:</span>
                                    <textarea id="textarea" ref={(e)=>{this.textarea = e}} className="form-control" rows="3"></textarea>
                                </div>
                                <div className="margint5">
                                    <label>打分:</label><input id="markscore" ref={(e)=>{this.markscore = e}} type="number" className="form-control markscore"/>
                                    <Button type="primary" onClick={()=>{this.submitMark()}}>提交</Button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getDataOfPaper,getAllChildOfQuestion,updateMarkExamInfo}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperDetail)