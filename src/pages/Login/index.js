import { Form, Input, Button, Card } from "antd";
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import logo from '@/assets/OIP.webp';
import './index.css'
import { useDispatch } from "react-redux";
import { fetchLogin } from "@/store/modules/user";

export default function Login() {
    const dispatch = useDispatch();
    const onFinish = values => {
        console.log('Received values of form: ', values);
        dispatch(fetchLogin(values));
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
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!'
                            }
                        ]}
                    >
                        <Input prefix={<MobileOutlined />} placeholder="username" />
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