/**
 * Created by gaoju on 2017/11/15.
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Menu, Dropdown, Icon ,Button,Row, Col,Input} from 'antd'
import './style.css'
import Login from './login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push,replace } from 'react-router-redux'
import PureRenderMixin from '../../method_public/pure-render'
import {handleImg} from '../../method_public/public'
import { getHomeShowList} from '../../redux/actions/page'
import {updateStoreHeadImg} from '../../redux/actions/public'
import {Storage_S,AppID} from '../../config'

const colorList=["mediumorchid","cornflowerblue","chocolate","yellowgreen","tomato","gold"];
class Door extends Component {
    constructor(props) {
        super(props);
        let status = Storage_S.getItem('loginstatus');
        this.state={
            loginstatus:status?status:false,//登录状态
            homeShowList: [],
            loginStatus:false
        }
    }
    componentDidMount(){
        let headimg = Storage_S.getItem('headimg');
        this.props.actions.getHomeShowList({
            body:{},
            success:(data)=>{
                console.log("首页查询列表出错：",data)
                this.setState({homeShowList:data})
            },
            error:(message)=>{
                console.error("首页查询列表出错：",message)
            }
        });
        this.props.actions.updateStoreHeadImg({data:headimg,clear:false})//当页面刷新store会重置，需要重新更新store
        var obj = new WxLogin({
            id:"login_container",
            appid: AppID,
            scope: "snsapi_login",
            redirect_uri: encodeURIComponent('https://zhongkao.idiil.com.cn/api/user/get_wx_access_token'),
            state: "STATE123",
            style: "",
            href: ""
        });
    };
    enterSystem(){
        if(this.state.loginstatus){
            this.props.actions.replace('home')
        }else {
            window.confirm('请先登录！')
        }
    }
    getWechatlogin(){
       console.log("getWechatlogin-------")
        this.setState({loginStatus:!this.state.loginStatus})
    }
    _showListItem(showList){
        let pageSize = showList.length;
        if (pageSize > 0) {
            const showItem = showList.map((item,index)=>{
               let  color = {
                   background:colorList[index]
               }
                return (
                    <div key={index} className="col-sm-4">
                        <div className="thumbnail" style={{maxWidth: '350px',margin:' 0 auto'}}>
                            <img className="door_headimg" src={handleImg(item.headimg)} title="头像" onError={(e)=>{e.target.src = "public/images/user_head.jpg"}}/>
                            <div className="caption message" style={color}>
                                <h3>{item.username}</h3>
                                <p>{item.phone}</p>
                            </div>
                        </div>
                    </div>
                )
            },this)
            return showItem
        }
    }
    _showWapper4List(){
        const showWapper =[];
        const showdata=[
            {
            title:'专题',
            content:'专项提升，巩固加强'
            },{
            title:'模考',
            content:'模拟考试，还原真实考试场景'
            },{
                title:'训练',
                content:'优质试题，刷题增强'
            },{
                title:'检测',
                content:'查漏补缺，针对性检测'
            },{
                title:'巩固',
                content:'加强巩固，趁热打铁'
            },{
                title:'拓展',
                content:'知识拓展，增强知识面'
            },
        ];
        for(let i=0;i<6;i++){
            showWapper.push(
                <div className="col-md-4 part" key={i}>
                    <i className={"sev-icon sev-icon"+(i+1)}></i>
                    <h3>{showdata[i].title}</h3>
                    <p>{showdata[i].content}</p>
                </div>)
        }
        return showWapper
    }
    _showLoginForm(){
        return (
            <div className="loginTest" style={this.state.loginStatus ? {display:'block'}:{display:'none'}}>
                <Row gutter={16}>
                    <Col className="gutter-row" span={8}>
                        <div>
                            code:<Input id="input1"  placeholder="请输入内容" />
                            state:<Input id="input2" placeholder="请输入内容" />
                            <Button onClick={()=>{this.loginClick('1')}}>网页扫码</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div>
                            <div>自定义</div>
                            <div id="login_container" style={{height: '300px'}}></div>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div>
                            code:<Input id="input3" placeholder="请输入内容" />
                            encryptedData:<Input id="input4" placeholder="请输入内容" />
                            iv:<Input id="input5" placeholder="请输入内容" />
                            <Button onClick={()=>{this.loginClick('2')}}>微信获取信息</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
    loginClick(param){
        console.log("参数=======》",param)
        let input1 =  $('#input1').val();
        let input2 =  $('#input2').val();
        let input3 =  $('#input3').val();
        let input4 =  $('#input4').val();
        let input5 =  $('#input5').val();
        let requestConfig = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        let url='';
        if(param == '1'){
            url = `https://zhongkao.idiil.com.cn/api/user/get_wx_access_token?code=${input1}&state=${input2}`;
        }else if(param == '2'){
            url = `/api/user/getUnionId?code=${input3}&encryptedData=${input4}&iv=${input5}`;
        }
        fetch(url,requestConfig).then((res)=>{
            console.log(res);
            return res.json();
        }).then((data)=>{
            console.log(data);
        })
    }
    render() {
        let { userheadimg } = this.props;
        //let error = PureRenderMixin.Compare([homeShowList]);//优化render
        //if (!error) return <div/>
        const headerimg = (
            <div className="floatR">
                <img className="door-headerimg" src={handleImg(userheadimg.get('headimg'))} alt="头像"/>
            </div>
        );
        const login = (
            <div className="header-check-btn">
                <Login title="登录" style="color-white" loginHandle={()=>this.setState({loginstatus:true})}></Login>
                <Link to="/register" className="color-white marginl10">注册</Link>
            </div>
        );
        return (
            <div className="door">
                <header id="header" className="mainBackgroundColor header flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        {/*this.state.loginstatus?headerimg:login*/}
                    </div>
                </header>
                <div className="mainWapper">
                    <section className="page banner-wapper1">
                        <div className="content">
                            <p style={{fontSize:'24px'}}>IDIIL中考智能系统</p>
                            <div className="enterstart">
                                <Button className="doorBtn mainBackgroundColor">
                                    {this.state.loginstatus?<div onClick={()=>this.enterSystem()}>进入</div>:<Login title="登录" style="color-white" loginHandle={()=>this.setState({loginstatus:true})}></Login>}
                                </Button>
                                <Button className="doorBtn"><Link to="/register">注册</Link></Button>
                            </div>
                        </div>
                    </section>
                    <section className="banner-wapper2 flex-box box-align-center justify-center">
                        <div className="content">
                            <h2>Welcome To Senior High School Entrance Examination</h2>
                            <p>中考，全称为初中学业水平考试。是检测初中在校生是否达到初中学业水平的水平性考试和建立在九年义务教育基础上的高中选拔性考试；是初中毕业证发放的必要条件，考试科目将国家课程方案所规定的学科全部列入初中学业水平考试的范围。学生可根据中考成绩报考相应的普通高中、职业高中、中专、中技、中职等。其中以报考普通高中为主</p>
                        </div>
                    </section>
                    <section className="banner-wapper3 mainBackgroundColor">
                        <div className="content">
                            <h3>特色部分</h3>
                            <div className="special-parts">
                                <div className="parts one">
                                    <div className="col-md-9">
                                        <p><span>Part one:</span>线下作业，为学生特定指派课程作业，旨在使学生能够自觉练习。，为学生特定指派课程作业，旨在使学生能够自觉练习.</p>
                                    </div>
                                    <div className="col-md-3">
                                        <img src="public/images/special3.png"/>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="parts two">
                                    <div className="col-md-3">
                                        <img src="public/images/special2.png"/>
                                    </div>
                                    <div className="col-md-9">
                                        <p><span>Part two:</span>线上作业，可以让学生回家后在家里做作业不需要课本，可以在线上模拟开始做题。可以让学生回家后在家里做作业不需要课本，可以在线上模拟开始做题。</p>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="parts three">
                                    <div className="col-md-9">
                                        <p><span onClick={()=>this.getWechatlogin()}>Part three:</span>一对一，此功能在最后阶段会给每一位学生指定一个老师进行一对一的辅导。给每一位学生指定一个老师进行一对一的辅导。给每一位学生指定一个老师进行一对一的辅导。</p>
                                    </div>
                                    <div className="col-md-3">
                                        <img src="public/images/special4.png"/>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                {this._showLoginForm()}
                            </div>
                        </div>
                    </section>
                    <section className="banner-wapper4">
                        <div className="content">
                            {this._showWapper4List()}
                        </div>
                    </section>
                    <section className="banner-wapper5 mainBackgroundColor">
                        <div className="content">
                            <h2>我们的成效</h2>
                            <div className="student-parts">
                                {this._showListItem(this.state.homeShowList)}
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </section>
                </div>
                <footer>
                    <div className="container">
                        <div className="footer-grids">
                            <div className="col-md-6">
                                <h3 style={{color:'white'}}>联系我们</h3>
                                <p>地址：北京市海淀区信息路28号科实大厦B-07A-1</p>
                                <p>电话：010-62984888</p>
                            </div>
                            <div className="col-md-6">
                                <h3 style={{color:'white'}}>版权所有</h3>
                                <p>美国爱迪乐教育研究院爱迪乐学习中心</p>
                                <p>京ICP备：10015906号</p>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}
//将redux中state的对象与组件绑定起来。一一对应map对象
function mapStateToProps(state,ownProps) {
    return {
        userheadimg: state.userheadimg
    }
}
//使用bindActionCreators绑定action
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,replace,getHomeShowList,updateStoreHeadImg}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps  )(Door)