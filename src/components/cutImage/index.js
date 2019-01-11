/**
 * Created by gaoju on 2018/1/18.
 */

import React,{Component} from 'react'
//import './main.css'
import './style.css'
import PropTypes from 'prop-types'
import { message,Input, Button, Icon,Row,Col} from 'antd';


class ImageCut extends Component{
    constructor(props){
        super(props)
        this.state={
            urlImg: props.urlImg || "",//初始化的图片
            jcrop_api:'',
            File:props.File || null
        }
    }
    componentDidMount(){
        let _this = this;
        jQuery(function($){
            var jcrop_api, boundx, boundy;
            $('#target').Jcrop({
                onChange: updatePreview,
                onSelect: updatePreview,
                onRelease:  clearCoords,
                aspectRatio: 0,
            },function(){
                var bounds = this.getBounds();
                boundx = bounds[0];
                boundy = bounds[1];
                _this.state.jcrop_api = this;
                console.log("jcrop_api--初始化图片---->",_this.state.urlImg);
            });
            function updatePreview(c) {
                $('#w').val(c.w);
                $('#h').val(c.h);
            };
            function clearCoords() {
                $('#coords input').val('');
            };
        });
        $("#uploadFile").change(function(evevt){
            _this.changeFile(this.files);
        });
        //获取选择的文件
        this.changeFile(this.props.File);
    }
    changeFile(file){
        console.log('files7777777777777777777777--->',file)
        var files = file;
        if(!files.length){return;}
        var img = new Image();
        var url = img.src = window.URL.createObjectURL(files[0]);
        this.state.urlImg = url;
        console.log("jcrop_api------>",this.state.jcrop_api);
        this.state.jcrop_api.setImage(url);
        $('#previewEnd').empty()
    }
    clickCutHandle(){
        console.log("图片的实际尺寸--图片的显示尺寸--选框的值--》",this.state.jcrop_api.getBounds(),this.state.jcrop_api.getWidgetSize(),this.state.jcrop_api.tellSelect())
        var cutAaary = this.state.jcrop_api.tellSelect();
        this.drawCanvas(cutAaary)
    }
    saveHandle(){
        if(!this.state.urlImg){return alert('剪切内容为空！！')};
        let url = $('#previewEnd img').attr('src');
        this.props.saveImgUrl(url);//传递值给父组件
    }
    drawCanvas(param){
        var _this = this;
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = _this.state.urlImg;
        var width = 400;//最终压缩的宽度默认固定值，高度按剪切比例算出
        var height;
        if(param.w>width){
            height = (param.h/param.w)*width;
        }else {
            width = param.w;
            height = param.h;
        }
        canvas.width = width;//重置画布大小会重新渲染画布
        canvas.height = height;
        console.log("图片大小---->",param.w,param.h,_this.state.urlImg);
        img.onload = function(){
            // 裁剪图片
            ctx.drawImage(img,param.x,param.y,param.w,param.h,0,0, width,height);
            _this.saveImgPreview();
        }
    }
    saveImgPreview(){
        var canvas = document.getElementById("mycanvas");
        var img = new Image();
        img.src = canvas.toDataURL("image/png");
        $('#previewEnd').empty().append(img)
    }
    render(){
        return(
            <div className="imageEdit">
                <Row>
                    <Col span={14}>
                        <div className="jc-demo-box">
                            <div className="imageEdit-header">
                                <span>源文件：</span>
                                {/* <input type="file" id="uploadFile" name="图片" />*/}
                            </div>
                            <div className="page-img">
                                <img src='public/images/uu14.png' id="target" alt="[Jcrop]" />
                            </div>
                            <div style={{margin:'15px'}}>
                                <div className="coords" id="coords" >
                                    宽：<Input type="text" id="w" name="w" />
                                    高：<Input type="text" id="h" name="h" />
                                </div>
                                <Button type="primary" onClick={()=>{this.clickCutHandle()}}>剪切</Button>
                                <Button type="primary" onClick={()=>{this.saveHandle()}}>保存</Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={10}>
                        <div className="jc-demo-box">
                            <div className="imageEdit-header">
                                <span>剪切的结果：</span>
                            </div>
                            <div style={{display: 'none'}}>
                                <canvas id="mycanvas"></canvas>
                            </div>
                            <div id="previewEnd">
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
ImageCut.propTypes = {
    saveImgUrl: PropTypes.func,
    File:PropTypes.object,
}
export default ImageCut