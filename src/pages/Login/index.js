import { Form, Input, Flex, Button, Checkbox, Card } from "antd";
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import logo from '@/assets/OIP.webp';
import './index.css'

export default function Login() {
    const onFinish = values => {
        console.log('Received values of form: ', values);
    };
    return (
        <div className="login">
            <Card className="login-container" >
                <img className="login-logo" src={logo} alt="" />
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                    validateTrigger='onBlur'
                >
                    <Form.Item
                        name="mobile"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your mobile!'
                            },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '请输入正确的手机号格式'
                            }
                        ]}
                    >
                        <Input prefix={<MobileOutlined />} placeholder="mobile" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!'
                            }
                        ]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="">Forgot password</a>
                        </Flex>
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Log in
                        </Button>
                        or <a href="">Register now!</a>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}