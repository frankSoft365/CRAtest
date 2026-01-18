import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList, deleteDeptById, addDept, updateDept, getDeptNameById, setResult } from '@/store/modules/dept';

const DeptManagement = () => {
    const { list, queryReturn, result } = useSelector(state => state.dept);
    // 新增部门确认框开合状态
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 修改部门确认框开合状态
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    // 删除部门确认框开合状态
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const [deptName, setDeptName] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchList());
    }, [dispatch]);

    useEffect(() => {
        if (queryReturn !== null) {
            setDeptName(queryReturn.name);
        }
    }, [queryReturn]);

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

    // 新增部门的确认框
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        console.log('deptName : ' + deptName);
        dispatch(addDept({ name: deptName }));
        setDeptName('');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setDeptName('');
    };

    // 更改部门名称的确认框
    const showModal2 = () => {
        setIsModalOpen2(true);
    }
    const handleOk2 = () => {
        setIsModalOpen2(false);
        console.log('changedId : ' + selectedId + ' deptName : ' + deptName);
        dispatch(updateDept({ id: selectedId, name: deptName }));
        setDeptName('');
        setSelectedId(null);
    };
    const handleCancel2 = () => {
        setIsModalOpen2(false);
        setDeptName('');
        setSelectedId(null);
    };

    // 删除部门确认框
    const showModal3 = () => {
        setIsModalOpen3(true);
    };
    const handleOk3 = () => {
        setIsModalOpen3(false);
        dispatch(deleteDeptById(selectedId));
        setSelectedId(null);
    };
    const handleCancel3 = () => {
        setIsModalOpen3(false);
        setSelectedId(null);
    };

    const columns = [
        {
            title: '序号',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: '部门名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '最后修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (_, record) => dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <span
                        onClick={() => {
                            dispatch(getDeptNameById(record.id));
                            showModal2();
                            setSelectedId(record.id);
                        }}
                        style={{ color: 'blue', cursor: 'pointer' }}
                    >
                        修改
                    </span>
                    <span
                        onClick={() => {
                            showModal3();
                            setSelectedId(record.id);
                        }}
                        style={{ color: 'red', cursor: 'pointer' }}
                    >
                        删除
                    </span>
                </Space>
            ),
        },
    ];

    // Ensure each row has a unique key (use id if available, otherwise index)
    const dataWithKey = list && Array.isArray(list)
        ? list.map((item, idx) => ({
            ...item,
            key: item.id !== undefined ? item.id : idx
        }))
        : [];

    return (
        <Card>
            <h2>部门管理</h2>
            {/* 全局异常处理提示message */}
            {contextHolder}
            <Button onClick={showModal}>新增部门</Button>
            <Modal
                title="新增部门"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input value={deptName} onChange={(e) => setDeptName(e.target.value)} />
            </Modal>
            <Modal
                title="修改部门"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen2}
                onOk={handleOk2}
                onCancel={handleCancel2}
            >
                <Input value={deptName} onChange={(e) => setDeptName(e.target.value)} />
            </Modal>
            <Modal
                title="删除部门"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen3}
                onOk={handleOk3}
                onCancel={handleCancel3}
            >
                <p>确认要删除该部门吗？</p>
            </Modal>
            <Table columns={columns} dataSource={dataWithKey} pagination={false} />
        </Card>
    );
}

export default DeptManagement;