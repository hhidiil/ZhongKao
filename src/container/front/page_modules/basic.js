/**
 * Created by gaoju on 2017/11/21.
 */
import React,{Component} from 'react'
import './style.css'

class Basic extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="basic_All_css">
                <div className="user_head">
                    <img src="public/images/user_head.jpg" alt="头像"/>
                    <span>头像更改</span>
                </div>
                <div className="basic_title">基本信息：</div>
                <div className="table_basic">
                    <table cellSpacing="0" cellPadding="0">
                        <tbody>
                            <tr>
                                <td>姓名</td>
                                <td width="70%">王小米</td>
                            </tr>
                            <tr>
                                <td>性别</td>
                                <td width="70%">男</td>
                            </tr>
                            <tr>
                                <td>生日</td>
                                <td width="70%">2005/5/5</td>
                            </tr>
                            <tr>
                                <td>现居住地</td>
                                <td width="70%">火星vaster市wwwC3区</td>
                            </tr>
                            <tr>
                                <td>账号</td>
                                <td width="70%">哈哈哈哈</td>
                            </tr>
                            <tr>
                                <td>手机号</td>
                                <td width="70%">88888888888</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="basic_title">附加信息：</div>
                <div className="table_basic">
                    <table cellSpacing="0" cellPadding="0">
                        <tbody>
                            <tr>
                                <td>账号</td>
                                <td width="70%"></td>
                            </tr>
                            <tr>
                                <td>邮编</td>
                                <td width="70%"></td>
                            </tr>
                            <tr>
                                <td>地址</td>
                                <td width="70%">火星vaster市wwwC3区</td>
                            </tr>
                            <tr>
                                <td>个性签名</td>
                                <td width="70%">天王盖地虎</td>
                            </tr>
                            <tr>
                                <td>爱好兴趣</td>
                                <td width="70%">玩、耍、学习、看电影</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default Basic