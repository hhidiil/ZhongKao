/**
 * Created by gaoju on 2018/1/15.
 */
import React,{Component} from 'react'
import ReactDom from 'react-dom'
import Editor from 'react-umeditor'
import './style.css'

class Edit extends Component{
    constructor(props){
        super(props)
        this.state = {
            showEditor:false,
            content: ""
        }
    }
    componentDidMount(){
        var aaa = this._child;
        var ccc = $(".formula-dropdown").val();
        var eee = ReactDom.findDOMNode(aaa)
        console.log("aaa--::",aaa)
        console.log("bbb--::",document.getElementsByClassName('editor-toolbar'))
        console.log("ccc--::",ccc)
        console.log(this._child,eee)

        //拖动效果
    }
    drafting(){
        var div1 = document.getElementById("formulaDialog");
        console.log("33333333",this,div1)
        div1.onmousedown = function(ev){
            var oevent = ev || event;

            var distanceX = oevent.clientX - div1.offsetLeft;
            var distanceY = oevent.clientY - div1.offsetTop;
            console.log(oevent.clientX,oevent.clientY,distanceX,distanceY)
            document.onmousemove = function(ev){
                var oevent = ev || event;
                div1.style.left = oevent.clientX - distanceX + 'px';
                div1.style.top = oevent.clientY - distanceY + 'px';
            };
            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
            };
            ;
        };
    }
    handleChange(content){
        this.setState({
            content: content
        })
    }
    getIcons(){
        //工具栏
        var icons = ['formula']
        return icons;
    }
    getPlugins(){
    }
    showEditor(){
        console.log("11111111111")
        this.setState({
            showEditor:true
        })
        setTimeout(this.drafting,1000)
    }
    hideEditor(){
        console.log("22222222222")
        this.setState({
            showEditor:false
        })
    }
    handlefun(){
        console.log("123123123")
    }
    render(){
        var icons = this.getIcons();
        return (
            <div>
                输入：<input type="text" contentEditable="true" onFocus={()=>{this.showEditor(this)}} name="formula"/>
                {!this.state.showEditor?'':<div id="formulaDialog" className="formDialog">
                    <button className="btn btn-primary" onClick={()=>{this.hideEditor(this)}}>关闭</button>
                    <Editor ref={()=>{this.handlefun()}}
                            icons={icons}
                            value={this.state.content}
                            onChange={this.handleChange.bind(this)}
                    />
                </div>}
            </div>
        )
    }
}
export default Edit