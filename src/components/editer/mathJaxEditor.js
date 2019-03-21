/**
 * mathjax公式编辑器
 * Created by gaoju on 2018/3/27.
 */
import React,{Component,PureComponent} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class MathJaxEditor extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            showEditor:props.showEditor||false,
            position:props.position,
            target_id:props.target_id,
            editorId:props.editorId,
            content:''
        }
        window.setLatexValue = this.setLatexValue.bind(this);//设置全局回调，子页面来调用
    }
    componentDidMount(){
        //编辑框
        //let editorname = this.props.editorId;
        let editorname = this.state.editorId;
        console.warn("编辑器的ID--->>>",editorname)
        var ue = UE.getEditor(editorname, {
            toolbars: [['kityformula']],
            elementPathEnabled:false,
            wordCount:false
        });
        setTimeout(function(){
            $(".edui-editor-iframeholder").remove();
        },1000)
    }
    componentWillReceiveProps(nextProps){
        //this.props //当前的props,nextProps //下一阶段的props
        window.nowDom = nextProps.target_id;//当前聚焦的元素
    }
    setLatexValue(value,img){
        $("#"+window.nowDom).text("");
        $("#"+window.nowDom).attr("data",value);
        $("#"+window.nowDom).append(img);
        $("#"+window.nowDom).attr("contenteditable",false);
        window.lastClickDom = document.getElementById(window.nowDom);//公式编辑器赋值完之后把当前ID元素赋给全局变量lastClickDom
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);//重新渲染一遍
    }
    clearLatexValue(){
        $("#"+window.nowDom).text("");
        $("#"+window.nowDom).attr("data",'');
        $("#"+window.nowDom).attr("contenteditable",true)
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);//重新渲染一遍
    }
    render(){
        console.warn("渲染============MathJaxEditor==================");
        const displayCss=[{display:"inline-flex",top:this.props.position[0],left:this.props.position[1]},{display:"none"}];
        //let editorid = this.props.editorId;
        let editorid = this.state.editorId;
        console.log("editorid---1111111111------->",editorid,this.state.editorId)
        return(
            <div className="mathEditorTip" style={this.props.showEditor?displayCss[0]:displayCss[1]}>
                <div id={editorid} className="editorContainer" type="text/plain"></div>
                <div className="mathJaxClear" onClick={this.clearLatexValue}>清空</div>
            </div>
        )
    }
}

export default MathJaxEditor