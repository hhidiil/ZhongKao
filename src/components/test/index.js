/**
 * Created by gaoju on 2017/12/21.
 */
import React,{Component} from 'react'
import Pagination from '../pagination/pagination'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {WINDOW_HOST} from '../../config'
import {FormulaEditor} from '../editer/index'
import {upload} from '../../redux/actions/upload'
import {beforeUpload} from '../../method_public/public'
import { message } from 'antd'

class Test extends Component{
    constructor(props){
        super(props)
        this.state={
            imageURL: '',
        }
    }
    componentDidMount(){
    }
    upLoadSubmit = (e) =>{
        e.preventDefault();
        let file = this.uploadInput.files[0];
        if(beforeUpload(file)){
            const data = new FormData();
            data.append("file", file);
            data.append("username", '王大崔');
            this.props.actions.upload({
                body:{
                    method: 'POST',
                    body: data
                },
                callback:(data)=>{
                    message.success('上传成功！')
                    this.setState({ imageURL: `${WINDOW_HOST}/${data.file}` });
                }
            })
        }
    }
    deleteSubmit = (e) =>{
        e.preventDefault();
        let file = this.uploadInput;
        file.value = '';
        $('#preview').empty()
    }
    preview =()=>{
        let file = this.uploadInput.files[0];
        var img = new Image(), url = img.src = URL.createObjectURL(file);
        $(img).addClass("img-responsive");
        var $img = $(img);
        img.onload = function() {
            URL.revokeObjectURL(url);
            $('#preview').empty().append($img);
        }
    }
    render(){
        return(
            <div style={{padding:"20px"}}>
                <Pagination total={20}></Pagination><br/><br/>
                <div style={{margin:"20px",border:"1px solid gray",minHeight:"100px",padding:"10px"}}>
                    <FormulaEditor></FormulaEditor>
                </div>
                <div style={{margin:"20px",border:"1px solid gray",minHeight:"100px",padding:"10px"}}>
                    <form>
                        <input ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.preview} /><br/>
                        <div id="preview"></div>
                        <p>请再次确定上传的文件是否正确，上传后不能修改</p>
                        <button type="button" className="btn btn-default btn-sm" onClick={this.upLoadSubmit}>开始上传</button>
                        <button type="button" className="btn btn-default btn-sm" onClick={this.deleteSubmit}>删除</button>
                        <br/>
                    </form>
                </div>
                <div className="nothispart">没有此部分</div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ push, upload}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test)