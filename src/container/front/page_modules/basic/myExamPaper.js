/**已经做过的试卷
 * Created by gaoju on 2018/7/12.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon,Button,Checkbox , Input, AutoComplete} from 'antd'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {getAllPaperOfStudent } from '../../../../redux/actions/teacher'
import {Storage_S} from '../../../../config'
import {searchMatch,searchChechboxMatch} from '../../../../method_public/public'
const Option = AutoComplete.Option;
const CheckboxGroup = Checkbox.Group;


const plainOptions = ['一测', '二测','已完成','未完成','已批改','未批改'];
class PaperList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeName:Storage_S.getItem('userid'),//当前学生id
            paperAllList:[],//学生的所有试卷
            seacherMatchList:[],//input查询匹配的试卷
            checkboxMatchList:[],//checkbox查询匹配的试卷
            dataSource: [],

        };
    };
    componentDidMount(){
        console.log("componentDidMount===>",this.state.activeName)
        this.getPaperList(this.state.activeName)
    };
    componentWillReceiveProps(nextProps){
    }
    getPaperList(id){
        this.props.actions.getAllPaperOfStudent({
            body:{id:id},
            success:(data)=>{
                console.log("getAllPaperOfStudent---->>>>",data)
                if(data){
                    this.setState({paperAllList:data,seacherMatchList:data,checkboxMatchList:data})
                }
            },
            error:(message)=>{
                this.setState({paperAllList:[]})
                console.warn(message)}
        });
    }
    gotoPaper(item){
        let activeName = this.state.activeName;
        let id  = item.ExamInfoID;
        let type = item.ExamType;
        console.log(activeName,id,type)
    }
    searchMatchHandle = (e) =>{
        let tarValue = $(e.target).parent().parent().find('input')[0].value;
        let searchList = tarValue ? searchMatch(tarValue,this.state.paperAllList,'ExamPaperTitle') : this.state.paperAllList;
        this.setState({seacherMatchList: searchList,checkboxMatchList:searchList});
    }
    onSelect=(value)=> {
        console.log('onSelect', value);
    }
    onCheckChange=(checkedValues)=> {
        console.log('checked = ', checkedValues);
        let searchList = checkedValues.length>0 ? searchChechboxMatch(checkedValues,this.state.seacherMatchList):this.state.seacherMatchList;
        this.setState({checkboxMatchList: searchList});
    }
    _paperList(data){
        if(data.length<1){
            return <div className="noDatalist">没找到数据^_^...</div>
        }
       return data.map((item,index)=> {
            return (
                <div key={index} className="exampaperList">
                    <div className="itemtitle"><h4>({index+1})、{item.ExamPaperTitle+"("+item.ExamType+")"}</h4></div>
                    <div className="itemstatus">
                        <span className="status-span">完成进度：{item.IsDone=='yes'?"已完成":"未完成"}</span>
                        <span className="status-span">批改状态：{item.markFlag}</span>
                        <Button type="primary" size="small" onClick={()=>{this.gotoPaper(item)}}>查看</Button>
                    </div>
                </div>
            )
        },this)
    }
    render() {
        let paperAllList = this.state.checkboxMatchList;
        return (
            <div className="myExamPaper">
                <div className="searchLine">
                    <div className="searchKey">
                        <strong>类型：</strong>
                        <CheckboxGroup options={plainOptions} onChange={this.onCheckChange} />
                    </div>
                    <div className="global-search-wrapper" style={{ width: 300,float:'right',marginBottom:10 }}>
                        <AutoComplete
                            className="global-search"
                            size="large"
                            style={{ width: '100%' }}
                            onSelect={this.onSelect}
                            placeholder="输入关键字查询"
                            optionLabelProp="text">
                            <Input suffix={(
                            <Button className="search-btn" size="large" type="primary" onClick={this.searchMatchHandle}>
                            <Icon type="search" />
                            </Button>
                            )} />
                        </AutoComplete>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <section>
                    {this._paperList(paperAllList)}
                </section>
            </div>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getAllPaperOfStudent}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperList)