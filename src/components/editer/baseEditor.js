/**
 * umeditor编辑器
 * Created by gaoju on 2018/1/10.
 */
import React,{Component} from 'react'
import Editor from 'react-umeditor'
import './style.css'
import UpLoadFile from '../upload/index'
import {Icon} from 'antd'

class Edit extends Component{
    constructor(props){
        super(props)
        this.state = {
            content: props.content || "",
            imgUrl:''
        }
    }
    handleChange(content){
        this.setState({
            content: content
        })
    }
    getIcons(){
        //工具栏
        var icons = [
            "undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "superscript subscript | formula |",
            "insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal | spechars | inserttable"
        ]
        return icons;
    }
    btnClick(){
        //let content = this.editor.getContent();
        let content = '';
        let img_url = this.state.imgUrl;
        //if(!this.props.inputDom) return alert("请点击要填写的输入框")
        this.props.editContent(content,this.props.inputDom,img_url)
    }
    callbackImgUrl(cont){
        this.setState({imgUrl:cont})
    }
    render(){
        var icons = this.getIcons();
        return (
            <div>
                {/*<Editor ref={(e)=>{this.editor = e}}
                 icons={icons}
                 defaultValue={this.state.content}
                 onChange={this.handleChange.bind(this)}
                 />
                 <div style={{color:"lightsalmon"}}>(如果答案较为复杂输入框无法正常显示，可以在抄稿纸上写好答案并拍照上传奥！)</div>
                 */}
                <UpLoadFile imgUrl={this.callbackImgUrl.bind(this)} submitHandle={this.btnClick.bind(this)}></UpLoadFile>
            </div>
        )
    }
}
export default Edit