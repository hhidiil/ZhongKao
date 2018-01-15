/**
 * Created by gaoju on 2018/1/10.
 */
import React,{Component} from 'react'
import Editor from 'react-umeditor'
import './style.css'

class Edit extends Component{
    constructor(props){
        super(props)
        this.state = {
            content: ""
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
            "horizontal | image spechars | inserttable"
        ]
        return icons;
    }
    getPlugins(){
        return {
            "image": {
                "uploader": {
                    "name":"file",
                    "url": "/api/upload"
                }
            }
        }
    }
    fileChange(e){
        console.log(e)
        var file = e.target.files[0];
        var img = new Image(),
            url = img.src = URL.createObjectURL(file);
        $(img).addClass("img-responsive");
        $(img).css("margin", "0 auto");
        var $img = $(img);
        img.onload = function() {
            URL.revokeObjectURL(url);
            $('#preview').empty().append($img);
        }
    }
    render(){
        var icons = this.getIcons();
        var plugins = this.getPlugins();
        return (
            <div>
                <Editor ref="editor"
                        icons={icons}
                        value={this.state.content} defaultValue="<p>请在此处编辑:</p>"
                        onChange={this.handleChange.bind(this)}
                        plugins={plugins} />
                <form className="uploadFile">提交照片：
                    <input type="file" name="imageUpload" onChange={(e)=>this.fileChange(e)} />
                    <div id="preview" style={{textAalign: "center"}}></div>
                </form>
            </div>
        )
    }
}
export default Edit