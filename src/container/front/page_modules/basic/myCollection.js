/**
 * Created by gaoju on 2017/12/12.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getCollectInfo } from '../../../../redux/actions/user'
import { Collapse } from 'antd';

const Panel = Collapse.Panel;
class Collect extends Component{
    constructor(props){
        super(props);
        console.log("1")
        this.state={
        }
    }
    componentDidMount(){
        this.props.actions.getCollectInfo({});
    };
    _questionList(list){
        let questions = list.get('question');
        return questions.map((item,index)=>{
            return(
                <div key={index} className="collectAll_question">
                    <a href={item.get('url')}><p><span>{index+'、'}</span>{item.get('title')}</p></a>
                </div>
            )
        })
    }
    _showList(list){
        let item = list.get('items');
        let item2 = (item.get(0)).get('menu_title');
        return item2.map((item,index)=>{
            let num = item.get('question').size;
            let header = item.get('name')+"("+num+")";
            return(
                <Panel header={header} key={index}>
                    {this._questionList(item)}
                </Panel>
            )
        })
    }
    render(){
        let {collectInfo} = this.props;
        let error = PureRenderMixin.Compare([collectInfo]);//深度比较如果两次state没有变化，则不用render
        if (error) return error
        return(
            <div className="collectAll">
                <Collapse bordered={false}>
                    {this._showList(collectInfo)}
                </Collapse>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        collectInfo:state.collectInfo || [],
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getCollectInfo}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Collect)