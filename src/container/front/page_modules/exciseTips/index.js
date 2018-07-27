/**解题技巧
 * Created by gaoju on 2018/7/4.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {downloadFile} from '../../../../redux/actions/upload'
import * as Modals from '../../../../method_public/antd-modal'
import {Button} from 'antd';


class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'download'
        };
    }
    downloadSubmit(name){
        console.log("下载文件！！！",name,this.state.name)
        this.props.actions.downloadFile({
            body:{
                "name": name
            },
            callback:(data)=>{
                console.log(data)
            }
        })
    }
    render(){
        return (
            <div className="exciseTips">
                <ul>
                    <li><a href="javascript:void(0);">1、中考解题技巧</a>
                        <a href="/api/download?name=readme.txt" className="btnDownload">action下载</a>
                        <a href="http://localhost:10000/api/download?name=MongoDB安装配置.docx" className="btnDownload">document下载1</a>
                        <a href="public/docs/MongoDB安装配置.docx" className="btnDownload">document下载2</a>
                    </li>
                </ul>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({downloadFile}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)