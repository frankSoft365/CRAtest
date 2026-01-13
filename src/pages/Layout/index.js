import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    HomeOutlined,
    AppstoreOutlined,
    SettingOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
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
// Map menu keys to route paths
const keyToPath = {
    '1': '/',
    '2': '/clazzManagement',
    '3': '',
    '4': '/deptManagement',
    '5': '/empManagement',
    '6': '/empInfoStats',
    '7': '',
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
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    // Find the menu key for the current path
    const currentPath = location.pathname;
    const selectedKey = pathToKey[currentPath] ? [pathToKey[currentPath]] : [];

    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <span>Tlias智能学习辅助系统</span>
                <span>
                    <span>退出登录</span>
                    <span>[宋江]</span>
                </span>
            </Header>
            <Layout>
                <Sider width="17%" style={siderStyle} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                    <Menu
                        theme="dark"
                        selectedKeys={selectedKey}
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