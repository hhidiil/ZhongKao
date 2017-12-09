/**
 * 试题
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList} from '../../../../redux/actions/math'
import SelectMenu from '../../../../components/selectMenu/selectMenu'
import './question_style.css'
import { Pagination } from 'antd';
import { Menu, Icon, } from 'antd'
const SubMenu = Menu.SubMenu;


class Question extends Component{
    constructor(props){
        super(props);
        this.state={
            JSON_aLL:"Exam_19008687-3c57-4105-8b6c-18205a4616a3.json",//某套题的JSON串，可取到某套试题的所有数据
            current:1,
            mainContent:true,//主题干显隐，展开true闭合false
            AnalysisMenu:'0',//分析解答中左侧menu
            AnalysisFlag:true,//分析解答
            AnswerFlag:false,//标准答案
            Exercise1Flag:false,//巩固
            Exercise2Flag:false//扩展
        }
    }
    componentDidMount(){
    }
    requestQuestion(type){
        console.log(type)
        switch (type){
            case 'Analysis' :
                this.setState({AnalysisFlag:true, AnswerFlag:false, Exercise1Flag:false, Exercise2Flag:false,mainContent:true});
                break;
            case 'Answer' :
                this.setState({AnalysisFlag:false, AnswerFlag:true, Exercise1Flag:false, Exercise2Flag:false,mainContent:true});
                break;
            case 'Exercise1' :
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true, Exercise2Flag:false,mainContent:false});
                break;
            case 'Exercise2':
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:false, Exercise2Flag:true,mainContent:false});
                break;
            default: break;
        }

    }
    handleSkip(){
        alert("skip")
    }
    handleClick = (e) =>{
        let type = e.key;
        console.log(type)
        switch (type){
            case 'observe' :
                this.setState({AnalysisMenu:'0'});
                break;
            case 'analysis' :
                this.setState({AnalysisMenu:'1'});
                break;
            case 'testSites' :
                this.setState({AnalysisMenu:'2'});
                break;
            case 'answer':
                this.setState({AnalysisMenu:'3'});
                break;
            default: break;
        }
    }
    _contentQtxt(){
        return (
            <div>
                <ul>
                    <li>
                        <p>24．如图，矩形ABCD的对角线AC、BD相交于点O，△COD关于CD的对称图形为△CED。</p>
                        <p><img src="public/images/img/01.png"/></p>
                        <p>1）求证：四边形OCED是菱形；</p>
                        <p>2）连接AE，若AB = 6cm，BC = cm。</p>
                        <p>求sin∠EAD的值；</p>
                        <p> 若点P为线段AE上一动点（不与点A重合），连接OP，一动点Q从点O出发，以1cm/s的速度沿线段OP匀速运动到点P，再以1.5cm/s的速度沿线段PA匀速运动到点A，到达点A后停止运动。当点Q沿上述路线运动到点A所需要的时间最短时，求AP的长和点Q走完全程所需的时间。</p>
                    </li>
                </ul>
            </div>
        )
    }
    _analysisQtxt(data){
        if(data == '0') {
            return (
                <div style={{padding: "0 10px"}}>
                    <div id="observer">
                        <ul>
                            <li>
                                <p><b>【观察想法】</b></p>
                                <p>[矩形综合题]</p>
                                <p>矩形的对角线相等且互相平分，则CO = DO，又△COD与△CED关于直线CD对称，所以四边形OCED的四条边都相等。</p>
                                <p>要求sin∠EAD的值，就需要考虑或者构造直角三角形。若设AE与CD相交于点K，考虑Rt△ADK，则sin∠EAD =DK/AK
                                    ，需设法求出DK与AK的长。或者，过点E作AD的垂线，交AD的延长线于点F，考虑Rt△AEF，则sin∠EAD =EF/AE ，
                                    不难知道EF = <input type="text" className="input_blank"/>
                                    <button className="skipText"><SelectMenu></SelectMenu></button>
                                    ，AF=3/2 ，利用勾股定理可求AE的长，所以，此种方法也行的通。
                                </p>
                                <p><img src="public/images/img/04.png"/></p>
                                <p>最后的动点问题。如下图所示，点Q运动所需的时间t = OP/1 +AP/3 = OP + 2/3*AP（秒），如何求其最小值呢？可能有两个方向，一个是建立直角坐标系，
                                    求关于t的函数表达式，这可能会有点繁琐；另一个是利用几何性质，寻求将OP或者AP的转化为更容易计算的某条边，这可能需求结合前述的条件，比如sin∠EAD的值。</p>
                                <p><img src="public/images/img/05.png"/></p>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }else if(data == '1'){
            return(
                <div style={{padding: "0 10px"}}>
                    <div id="testSites" style={{border: "1px solid #ddd",backgroundColor:"white",margin: "5px 0"}}>
                        <div style={{padding:"10px"}}>
                            <p><b>【考点：】</b></p>
                            <p style={{marginLeft: "10px"}}><label>
                                <input type="checkbox"/>矩形的性质</label>
                                <label><input type="checkbox"/>轴对称</label>
                                <label><input type="checkbox"/>菱形的判定</label>
                                <label><input type="checkbox"/>三角函数</label>
                                <label><input type="checkbox"/>勾股定理</label>
                                <label><input type="checkbox"/>动点问题</label>
                                <label><input type="checkbox"/>最值问题</label>
                            </p>
                        </div>
                        <div>
                            <ul>
                                <li>
                                    <p>1）矩形的性质</p>
                                    <p><b>矩形的性质及其判定</b></p>
                                    <p>定义：有一个角是直角的平行四边形是矩形。</p>
                                    <p><b>性质：</b></p>
                                    <p>① 矩形有平行四边形的一切性质；</p>
                                    <p>② 矩形的四个角都是直角；</p>
                                    <p>③ 矩形的对角线相等且互相平分；</p>
                                    <p>④ 矩形既是中心对称图形又是轴对称图形。</p>
                                    <p><b>判定定理：</b></p>
                                    <p>① 有一个角是直角的平行四边形叫做矩形（定义）；</p>
                                    <p>② 对角线相等的平行四边形是矩形；</p>
                                    <p>③ 有三个角是直角的四边形是矩形。</p>
                                </li>
                                <li>
                                    <p><b>轴对称</b></p>
                                    <p>定义：把一个图形沿某一条直线折叠，如果能够与另一个图形完全重合，那么就说这两个图形关于这条直线（成轴）对称，这条直线就是对称轴，两个图形的对应点叫做对称点。</p>
                                    <p><b>轴对称的性质：</b></p>
                                    <p>① 关于某直线对称的两个图形是全等形。</p>
                                    <p>② 轴对称图形的对称轴，是任何一对对应点所连线段的垂直平分线。</p>
                                    <p>③ 成轴对称的两个图形，它们的对应线段或延长线相交，交点在对称轴上。</p>
                                    <p><b>举例：</b></p>
                                    <p>① </p>
                                    <p>②</p>
                                </li>
                                <li>
                                    <p><b>菱形的性质及其判定</b></p>
                                    <p>菱形：在同一平面内，有一组邻边相等的平行四边形是菱形。</p>
                                    <p>性质：① 菱形有平行四边形的一切性质； ②菱形的四条边都相等；③菱形的两条对角线互相垂直平分，并且每一条对角线平分一组对角。③ 矩形既是中心对称图形又是轴对称图形。</p>
                                    <p><b>判定定理：</b></p>
                                    <p>① 一组邻边相等的平行四边形是菱形（定义）；</p>
                                    <p>② 对角线互相垂直的平行四边形是菱形； </p>
                                    <p>③ 四条边相等的四边形是菱形。</p>
                                    <p>面积计算：①边长×高；② 两条对角线乘积的一半。</p>
                                    <p>举例：</p>
                                    <p>①</p>
                                    <p>②</p>
                                </li>
                            </ul>
                            <ul>
                                <li><p>2）三角函数，勾股定理；动点问题，最值问题</p></li>
                                <li>
                                    <p><b>锐角三角函数</b></p>
                                    <p>如图，在Rt△ABC中，∠C=90°，∠A、∠B、∠C的对边分别记作a、b、c。</p>
                                    <p><img src="public/images/img/02.png"/></p>
                                    <p>∠A的正弦，记作sinA，有sinA= <input type="text" className="input_blank"/>  ；</p>
                                    <p>∠A的余弦，记作cosA，有cosA= <input type="text" className="input_blank"/>  ；</p>
                                    <p>∠A的正切，记作tanA，有 tanA= <input type="text" className="input_blank"/> ；</p>
                                    <p>∠A的余切，记作cotA，有 cotA= <input type="text" className="input_blank"/>  。</p>
                                    <p>∠A的正弦、余弦、正切、余切都是∠A的锐角三角函数。</p>
                                    <p>易知sin2A+cos2A =1，tan A= <input type="text" className="input_blank"/>，cot A= <input type="text" className="input_blank"/>，tanA×cotA = 1。</p>
                                </li>
                                <li>
                                    <p><b>勾股定理</b></p>
                                    <p>勾股定理：直角三角形的两条直角边的平方和等于斜边的平方。
                                        如下图所示，直角三角形两直角边分别为a、b，斜边为c，则有a2 + b2 = c2。
                                    </p>
                                    <p><img src="public/images/img/03.png"/></p>
                                    <p>勾股数就是可以构成一个直角三角形三边的一组正整数。常见的勾股数，有3、4、5；6、8、10；5、12、13等等。</p>
                                    <p><b>举例：</b></p>
                                    <p>①</p>
                                    <p>②</p>
                                </li>
                                <li>
                                    <p><b>动点问题的一般思路</b></p>
                                    <p>一般碰到动点问题，我们都需要找出其变量和不变量，对于变量，可以观察其极限位置、特殊位置或其动态变化的过程，
                                        看能否找到特殊值或者对其进行转化；对于不变量，需要联想到与不变量相关的结论或定理，看是否能用得上。</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }else if(data == '2'){
            return(
                <div style={{padding: "0 10px"}}>
                    <div id="analysis">
                        <ul>
                            <li>
                                <p><b>提示分析</b></p>
                                <p>1）由矩形的性质，CO = DO，再结合△COD与△CED的对称性，可知四边形OCED的四条边都相等。</p>
                                <p>2）
                                    ① 求sin∠EAD的值，有两种方法，如下图所示：
                                </p>
                                <p><img src="public/images/img/04.png"/></p>

                                <p>方法一：若设AE与CD相交于点K，考虑Rt△ADK，sin∠EAD =  ，设法求出DK与AK的长。菱形的对边平行，所以DE//AC，于是 = = ，可求得DK= <input type="text" className="input_blank"/> ，AD已知，利用勾股定理可求AK的长。</p>
                                <p>方法二：过点E作AD的垂线，交AD的延长线于点F，考虑Rt△AEF，sin∠EAD = ，不难知道EF = blank ，AF= ，利用勾股定理可求AE的长。</p>
                                <p>②由题意，结合下图，点Q运动所需的时间t =  + = OP + AP（秒）。
                                </p>
                                <p><img src="public/images/img/05.png"/></p>
                                <p>作PG⊥AD于点G，实际上，由 ① 的结论，PG = AP·sin∠EAD =  AP，所以t = OP + AP = OP +<input type="text" className="input_blank"/>（秒）。不难知道，当O、P、F三点共线时，OP+PF 的值最小。此时点F是AD的中点，不难求得AP的长。</p>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }else if(data == '3'){
            return(
                <div style={{padding: "0 10px"}}>
                    <div id="answer">
                        <ul>
                            <li>
                                <p><b>证明：</b></p>
                                <p>∵ABCD是矩形，</p>
                                <p>∴AO= BO = CO= DO，</p>
                                <p>∵△COD与△CED关于CD对称，</p>
                                <p>∴DE = DO，CE = blank ，</p>
                                <p>∴DE = CE = DO = CO，</p>
                                <p>∴四边形OCED是菱形。</p>
                            </li>
                            <li>
                                <p>2）解：</p>
                                <p>① 求sin∠EAD的值，有两种方法，如下图：</p>
                                <p><img src="public/images/img/04.png"/></p>
                                <p>方法一：设AE与CD相交于点K，考虑Rt△ADK，则sin∠EAD =  。</p>
                                <p>∵四边形OCED是菱形，</p>
                                <p>∴ DE//AC，DE = CO = AO，</p>
                                <p>∴ DK/DF=DE/AC =1/2 ，</p>
                                <p>∵AB = CD=6，</p>
                                <p>∴DK= blank ，</p>
                                <p>在Rt△ADK中，AD = BC =  ，由勾股定理，得AK=  = blank ，</p>
                                <p>所以，sin∠EAD = = 。</p>
                                <p>方法二：过点E作AD的垂线，交AD的延长线于点F，考虑Rt△AEF，sin∠EAD = 。易知EF = 3，AF= ，由勾股定理，AE = =  ，从而，求得sin∠EAD = = 。</p>
                                <p>作PG⊥AD于点G，如下图所示：</p>
                                <p><img src="public/images/img/05.png"/></p>
                                <p>由 ① 的结论，PG = AP·sin∠EAD =  AP，所以点Q运动所需的时间t =  + = OP + AP = OP + blank （秒）。显然，当O、P、F三点共线时，OP+PF 的值最小。此时点F是AD的中点，
                                    PF是△ADK的中位线，OP+PF= OF =  CD = 3，即点Q走完全程所需的最短时间为blank 秒。而AP = AK = 。</p>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }
    }
    _exercise1Qtxt(){
        return (
            <div>
                <ul>
                    <li>
                        <p>（1）、  已知：如图，矩形ABCD的对角线AB、BD相交于点O，DE//CA，AE//BD。求证：四边形AODE是菱形。 </p>
                        <p><img src="public/images/img/10.png"/></p>
                        <p> [考点]：</p>
                        <p>矩形的性质及其判定、菱形的性质及其判定、平行四边形 </p>
                        <p>要求sin∠EAD的值，就需要考虑或者构造直角三角形。若设AE与CD相交于点K，考虑Rt△ADK，则sin∠EAD =DK/AK  ，需设法求出DK与AK的长。或者，过点E作AD的垂线，交AD的延长线于点F，考虑Rt△AEF，则sin∠EAD =EF/AE ，不难知道EF = ___ ，AF=3/2 ，利用勾股定理可求AE的长，所以，此种方法也行的通。</p>
                        <p><img src="public/images/img/04.png"/></p>
                        <p>最后的动点问题。如下图所示，点Q运动所需的时间t =  + = OP + AP（秒），如何求其最小值呢？可能有两个方向，一个是建立直角坐标系，求关于t的函数表达式，这可能会有点繁琐；另一个是利用几何性质，寻求将OP或者AP的转化为更容易计算的某条边，这可能需求结合前述的条件，比如sin∠EAD的值。</p>
                        <p><img src="public/images/img/05.png"/></p>
                    </li>
                </ul>
            </div>
        )
    }
    _exercise2Qtxt(){
        return (
            <div>
                <ul>
                    <li>
                        <p>（1）、  已知：如图，矩形ABCD的对角线AB、BD相交于点O，DE//CA，AE//BD。求证：四边形AODE是菱形。 </p>
                        <p><img src="public/images/img/10.png"/></p>
                        <p> [考点]：</p>
                        <p>矩形的性质及其判定、菱形的性质及其判定、平行四边形 </p>
                        <p>要求sin∠EAD的值，就需要考虑或者构造直角三角形。若设AE与CD相交于点K，考虑Rt△ADK，则sin∠EAD =DK/AK  ，需设法求出DK与AK的长。或者，过点E作AD的垂线，交AD的延长线于点F，考虑Rt△AEF，则sin∠EAD =EF/AE ，不难知道EF = ___ ，AF=3/2 ，利用勾股定理可求AE的长，所以，此种方法也行的通。</p>
                        <p><img src="public/images/img/04.png"/></p>
                        <p>最后的动点问题。如下图所示，点Q运动所需的时间t =  + = OP + AP（秒），如何求其最小值呢？可能有两个方向，一个是建立直角坐标系，求关于t的函数表达式，这可能会有点繁琐；另一个是利用几何性质，寻求将OP或者AP的转化为更容易计算的某条边，这可能需求结合前述的条件，比如sin∠EAD的值。</p>
                        <p><img src="public/images/img/05.png"/></p>
                    </li>
                </ul>
            </div>
        )
    }
    onChange = (page) => {
        console.log(page)
        this.setState({
            current: page,
        })
    }
    exitBack(){
        this.props.actions.push("/home/math/questions")
    }
    render(){
        console.log("this.state.current------"+this.state.current)
        return(
            <div className="mask">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">2017年北京大学内部专家通宵熬夜出版中考考试真题</div>
                        <div className="exit" onClick={this.exitBack.bind(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="pagination_content">
                        <div className="pagination_before"><Pagination current={this.state.current} pageSize={1} onChange={this.onChange} total={8} /></div>
                        <div className="btnContainer" id="btnContainer">
                            <button id="Explain_exer" type="button" className="btn btn-primary"
                                    onClick={()=>this.requestQuestion("Analysis")}>
                                解答分析
                            </button>
                            <button id="Explain_exer" type="button" className="btn btn-primary"
                                    onClick={()=>this.requestQuestion("Answer")}>
                                标准答案
                            </button>
                            <button id="Exercise1_exer" type="button" className="btn btn-primary"
                                    onClick={()=>this.requestQuestion("Exercise1")} >
                                巩固练习
                            </button>
                            <button id="Exercise2_exer" type="button" className="btn btn-primary"
                                    onClick={()=>this.requestQuestion("Exercise2")} >
                                拓展练习
                            </button>
                        </div>
                    </div>
                    <section className="QtxtContent">
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt()}
                            </div>
                        </div>
                        <div id="Analysis_Qtxt" className={this.state.AnalysisFlag?'':'displaynone'}>
                            <div className="content_three">
                                <div className="content_three_left">
                                    <menu>
                                        <Menu
                                            onClick={this.handleClick}
                                            defaultSelectedKeys={['observe']}
                                            mode="inline"
                                        >
                                            <Menu.Item key="observe"><Icon type="mail" />观察</Menu.Item>
                                            <Menu.Item key="analysis"><Icon type="mail" />分析</Menu.Item>
                                            <Menu.Item key="testSites"><Icon type="mail" />考点</Menu.Item>
                                            <Menu.Item key="answer"><Icon type="mail" />解答</Menu.Item>
                                        </Menu>
                                    </menu>
                                </div>
                                <div className="content_three_right">
                                    {this._analysisQtxt(this.state.AnalysisMenu)}
                                </div>
                            </div>
                        </div>
                        <div id="Exercise1_Qtxt" className={this.state.Exercise1Flag?'':'displaynone'}>
                            <div className="content_three_right">
                                {this._exercise1Qtxt()}
                            </div>
                            <div style={{clear:"both"}}></div>
                        </div>
                        <div id="Exercise2_Qtxt" className={this.state.Exercise2Flag?'':'displaynone'}>
                            <div className="content_three_right">
                                {this._exercise2Qtxt()}
                            </div>
                            <div style={{clear:"both"}}></div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        QuestionList:state.QuestionList
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getQuestionList}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
