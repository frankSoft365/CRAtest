import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import logo from '@/assets/maple_leaf.jpg';
import './index.css'
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin, setResult } from "@/store/modules/user";
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react";

export default function Login() {
    const { result } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        dispatch(fetchLogin(values));
    };
    useEffect(() => {
        if (result.code === 1) {
            navigate('/');
        }
    }, [result, navigate, dispatch]);
    // 异常全局处理
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (result.code !== null && result.message !== null) {
            messageApi.open({
                type: result.code === 1 ? 'success' : 'error',
                content: result.message,
                onClose: () => dispatch(setResult({ code: null, message: null })),
            });
        }
    }, [result, messageApi, dispatch]);
    return (
        <div className="login">
            {contextHolder}
            <Card className="login-container" >
                <h1>Tlias智能学习辅助系统</h1>
                <Form
                    colon={false}
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                    validateTrigger='onBlur'
                >
                    <Form.Item
                        label='username'
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!'
                            }
                        ]}
                    >
                        <Input placeholder="username" />
                    </Form.Item>
                    <Form.Item
                        label='password'
                        name="password"
                        s
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!'
                            }
                        ]}
                    >
                        <Input type="password" placeholder="Password" />
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