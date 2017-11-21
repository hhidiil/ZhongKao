/**
 * Created by gaoju on 2017/11/16.
 */
import React ,{Component} from 'react'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {login, changePassword } from '../../redux/actions/user'

import { Form, Icon, Input, Button, Checkbox } from 'antd'
import './style.css'
const FormItem = Form.Item;
class NormalLoginForm extends Component {
    constructor(props) {
        super(props)
        const { getFieldDecorator, getFieldsError, getFieldError} = this.props.form
        this.state={
            checkPass:true
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.actions.login({
                    body: {
                        phone: values.userName,
                        password: values.password
                    },
                    success: (data) => {
                        console.log("login success:"+data)
                        this.props.actions.push('home')
                    },
                    error: (message) => {
                        this.props.form.setFields({
                            password: {
                                errors: [new Error(message)]
                            }
                        });

                    }
                })
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        return (
            <Form onSubmit={this.handleSubmit} className="login-form margin-auto">
                <FormItem {...formItemLayout} label="用户名">
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入用户名!' }]
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="密码">
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true,
                            message: '请输入密码!'
                        }]
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                    )}
                </FormItem>
                <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <a className="login-form-forgot" href="#">忘记密码</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登 录
                    </Button>
                    <a href="#">立即注册!</a>
                </FormItem>
            </Form>
        );
    }

}
const Login = Form.create()(NormalLoginForm);
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ push, login, changePassword }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
