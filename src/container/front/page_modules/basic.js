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
                <div className="basic_title">基本信息：</div>
                <div className="table_basic">
                    <table cellspacing="0" cellpadding="0">
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
                    </table>
                </div>
            </div>
        )
    }
}
export default Basic