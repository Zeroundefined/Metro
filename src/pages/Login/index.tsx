import * as React from 'react';
import { Form, Input, Icon, Button, message } from 'antd';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { actions } from './LoginRedux';
import { FormComponentProps } from 'antd/lib/form';
import './Login.scss';
const FormItem = Form.Item;

class Login extends React.Component<FormComponentProps & typeof actions> {
  handleSubmit = () => {
    const { form: {validateFields}, login} = this.props;
    validateFields((err, value) => {
      if(err) {
        return 
      }

      (login(value.userName, value.password) as any).then(data => {
        if(data.errMsg) {
          message.error(data.errMsg);
        } else {
          message.success("登录成功");
          browserHistory.push('/metaCenter');
        }
      })

    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return <div className="login">
      <div className="login-icon"/>
      <div className="login-title">通号大屏数据后台管理系统</div>
      <div className="login-form">
        <Form>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                { required: true, message: '请输入用户名' },
                { pattern: /\w+/, message: '请输入正确的用户名，允许数字，字母，下划线'}
              ],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入密码' },
                { pattern: /\w+/, message: '请输入正确的密码，允许数字，字母，下划线'}
              ],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
            )}
          </FormItem>
          <Button onClick={this.handleSubmit} type="primary">登录</Button>
        </Form>
      </div>
    </div>
  }
}

export default Form.create()(connect(null, actions)(Login))