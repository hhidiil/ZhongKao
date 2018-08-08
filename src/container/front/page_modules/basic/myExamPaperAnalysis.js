/**
 * 图表分析做题情况
 * Created by gaoju on 2018/8/7.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion} from '../../../../redux/actions/math'
import DialodMask from '../../../../components/Alter/dialogMask/dialogmask'
import {Button,Table} from 'antd'
import echarts from 'echarts'
import {TableDataMap,Pie1,Pie2} from './config'

var newQustionTableData = TableDataMap.dataSource;
class ExamPaperAnalysis extends Component{
    constructor(props){
        super(props)
        let alldata = props.data;
        let questionDetails = (alldata.ExamResult).replace(/\\/g,"@&@");
        this.state={
            alldata:alldata,
            questionDetails:JSON.parse(questionDetails) || [],
            qustionTableData:newQustionTableData
        }
    }
    componentDidMount(){
        console.log("componentDidMount==========>",this.state.questionDetails);
        let {qustionTableData} = this.state;
        let questionDetails = this.state.questionDetails;
        let singleQuestionNum = 0,singleQuestionErrorNum={num:0,option:''};
        let tianKongQuestionNum = 0,tianKongQuestionErrorNum = {num:0,option:''};
        let jianDaQuestionNum = 0,jianDaQuestionErrorNum = {num:0,option:''};
        let knowledge = [];//知识点
        if(questionDetails.length>0){
            for(let i in questionDetails){
                let j = Number(i) + 1;
                if(questionDetails[i].QuesType == '选择题'){
                    singleQuestionNum = singleQuestionNum + 1;
                    if(questionDetails[i].score == 0){
                        singleQuestionErrorNum.num = singleQuestionErrorNum.num + 1;
                        singleQuestionErrorNum.option = singleQuestionErrorNum.option + j +',';
                    }
                }else if(questionDetails[i].QuesType == '填空题'){
                    tianKongQuestionNum = tianKongQuestionNum + 1;
                    if(questionDetails[i].score == 0){
                        tianKongQuestionErrorNum.num = tianKongQuestionErrorNum.num + 1;
                        tianKongQuestionErrorNum.option = tianKongQuestionErrorNum.option + j +',';
                    }
                }else if(questionDetails[i].QuesType == '简答题'){
                    jianDaQuestionNum = jianDaQuestionNum + 1;
                    if(questionDetails[i].score == 0){
                        jianDaQuestionErrorNum.num = jianDaQuestionErrorNum.num + 1;
                        jianDaQuestionErrorNum.option = jianDaQuestionErrorNum.option + j +',';
                    }
                }
                if(questionDetails[i].knowledge){
                    let item = (questionDetails[i].knowledge).split('；');
                    let istrue = questionDetails[i].Contents[0].IsTrue;//对错
                    let number = istrue?0:1;
                    for(let j=0;j<item.length;j++){
                        if(knowledge.length>0){//存在
                            let ishave = false;//默认此知识点没有在knowledge中
                            for(let m=0;m<knowledge.length;m++){
                                if(knowledge[m].name == item[j] ){//knowledge中有这个知识点
                                    knowledge[m].num = knowledge[m].num + number;
                                    ishave = true;
                                }
                            }
                            if(!ishave){
                                knowledge.push({"name":item[j],"num":1,"errorNum":number})
                            }

                        }else {
                            knowledge.push({"name":item[j],"num":1,"errorNum":number});
                        }

                    }
                }
            }
        }
        qustionTableData[0].num = singleQuestionNum;
        qustionTableData[0].errorNum = singleQuestionErrorNum.num+" ("+singleQuestionErrorNum.option+")";
        qustionTableData[0].percent = ((1-(singleQuestionErrorNum.num/singleQuestionNum))*100).toFixed(2)+'%';
        qustionTableData[1].num = tianKongQuestionNum;
        qustionTableData[1].errorNum = tianKongQuestionErrorNum.num+" ("+tianKongQuestionErrorNum.option+")";
        qustionTableData[1].percent = ((1-(tianKongQuestionErrorNum.num/tianKongQuestionNum))*100).toFixed(2)+'%';
        qustionTableData[2].num = jianDaQuestionNum;
        qustionTableData[2].errorNum = jianDaQuestionErrorNum.num+" ("+jianDaQuestionErrorNum.option+")";
        qustionTableData[2].percent = ((1-(jianDaQuestionErrorNum.num/jianDaQuestionNum))*100).toFixed(2)+'%';
        console.log("knowledge====>>>>",knowledge,qustionTableData)
        var xDataName = [];//柱状X轴知识点名
        var xDataNameNum = [];//柱状X轴知识点出现次数
        var xDataNameErrorNum = [];//柱状X轴知识点出现次数
        var seriesData = [];
        if(knowledge.length>0){
            for(let i in knowledge){
                xDataName.push(knowledge[i].name);
                xDataNameNum.push(knowledge[i].num);
                xDataNameErrorNum.push(knowledge[i].errorNum);
                seriesData.push({
                    name:knowledge[i].name,
                    value:knowledge[i].num
                })
            }
        }
        console.log("xDataName====>>>>",xDataName,xDataNameNum);
        //实例化echart
        var pieChartOne = echarts.init(this.pieOne);
        var pieChartTwo = echarts.init(this.pieTwo);
        pieChartOne.setOption(Pie1({
            singleQuestionNum:singleQuestionNum,
            tianKongQuestionNum:tianKongQuestionNum,
            jianDaQuestionNum:jianDaQuestionNum
        }));
        pieChartTwo.setOption(Pie2({seriesData:seriesData}));
    }
    render(){
        return(
            <div className="dataAnalysis">
                <div className="part-one" ref={(e)=>this.pieOne=e}></div>
                <div className="part-two" ref={(e)=>this.pieTwo=e}></div>
                <div className="part-three">
                    <h4><strong>试题对错</strong></h4>
                    <Table dataSource={this.state.qustionTableData}
                           columns={TableDataMap.columns}
                           bordered={true}
                           pagination={{position: 'none'}}>
                    </Table>
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
export default connect(mapStateToProps, mapDispatchToProps)(ExamPaperAnalysis)