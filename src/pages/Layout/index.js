import React from 'react';
import { Layout, Menu, Modal, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    HomeOutlined,
    AppstoreOutlined,
    SettingOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, clearUserInfo, clearResult } from '@/store/modules/user';
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('首页', '1', <HomeOutlined />),
    getItem('班级学员管理', 'sub1', <AppstoreOutlined />, [
        getItem('班级管理', '2'),
        getItem('学员管理', '3'),
    ]),
    getItem('系统信息管理', 'sub2', <SettingOutlined />, [
        getItem('部门管理', '4'),
        getItem('员工管理', '5'),
    ]),
    getItem('数据统计管理', 'sub3', <BarChartOutlined />, [
        getItem('员工信息统计', '6'),
        getItem('学员信息统计', '7')
    ]),
];

const keyToPath = {
    '1': '/',
    '2': '/clazzManagement',
    '3': '/studentManagement',
    '4': '/deptManagement',
    '5': '/empManagement',
    '6': '/empInfoStats',
    '7': '/stuInfoStats',
};

const keyToParent = {
    '2': 'sub1',
    '3': 'sub1',
    '4': 'sub2',
    '5': 'sub2',
    '6': 'sub3',
    '7': 'sub3',
};

// Map route paths to menu keys
const pathToKey = Object.entries(keyToPath).reduce((acc, [key, path]) => {
    if (path) acc[path] = key;
    return acc;
}, {});
const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
    overflow: 'auto'
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
};
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};
const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    height: '100%'
};

const LayoutPage = () => {
    const [isModalOpenExitLogin, setIsModalOpenExitLogin] = useState(false);
    const { userInfo, result } = useSelector(state => state.user);
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // Find the menu key for the current path
    const currentPath = location.pathname;
    const selectedKey = pathToKey[currentPath] ? [pathToKey[currentPath]] : [];

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);
    // Set openKeys to keep submenu open for selected item
    useEffect(() => {
        if (!collapsed && selectedKey.length > 0) {
            const parent = keyToParent[selectedKey[0]];
            if (parent) {
                setOpenKeys([parent]);
            } else {
                setOpenKeys([]);
            }
        }
    }, [currentPath, collapsed]);

    // When collapsed, close all submenus
    useEffect(() => {
        if (collapsed) {
            setOpenKeys([]);
        }
    }, [collapsed]);

    // 点击取消登录
    const handleClickExitLogin = () => {
        setIsModalOpenExitLogin(true);
    }
    // 点击取消退出登录
    const handleCancelExitLogin = () => {
        setIsModalOpenExitLogin(false);
    }
    // 确认退出登录
    const handleOkExitLogin = () => {
        // 删除token 用户信息
        dispatch(clearUserInfo());
        // 确认框关闭
        setIsModalOpenExitLogin(false);
        // 导航到登录页面
        navigate('/login');
    }

    // 异常全局处理
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (result.code !== null && result.message !== null) {
            messageApi.open({
                type: result.code === 1 ? 'success' : 'error',
                content: result.message,
                onClose: () => dispatch(clearResult()),
            });
        }
    }, [result, messageApi, dispatch]);

    return (
        <Layout style={layoutStyle}>
            <Modal
                title="退出登录"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpenExitLogin}
                onOk={handleOkExitLogin}
                onCancel={handleCancelExitLogin}
            >
                <p>确认要退出登录吗？</p>
            </Modal>
            {contextHolder}
            <Header style={headerStyle}>
                <span>Tlias智能学习辅助系统</span>
                <span>
                    <span onClick={handleClickExitLogin} style={{ cursor: 'pointer' }}>退出登录</span>
                    <span>[{userInfo.name ? userInfo.name : '未登录'}]</span>
                </span>
            </Header>
            <Layout>
                <Sider width="17%" style={siderStyle} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                    <Menu
                        theme="dark"
                        selectedKeys={selectedKey}
                        openKeys={openKeys}
                        onOpenChange={keys => setOpenKeys(keys)}
                        mode="inline"
                        items={items}
                        onClick={(e) => {
                            const path = keyToPath[e.key];
                            if (path) navigate(path);
                        }}
                    />
                </Sider>
                <Content style={contentStyle}>
                    <Outlet />
                </Content>
            </Layout>
            <Footer style={footerStyle}>Tlias智能学习辅助系统</Footer>
        </Layout>
    );
}
export default LayoutPage;