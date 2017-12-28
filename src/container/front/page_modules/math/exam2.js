/**
 * 试题
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import './question2.css'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList} from '../../../../redux/actions/math'
import SelectMenu from '../../../../components/selectMenu/selectMenu'
import MaskAlter from '../../../../components/Alter/maskAlter/maskalter'
import { Pagination } from 'antd';
import { Menu, Icon,Button,Tooltip } from 'antd'


class Question extends Component{
    constructor(props){
        super(props);
        this.state={
            JSON_aLL:"Exam_19008687-3c57-4105-8b6c-18205a4616a3.json",//某套题的JSON串，可取到某套试题的所有数据
            current:1,
            mainContent:true,//主题干显隐，展开true闭合false
            two_answer_content:false,//主题干显隐，展开true闭合false
            two_answer2_content:false,
            two_answer_flag:"",
            two_answer2_flag:"",
            Exercise1Flag:false,//巩固
            Exercise2Flag:false//扩展
        }
    }
    _contentQtxt(){
        return (
            <div>
                <div className="displayflex QtxtContent2_main_title">
                    <div className="QtxtContent2_main_title_left">第25题：</div>
                </div>
                <div className="QtxtContent2_main_body">
                    <ul>
                        <li>
                            <p>如图，AB是⊙O的直径，AC⌒ = BC⌒ ，AB=2，连接AC。</p>
                            <p><img src="public/images/img/111.png"/></p>
                            <p>1）求证：∠CAB=45°；</p>
                            <p>2）若直线l为⊙O的切线，C是切点，在直线l上取一点D，使BD = AB，BD所在的直线与AC所在的直线相交于点E，连接AD。</p>
                            <p>①试探究AE与AD之间的数量关系，并证明你的结论；</p>
                            <p>② 是否为定值？若是，请求出这个定值；若不是，请说明理由。</p>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    testSites=(data)=>{
        alert(data);
    }
    _analysisQtxt(){
        return (
            <div style={{padding: "5PX 20px"}}>
                <div id="observer">
                    <ul>
                        <li>
                            <p>（1）、</p>
                            <p>此证明主要考查的知识点是：</p>
                            <p>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("1")}>轴对称</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("2")}>菱形的判定</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("3")}>三角函数</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("4")}>勾股定理</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("5")}>动点问题</a></label>
                            </p>
                            <p>如下图所示，连接BC：</p>
                            <p><img src="public/images/img/112.png"/></p>
                            <p>∵AB是⊙O的直径，</p>
                            <p>∴∠ACB = <input type="text" className="input_blank"/>°
                                <Tooltip placement="topRight" title="圆周角定理"><Icon type="question-circle"/></Tooltip>，
                            </p>
                            <p>∵AC⌒ = BC⌒ ，</p>
                            <p>∴ AC =  <input type="text" className="input_blank"/>°
                                <Tooltip placement="topRight" title="圆周角定理"><Icon type="question-circle"/></Tooltip>，△ACB是等腰直角三角形，</p>
                            <p>
                                <div style={{float: "right"}}>
                                    <Button type="primary" style={{marginRight: "8px"}} disabled size="small">答案</Button>
                                    <Button type="primary" style={{marginRight: "8px"}} size="small">提交</Button>
                                </div>
                                <div style={{clear: "both"}}></div>
                            </p>
                        </li>
                        <li>
                            <p>（2）、</p>
                            <p>∵直线l为⊙O的切线，C为切点，∴ OC⊥直线l，</p>
                            <p>又∵△ACB是等腰直角三角形，∴OC⊥AB，</p>
                            <p>于是 <input type="text" className="input_blank"/>°
                                <Tooltip placement="topRight" title="平行线的判定"><Icon type="question-circle"/></Tooltip> //直线l</p>
                            <p>若BD = AB，那么点D可能在点C左侧也可能在点C右侧（为区分，将后者记作D'），分两种情况讨论。</p>
                            <p><img src="public/images/img/113.png"/></p>
                            <p>探究AE与AD的数量关系，主要考查的知识点有：</p>
                            <p>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("1")}>等腰三角形的性质与判定</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("2")}>圆周角定理</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("3")}>含30°角的直角三角形的性质</a></label>
                            </p>
                            <p>判断 是否为定值，可能用到的知识点有：</p>
                            <p>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("1")}>相似三角形及其性质</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("2")}>相似三角形的判定</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("3")}>全等三角形</a></label>
                                <label><input type="checkbox"/><a onClick={()=>this.testSites("3")}>解直角三角形</a></label>
                            </p>
                            <p>如下图所示，当点D在点C左侧时，作BF⊥CD于点F：</p>
                            <p><img src="public/images/img/114.png"/></p>
                            <p>易知AB//CD，四边形OBFC是矩形。（因为OA=OB=OC，所以四边形OBFC实际是正方形。）</p>
                            <p><b>解：</b>Rt△DBF，设法求出∠ADB与∠AED的值。</p>
                            <p>∵BD = AB = 2OC = 2BF，</p>
                            <p>∴∠ABD = ∠BDF =30°，</p>
                            <p>∴∠ADB= ∠DAB = <input type="text" className="input_blank"/>
                                <Tooltip placement="topRight" title="三角形内角和"><Icon type="question-circle"/></Tooltip> °，</p>
                            <p>∵∠AED = ∠ABD +∠EAB =30°+45°= 75°，</p>
                            <p>∴∠ADB =∠AED ，</p>
                            <p>∴AD =AE。</p>
                            <p>求 的值，利用相似三角形的性质分别求出EB与CD的具体值。</p>
                            <p>∵AB//CD，</p>
                            <p>∴△CDE∽△A <input type="text" className="input_blank"/>
                                <Tooltip placement="topRight" title="相似三角形的判定"><Icon type="question-circle"/></Tooltip>，</p>
                            <p>∴ CD/AB=DE/BE ，</p>
                            <p>在Rt△BFD中， BD = AB = 2，CF= BF=1，∠BDF=30°，所以，DF= ，CD = -1 。</p>
                            <p>设BE = x，则DE= <input type="text" className="input_blank"/> ，</p>
                            <p>∴ EB/CD=<input type="text" className="input_blank"/> 。</p>
                            <p>如下图所示，当点D在点C右侧时（为区分，记作D' 和E'），类似的，作BF⊥CD' 于点F：</p>
                            <p><img src="public/images/img/115.png"/></p>
                            <p>易知AB//CD'，四边形OBFC是正方形。</p>
                            <p>∵BD' = AB =2BF，∴∠BD' F =30°，∵∠AD' B=∠BAD' =∠CD' A</p>
                            <p>∴∠AD' B = <input type="text" className="input_blank"/>
                                <Tooltip placement="topRight" title="三角形内角和"><Icon type="question-circle"/></Tooltip> °，</p>
                            <p>又∠ABE' =∠CD' E' =30°，∠CAB = ∠AE'B+∠ABE' =45°，</p>
                            <p>∴∠AE' D' = blank °，即∠AD' B = ∠AE' D'，∴AD' =AE'。</p>
                            <p>求E'B/CD' 的值。</p>
                            <p>∵AB//CD'，∴△CD'E' ∽△ABE'，∴ CD'/AB=BE'/D'E' ，</p>
                            <p>在Rt△BFD' 中， AB = BD'=2，BF=1，易知D' F= ，CD' = +1 。</p>
                            <p>设BE' = y，则D'E' = <input type="text" className="input_blank"/> ，</p>
                            <p>于是 = ，解得y =2 +2，</p>
                            <p>同样，有 E'B/CD'=2。</p>
                            <p>
                                <div style={{float: "right"}}>
                                    <Button type="primary" style={{marginRight: "8px"}} disabled size="small">答案</Button>
                                    <Button type="primary" style={{marginRight: "8px"}} size="small">提交</Button></div>
                                <div style={{clear: "both"}}></div>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    _two_answerContent(data){
        if(data == 'sites'){
            return(
                <div>
                    <div><b>考点：</b></div>
                    <div style={{padding:"5px 20px"}}>
                        <p><a onClick={()=>this.testSites("圆心角定理")}>圆心角定理</a>、
                            <a onClick={()=>this.testSites("圆周角定理")}>圆周角定理</a>
                        </p>
                    </div>
                </div>
            )
        }else if(data == 'answer'){
            return(
                <div>
                    <div><b>答案：</b></div>
                    <div style={{padding:"5px 20px"}}>
                        <p>解：如图，连接AD，</p>
                        <p><img src="public/images/img/144.png"/></p>
                        <p>∵AB是⊙O的直径，</p>
                        <p>∴∠ADB =90°</p>
                        <p>∵∠APB =∠ADB+∠CAD=110°，</p><p>∴∠CAD =20°，</p>
                        <p>∵BC⌒ =CD⌒  ，</p>
                        <p>∴∠BAC=∠CAD=20°，</p>
                        <p>∴∠ABD = 180°-20°-20°= 50°。</p>
                    </div>
                </div>
            )
        }else if(data == 'jiexi'){
            return(
                <div>
                    <div><b>解析：</b></div>
                    <div style={{padding:"5px 20px"}}></div>
                </div>
            )
        }
    }
    _two_answer2Content(data){
        if(data == 'sites'){
            return(
                <div>
                    <div><b>考点：</b></div>
                    <div style={{padding:"5px 20px"}}>
                        <p><a onClick={()=>this.testSites("圆心角定理")}>圆心角定理</a>、
                            <a onClick={()=>this.testSites("圆周角定理")}>圆周角定理</a>
                        </p>
                    </div>
                </div>
            )
        }else if(data == 'answer'){
            return(
                <div>
                    <div><b>答案：</b></div>
                    <div style={{padding:"5px 20px"}}>
                        <p>解：如图，连接AD，</p>
                        <p><img src="public/images/img/144.png"/></p>
                        <p>∵AB是⊙O的直径，</p>
                        <p>∴∠ADB =90°</p>
                        <p>∵∠APB =∠ADB+∠CAD=110°，</p><p>∴∠CAD =20°，</p>
                        <p>∵BC⌒ =CD⌒  ，</p>
                        <p>∴∠BAC=∠CAD=20°，</p>
                        <p>∴∠ABD = 180°-20°-20°= 50°。</p>
                    </div>
                </div>
            )
        }else if(data == 'jiexi'){
            return(
                <div>
                    <div><b>解析：</b></div>
                    <div style={{padding:"5px 20px"}}></div>
                </div>
            )
        }
    }
    closeContent(){
        this.setState({two_answer_content:false,two_answer2_content:false})
    }
    two_answer(data){
        this.setState({
            two_answer_content:true,
            two_answer_flag:data
        })
    }
    two_answer2(data){
        this.setState({
            two_answer2_content:true,
            two_answer2_flag:data
        })
    }
    _exercise1Qtxt(){
        return (
            <div className="exercise2">
                <div className="exercise2-border">
                    <div className="exercise2_main_content">
                        <p>（1）、如图，AB是⊙O的直径，C、D是⊙O上的两点（在直径AB的同一侧），且 BC⌒ =CD⌒  ，弦AC、BD相交于点P，如果∠APB=110°，求∠ABD的度数。</p>
                        <p><img src="public/images/img/143.png"/></p>
                        <div className="exercise2_main_sites">
                            <Button type="dashed" size="small" onClick={()=>{this.two_answer("sites")}}>考点</Button>
                            <Button type="dashed" size="small" onClick={()=>{this.two_answer("answer")}}>答案</Button>
                            <Button type="dashed" size="small" onClick={()=>{this.two_answer("jiexi")}}>解析</Button>
                            <Button type="dashed" size="small" onClick={()=>{this.closeContent()}}>收起</Button>
                        </div>
                    </div>
                    <div className={this.state.two_answer_content?"exercise2_help":"displaynone"}>
                        {this._two_answerContent(this.state.two_answer_flag)}
                    </div>
                </div>
                <div className="exercise2-border">
                    <div className="exercise2_main_content">
                        <p>（2）、 如图，已知AB为⊙O的直径，过⊙O上的点C的切线交AB的延长线于点E，AD⊥EC于点D且交⊙O于点F，连接BC，CF，AC。</p>
                        <p><img src="public/images/img/145.png"/></p>
                        <p>1）求证：BC=CF；</p>
                        <p>2）若∠ABC=60°，CD=3 ，求⊙O 的半径长；</p>
                        <p>3）在2）的条件下，求BE的长。</p>
                        <div className="exercise2_main_sites">
                            <Button type="dashed" size="small">考点</Button>
                            <Button type="dashed" size="small">答案</Button>
                            <Button type="dashed" size="small">解析</Button>
                            <Button type="dashed" size="small">收起</Button>
                        </div>
                    </div>
                </div>
                <div className="exercise2-border">
                    <div className="exercise2_main_content">
                        <p>（3）、如图AB是⊙O的直径，点C为⊙O上一点，AE和过点C的切线互相垂直，垂足为E，AE交⊙O于点D，直线EC交AB的延长线于点P，连接AC，BC，PC=2PB。</p>
                        <p><img src="public/images/img/146.png"/></p>
                        <p>1）探究线段PB，AB之间的数量关系，并说明理由；</p>
                        <p>2）若AD = 3，求AB长。</p>
                        <div className="exercise2_main_sites">
                            <Button type="dashed" size="small">考点</Button>
                            <Button type="dashed" size="small">答案</Button>
                            <Button type="dashed" size="small">解析</Button>
                            <Button type="dashed" size="small">收起</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    _exercise2Qtxt(){
        return (
            <div className="exercise2">
                <div className="exercise2-border">
                    <div className="exercise2_main_content">
                        <p>（1）、如图，AB是⊙O的直径，C是AD的中点，⊙O的切线BD交AC的延长线于点D，E是OB上一点，CE的延长线交DB的延长线于点F，AF交⊙O于点H，连接BH。</p>
                        <p><img src="public/images/img/149.png"/></p>
                        <div className="exercise2_main_sites">
                            <Button type="dashed" size="small" onClick={()=>{this.two_answer2("sites")}}>考点</Button>
                            <Button type="dashed" size="small" onClick={()=>{this.two_answer2("answer")}}>答案</Button>
                            <Button type="dashed" size="small" onClick={()=>{this.two_answer2("jiexi")}}>解析</Button>
                            <Button type="dashed" size="small" onClick={()=>{this.closeContent()}}>收起</Button>
                        </div>
                    </div>
                    <div className={this.state.two_answer2_content?"exercise2_help":"displaynone"}>
                        {this._two_answer2Content(this.state.two_answer2_flag)}
                    </div>
                </div>
                <div className="exercise2-border">
                    <div className="exercise2_main_content">
                        <p>（2）、 如图，已知AB为⊙O的直径，过⊙O上的点C的切线交AB的延长线于点E，AD⊥EC于点D且交⊙O于点F，连接BC，CF，AC。</p>
                        <p><img src="public/images/img/145.png"/></p>
                        <p>1）求证：BC=CF；</p>
                        <p>2）若∠ABC=60°，CD=3 ，求⊙O 的半径长；</p>
                        <p>3）在2）的条件下，求BE的长。</p>
                        <div className="exercise2_main_sites">
                            <Button type="dashed" size="small">考点</Button>
                            <Button type="dashed" size="small">答案</Button>
                            <Button type="dashed" size="small">解析</Button>
                            <Button type="dashed" size="small">收起</Button>
                        </div>
                    </div>
                </div>
                <div className="exercise2-border">
                    <div className="exercise2_main_content">
                        <p>（3）、如图AB是⊙O的直径，点C为⊙O上一点，AE和过点C的切线互相垂直，垂足为E，AE交⊙O于点D，直线EC交AB的延长线于点P，连接AC，BC，PC=2PB。</p>
                        <p><img src="public/images/img/146.png"/></p>
                        <p>1）探究线段PB，AB之间的数量关系，并说明理由；</p>
                        <p>2）若AD = 3，求AB长。</p>
                        <div className="exercise2_main_sites">
                            <Button type="dashed" size="small">考点</Button>
                            <Button type="dashed" size="small">答案</Button>
                            <Button type="dashed" size="small">解析</Button>
                            <Button type="dashed" size="small">收起</Button>
                        </div>
                    </div>
                </div>
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
                    </div>
                    <section className="QtxtContent2">
                        <div className="QtxtContent2_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt()}
                            </div>
                            <div className="shitifenxi">试题分析</div>
                            <div id="Analysis_Qtxt">
                                <div className="content_three">
                                    <div className="content_three_right">
                                        <div className="btnContainer" id="btnContainer">
                                            <Button id="Explain_exer" size="small" type="button">
                                                <MaskAlter title="观察想法"></MaskAlter>
                                            </Button>
                                            <Button id="Explain_exer" size="small" type="button">
                                                <MaskAlter title="考点温习"></MaskAlter>
                                            </Button>
                                            <Button id="Exercise1_exer" size="small" type="button">
                                                <MaskAlter title="提示分析"></MaskAlter>
                                            </Button>
                                            <Button id="Exercise2_exer" size="small" type="button">
                                                <MaskAlter title="标准答案"></MaskAlter>
                                            </Button>
                                        </div>
                                        {this._analysisQtxt()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="Exercise1_Qtxt">
                            <div className="content_three_right">
                                <div className="shitifenxi">【巩固练习】</div>
                                {this._exercise1Qtxt()}
                            </div>
                            <div style={{clear:"both"}}></div>
                        </div>
                        <div id="Exercise2_Qtxt">
                            <div className="content_three_right">
                                <div className="shitifenxi">【拓展练习】</div>
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
