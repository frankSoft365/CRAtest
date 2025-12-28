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
    getItem('班级学员管理', '2', <AppstoreOutlined />),
    getItem('系统信息管理', 'sub1', <SettingOutlined />, [
        getItem('部门管理', '3'),
        getItem('员工管理', '4'),
    ]),
    getItem('数据统计管理', 'sub2', <BarChartOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
];
// Map menu keys to route paths
const keyToPath = {
    '1': '/',
    '2': '', // update this if you have a path for 班级学员管理
    '3': '/deptManagement',
    '4': '/empManagement', // update this if you have a path for 员工管理
    '6': '', // update this if you have a path for Team 1
    '8': '', // update this if you have a path for Team 2
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
    height: 96,
    paddingInline: 72,
    lineHeight: '96px',
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