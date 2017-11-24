/**
 * Created by gaoju on 2017/11/15.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getBasic } from '../../redux/actions/basic'
import { getEnglish } from '../../redux/actions/english'
import { getMath } from '../../redux/actions/math'


const SubMenu = Menu.SubMenu;
class Home extends Component {
    constructor(props) {
        super(props)
        //this.pid = props.currentPage.get('id');
        this.state = {
            route:'basic',
            activeName:window.location.hash.split('/')[window.location.hash.split('/').length-1]
        };
        this.exitOut = this.exitOut.bind(this);
    };
    componentWillMount(){
        //let token = sessionStorage.getItem('token');
        //let username = sessionStorage.getItem('username');
        //console.log("session username------>"+username)
        //if(!username){
        //    alert("请登录！")
        //    this.props.actions.push('/')
        //    return;
        //}
    }
    componentDidMount(){
        document.body.style.backgroundColor = '#F5F5F5';
    };
    load(pid) {
        if (pid) {
            this.props.actions.getBasic({ params: {pid: pid }})
            this.props.actions.getEnglish({ params: {pid: pid }})
            this.props.actions.getMath({ params: {pid: pid }})
            this.pid = pid;
        }
    }

    componentWillReceiveProps(nextProps) {
        //this.setState({
        //    activeName: window.location.hash.split('/')[window.location.hash.split('/').length-1]
        //})
        //if (this.pid !== nextProps.currentPage.get('id')) {
        //    this.load(nextProps.currentPage.get('id'))
        //}
    }
    handleClick = (e) => {
        console.log('click ', e);
        let item = e;
        let route = item.keyPath.pop();
        console.log("item route-->"+route)
        this.props.actions.push(`/home/${route}`)
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
        let { basic, english, math } = this.props;
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
                <section className="flex-box section-all">
                    <menu className="menu-css">
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 240}}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['basic']}
                            mode="inline"
                        >
                            <SubMenu key="basic" title={<span><Icon type="mail" /><span>我的栏目</span></span>}>
                                <Menu.Item key="1">基本信息</Menu.Item>
                                <Menu.Item key="2">我的收藏</Menu.Item>
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
    return {
        //currentPage: state.currentPage,
        //basic: state.basic,
        //english: state.english,
        //math:state.math
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getBasic,getMath,getEnglish}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
