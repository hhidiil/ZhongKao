/**
 * Created by gaoju on 2018/7/4.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getUserBasicInfo, updateUserInfo,updateHeadImg} from '../../../../redux/actions/user'
import './style.css'
import {Form, Select,Radio,Input, Button, Upload, Icon,Layout,DatePicker} from 'antd';


class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            userid:'',
            head_img:''
        };
    }
    componentDidMount(){
    };
    render(){
        return (
            <div className="basic_All_css">
                TipsTipsTipsTipsTipsTipsTipsTips
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push}, dispatch)
    }
}
export default Index