import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Flex } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { defaultFetchList, deleteDeptById, addDept, updateDept, getDeptNameById } from '@/store/modules/emp';
import {
    ProFormDateRangePicker,
    ProFormText,
    QueryFilter,
    ProFormSelect
} from '@ant-design/pro-components';

const EmpManagement = () => {
    const { rows, total } = useSelector(state => state.emp);
    const dispatch = useDispatch();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    // 职位，1 班主任 2 讲师 3 学工主管 4 教研主管 5 咨询师
    const job = {
        1: '班主任',
        2: '讲师',
        3: '学工主管',
        4: '教研主管',
        5: '咨询师'
    }

    const isNonNullable = val => {
        return val !== undefined && val !== null;
    };

    const getParams = (params) => {
        const { pagination, name, gender, begin, end } = params;
        const result = {};
        result.page = pagination.current;
        result.pageSize = pagination.pageSize;
        if (isNonNullable(name)) {
            result.name = name;
        }
        if (isNonNullable(gender)) {
            result.gender = gender;
        }
        if (isNonNullable(begin)) {
            result.begin = begin;
        }
        if (isNonNullable(end)) {
            result.end = end;
        }
        return result;
    }

    // 分页查询员工列表 默认 第一页 每页10条数据
    useEffect(() => {
        // Fetch data with current pagination

        dispatch(defaultFetchList(getParams(tableParams)));
    }, [
        tableParams.pagination.current,
        tableParams.pagination.pageSize,
        tableParams?.name,
        tableParams?.gender,
        tableParams?.begin,
        tableParams?.end
    ]);

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
            render: (_, record) => record.gender === 1 ? '男' : '女'
        },
        {
            title: '头像',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: '所属部门',
            dataIndex: 'deptName',
            key: 'deptName',
        },
        {
            title: '职位',
            dataIndex: 'job',
            key: 'job',
            render: (_, record) => job[record.job]
        },
        {
            title: '入职日期',
            dataIndex: 'entryTime',
            key: 'entryTime',
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

    const handleTableChange = (pagination) => {
        console.log(`当前分页数据：当前页：${pagination.current}，每页数据数：${pagination.pageSize}`);
        setTableParams(prev => ({
            ...prev,
            pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize,
            }
        }));
    };

    const handleQuery = (value) => {
        console.log(`当前选择参数：name : ${value?.name},
             gender : ${value?.gender}, 
             begin : ${value.contract?.createTime[0]}, 
             end : ${value.contract?.createTime[1]}`);
        setTableParams({
            ...tableParams,
            name: value?.name,
            gender: value?.gender,
            begin: value.contract?.createTime[0],
            end: value.contract?.createTime[1]
        });
    };

    return (
        <Card>
            <h2>员工管理</h2>
            <QueryFilter defaultCollapsed={false} split span={6.5} onFinish={handleQuery}>
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
                dataSource={rows}
                pagination={{
                    ...tableParams.pagination,
                    total: total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: total => `共${total}条数据`,
                }}
                onChange={handleTableChange}
            />
        </Card>
    );
}

export default EmpManagement;