/**
 * Created by gaoju on 2017/12/12.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import PureRenderMixin from '../../../../method_public/pure-render'
import {handleImg,exchangeGrade} from '../../../../method_public/public'
import {getUserBasicInfo, updateUserInfo} from '../../../../redux/actions/user'
import './style.css'
import {Form, Select,Radio,Input, Button, Upload, Icon,Layout,DatePicker} from 'antd';
import {  } from 'antd';


const {Sider, Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class BasicInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            userid:'',
        };
    }
    componentWillReceiveProps(self, nextProps, nextState){
        console.log('hello world componentWillReceiveProps');
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        let username = window.sessionStorage.getItem('username')
        this.props.actions.getUserBasicInfo({body:{params:username}})
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values.birthday:', values.birthday);
                values.birthday = values['birthday'].format('YYYY-MM-DD');//格式化日期
                console.log('Received values of form: ', values);
                this.props.actions.updateUserInfo({
                    body:values,
                    success:(data)=>{
                        console.log(data)
                        alert("修改成功！")
                    },
                    error: (mes)=>{
                        console.error("修改出错",mes)
                    }
                })
            }
        });
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    render(){
        let { basicInfo } = this.props;
        let error = PureRenderMixin.Compare([basicInfo]);//优化render
        if (error) return error
        let items = (basicInfo.get('items')).get(0)
        let date_birthday = moment(items.get('birthday'))//moment对象用来格式化时间
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        return (
            <div className="basic_All_css">
                <Layout>
                    <Content style={{backgroundColor:"white"}}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem style={{visibility:"hidden"}}
                                {...formItemLayout}>
                                {getFieldDecorator('userid', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('userid'),
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="昵称"
                                extra="修改昵称是需要唯一，请先绑定手机号">
                                {getFieldDecorator('username', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('username'),
                                })(
                                    <Input placeholder="Please input your username" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="手机号" >
                                {getFieldDecorator('phone', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('phone'),
                                })(
                                    <Input placeholder="Please input your phone" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="真实姓名">
                                {getFieldDecorator('actualname', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('actualname')
                                })(
                                    <Input placeholder="Please input your name" />
                                )}
                            </FormItem>
                            <FormItem{...formItemLayout} label="性别">
                                {getFieldDecorator('sex',{
                                    initialValue:'男'
                                })(
                                    <RadioGroup>
                                        <Radio value="男">男</Radio>
                                        <Radio value="女">女</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="所在学校">
                                {getFieldDecorator('school', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('school')
                                })(
                                    <Input placeholder="Please input your name" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="年级">
                                {getFieldDecorator('grade', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('grade')
                                })(
                                    <Select style={{ width: 200 }}>
                                    <Option value="">请选择</Option>
                                    <Option value="1">小学一年级</Option>
                                    <Option value="2">小学二年级</Option>
                                    <Option value="3">小学三年级</Option>
                                    <Option value="4">小学四年级</Option>
                                    <Option value="5">小学五年级</Option>
                                    <Option value="6">小学六年级</Option>
                                    <Option value="7">初中一年级</Option>
                                    <Option value="8">初中二年级</Option>
                                    <Option value="9">初中三年级</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="现居住地">
                                {getFieldDecorator('familyaddress', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('familyaddress')
                                })(
                                    <Input placeholder="Please input your name" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="邮箱">
                                {getFieldDecorator('email', {
                                    rules: [{ required: false}],
                                    initialValue:items.get('email')
                                })(
                                    <Input placeholder="Please input your name" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="生日">
                                {getFieldDecorator('birthday',{
                                    rules: [{type: 'object', required: false}],
                                    initialValue:date_birthday
                                })(
                                    <DatePicker style={{ width: '100%' }} />
                                )}
                            </FormItem>
                            <FormItem wrapperCol={{ span: 6, offset: 9 }}>
                                <Button type="primary" htmlType="submit">修改提交</Button>
                            </FormItem>
                        </Form>
                    </Content>
                    <Sider style={{backgroundColor: "white"}}>
                        <div className="user_head">
                            <img src={handleImg(items.get('headimg'))} alt="头像"/>
                            <span>头像...更55改</span>
                        </div>
                    </Sider>
                </Layout>
            </div>
        )
    }
}
const Basic = Form.create()(BasicInfo);
function mapStateToProps(state) {
    return {
        basicInfo:state.basicInfo || [],
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getUserBasicInfo,updateUserInfo}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Basic)
