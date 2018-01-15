/**
 * Created by gaoju on 2017/11/15.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import PureRenderMixin from '../../method_public/pure-render'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

const SubMenu = Menu.SubMenu;
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            route:'basic',
            activeName:window.location.hash.split('/')[window.location.hash.split('/').length-1]
        };
        this.exitOut = this.exitOut.bind(this);
    };
    componentDidMount(){
        document.body.style.backgroundColor = '#F5F5F5';
        let screenHeight = document.documentElement.clientHeight;
        let screenWeight = document.documentElement.clientWidth;
        console.log(screenWeight,screenHeight)
        document.getElementById("section").style.height = (screenHeight-80-40)+'px';
    };
    handleClick = (e) => {
        console.log('click ', e);
        let route='';
        let routeflag=e.keyPath.pop();
        console.log('routeflag--> ',routeflag);
        console.log("item route-->"+route,e.key)
        if(routeflag == "basic"){
            route = "basic/"+e.key;
            console.log('basic--> ', route);
            this.props.actions.push(`/home/${route}`)
        }else if(routeflag == "math"){
            route = e.key;
            console.log('math--> ',e,route);
            this.props.actions.push(`/home/${route}`)
        }
        this.setState({
            activeName: route
        })
    };
    exitOut(){
        console.log("exitOut")
        if(window.confirm("确定要退出吗？")){
            sessionStorage.clear();
            this.props.actions.push('/');
        }else {
            console.log("不想退出你点击干嘛？")
        }
    };
    render() {
        return (
            <div className="home">
                <header id="header-home" className="flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        <div className="header-check-btn">
                            <Icon type="logout" style={{cursor:"pointer"}} onClick={this.exitOut}></Icon>
                        </div>
                    </div>
                </header>
                <section id="section" className="flex-box section-all">
                    <menu className="menu-css">
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 240}}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['basic']}
                            mode="inline"
                        >
                            <SubMenu key="basic" title={<span><Icon type="mail" /><span>我的栏目</span></span>}>
                                <Menu.Item key="basicInfo">基本信息</Menu.Item>
                                <Menu.Item key="myCollection">我的收藏</Menu.Item>
                                <Menu.Item key="echartsDetails">图表分析</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="math"><Icon type="mail" />数学栏目</Menu.Item>
                        </Menu>
                    </menu>
                    <section className="full-width section-left">
                        <div>{this.props.children}</div>
                    </section>
                </section>

            </div>

        );
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
