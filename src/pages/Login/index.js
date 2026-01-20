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
            message.success('登录成功');
            dispatch(setResult({ code: null, message: null })); // clear result
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