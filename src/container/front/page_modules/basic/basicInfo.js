/**
 * Created by gaoju on 2017/12/12.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import PureRenderMixin from '../../../../method_public/pure-render'
import {handleImg} from '../../../../method_public/public'
import {getUserBasicInfo } from '../../../../redux/actions/user'
import './style.css'

class QuestionAll extends Component{
    constructor(props){
        super(props);
        this.state={
        };
    }
    componentWillReceiveProps(self, nextProps, nextState){
        console.log('hello world componentWillReceiveProps');
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        let username = window.sessionStorage.getItem('username')
        this.props.actions.getUserBasicInfo({body:{params:username}})
    };
    render(){
        let { basicInfo } = this.props;
        let error = PureRenderMixin.Compare([basicInfo]);//优化render
        if (error) return error
        let items = (basicInfo.get('items')).get(0)
        console.log("getUserBasicInfo",items)
        return (
            <div className="basic_All_css">
                <div className="user_head">
                    <img src={handleImg(items.get('headimg'))} alt="头像"/>
                    <span>头像更改</span>
                </div>
                <div className="basic_title">基本信息：</div>
                <div className="table_basic">
                    <table cellSpacing="0" cellPadding="0">
                        <tbody>
                        <tr>
                            <td>账号名</td>
                            <td width="70%">{items.get('name')}</td>
                        </tr>
                        <tr>
                            <td>手机号</td>
                            <td width="70%">{items.get('phone')}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="basic_title">附加信息：</div>
                <div className="table_basic">
                    <div>编辑</div>
                    <table cellSpacing="0" cellPadding="0">
                        <tbody>
                        <tr>
                            <td>真实姓名</td>
                            <td width="70%">{items.get('actualName')}</td>
                        </tr>
                        <tr>
                            <td>性别</td>
                            <td width="70%">{items.get('sex')}</td>
                        </tr>
                        <tr>
                            <td>生日</td>
                            <td width="70%">{items.get('birthday')}</td>
                        </tr>
                        <tr>
                            <td>邮编</td>
                            <td width="70%"></td>
                        </tr>
                        <tr>
                            <td>现居住地</td>
                            <td width="70%">{items.get('familyAddress')}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        basicInfo:state.basicInfo || [],
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getUserBasicInfo}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(QuestionAll)