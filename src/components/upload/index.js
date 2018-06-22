/**
 * Created by gaoju on 2018/1/18.
 */

import React,{Component} from 'react'
import './style.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {WINDOW_HOST} from '../../config'
import {beforeUpload} from '../../method_public/public'
import * as Modals from '../../method_public/antd-modal'
import {upload} from '../../redux/actions/upload'


class UpLoadFile extends Component{
    constructor(props){
        super(props)
        this.state={
            imageURL:""
        }
    }
    upLoadSubmit = (e) =>{
        e.preventDefault();
        let _this = this;
        Modals.showConfirm("请再次确定上传的文件是否正确，上传后不能修改，确定是否提交？", function () {
            let file = _this.uploadInput.files[0];
            if(beforeUpload(file)){
                const data = new FormData();
                data.append("file", file);
                data.append("username", sessionStorage.getItem('username'));
                data.append("preurl",_this.state.imageURL);//前一个上传的答案，如果从新上传一张则删除上传的前一张
                _this.props.actions.upload({
                    body:{
                        method: 'POST',
                        body: data
                    },
                    callback:(data)=>{
                        Modals.success('','上传成功！')
                        _this.setState({ imageURL: `${WINDOW_HOST}/${data.file}` });
                        setTimeout(()=>{
                            _this.props.imgUrl(_this.state.imageURL)//将子页面的值传回父级
                            _this.props.submitHandle();
                        },1000)
                    }
                })
            }
        })
    }
    deleteSubmit = (e) =>{
        e.preventDefault();
        let file = this.uploadInput;
        file.value = '';
        $('#preview').empty()
    }
    preview =()=>{
        console.log("onchange------->>>>>>>=====>>>>>",this.state.imageURL)
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
            <div className="fileupload">
                <form>
                    <label htmlFor="exampleInputFile">上传文件：</label>
                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.preview} id="exampleInputFile" /><br/>
                    <div id="preview"></div>
                    <button type="button" className="btn ant-btn-danger btn-sm" onClick={this.deleteSubmit}>删除</button>
                    <button type="button" className="btn btn-default btn-sm" onClick={this.upLoadSubmit}>开始上传</button>
                    <br/>
                </form>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({upload}, dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(UpLoadFile)