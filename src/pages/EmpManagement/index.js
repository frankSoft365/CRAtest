import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Flex } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList, deleteDeptById, addDept, updateDept, getDeptNameById } from '@/store/modules/dept';
import {
    ProFormDateRangePicker,
    ProFormText,
    QueryFilter,
    ProFormSelect
} from '@ant-design/pro-components';

const EmpManagement = () => {

    const { dataSource } = useSelector(state => state.emp);
    const dispatch = useDispatch();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const onSelectChange = newSelectedRowKeys => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '头像',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: '所属部门',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '职位',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '入职日期',
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
                            // dispatch(getDeptNameById(record.id));
                            // showModal2();
                            // setSelectedId(record.id);
                        }}
                        style={{ color: 'blue', cursor: 'pointer' }}
                    >
                        修改
                    </span>
                    <span
                        onClick={() => {
                            // showModal3();
                            // setSelectedId(record.id);
                        }}
                        style={{ color: 'red', cursor: 'pointer' }}
                    >
                        删除
                    </span>
                </Space>
            ),
        },
    ];



    const handleTableChange = (pagination, filters, sorter) => {
        // 前端向后端传递page, pageSize, name, gender, entry_date
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
        // `dataSource` is useless since `pageSize` changed
        // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        //     setData([]);
        // }
    };

    return (
        <Card>
            <p>员工管理</p>
            <QueryFilter defaultCollapsed={false} split>
                <ProFormText name="name" label="姓名" />
                <ProFormSelect
                    width="xs"
                    options={[
                        {
                            value: '1',
                            label: '男',
                        },
                        {
                            value: '2',
                            label: '女',
                        },
                    ]}
                    name="gender"
                    label="性别"
                />
                <ProFormDateRangePicker
                    width="md"
                    name={['contract', 'createTime']}
                    label="入职时间"
                />
            </QueryFilter>

            {/* <Modal
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
            </Modal> */}
            <Flex align="center" gap="middle">
                <Button>新增员工</Button>
                <Button type="primary" disabled={!hasSelected}>
                    批量删除
                </Button>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
            </Flex>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </Card>
    );
}

export default EmpManagement;