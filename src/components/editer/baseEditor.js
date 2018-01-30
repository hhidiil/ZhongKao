/**
 * Created by gaoju on 2018/1/10.
 */
import React,{Component} from 'react'
import Editor from 'react-umeditor'
import './style.css'
import UpLoadFile from '../../components/upload/index'

class Edit extends Component{
    constructor(props){
        super(props)
        this.state = {
            content: "",
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
    render(){
        var icons = this.getIcons();
        return (
            <div>
                <Editor ref="editor"
                        icons={icons}
                        value={this.state.content} defaultValue="<p>请在此处编辑:</p>"
                        onChange={this.handleChange.bind(this)}
                        />
                <UpLoadFile></UpLoadFile>
            </div>
        )
    }
}
export default Edit