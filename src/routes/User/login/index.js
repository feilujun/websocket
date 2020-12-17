import React, { PureComponent } from 'react'
import { Form, Icon, Input, Button, Card } from 'antd';
import styles from "./index.module.less"
import { connect } from 'dva';

@Form.create()
@connect(({ loading }) => {
    return {
        loading: !!loading.effects['login/login']
    }
})
class Index extends PureComponent {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "login/login",
                    payload: values
                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.props
        return (
            <div style={{overflow:"hidden"}}>
                <Card className={styles.login}>
                    <div className={styles.title}>欢迎登陆</div>
                    <Form onSubmit={this.handleSubmit} className={styles["form-content"] + " qd-form-bttom-15"}>
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <div className={styles["code-input"]}>
                                {getFieldDecorator('code', {
                                })(
                                    <Input
                                        prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="验证码"
                                    />,
                                )}
                            </div>
                            <img className={styles["code"]} src="https://picsum.photos/65/32" ></img>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" loading={loading} htmlType="submit" block>
                                登录
                                </Button>
                        </Form.Item>
                    </Form>
                </Card>

            </div>

        )
    }
}

export default Index
