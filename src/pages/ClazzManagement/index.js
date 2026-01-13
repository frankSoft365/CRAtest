import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Flex, Form, Modal, InputNumber, DatePicker, Select, Upload, message } from 'antd';
import dayjs from 'dayjs';
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    defaultFetchList,
    deleteEmpByIds,
    addClazz,
    updateEmp,
    getQueryReturnById,
    setQueryReturn,
    setResult
} from '@/store/modules/clazz';
import { getAllEmp } from '@/store/modules/emp';
import {
    ProFormDateRangePicker,
    ProFormText,
    QueryFilter,
    ProFormSelect
} from '@ant-design/pro-components';

const ClazzManagement = () => {
    const { rows, total, queryReturn, result } = useSelector(state => state.clazz);
    const { allEmp } = useSelector(state => state.emp);
    const dispatch = useDispatch();
    // 删除员工时选中的员工的id
    const [selectedId, setSelectedId] = useState(null);
    // 初始的表单参数
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    // 判断参数是否为null undefined
    const isNonNullable = val => {
        return val !== undefined && val !== null;
    };

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

    // 新增班级
    const [addForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const getFormParams = (params) => {  // 封装新增班级的参数
        const formParams = {};
        formParams.name = params.name;
        formParams.subject = params.subject;
        formParams.beginDate = params.beginDate.format('YYYY-MM-DD');
        formParams.endDate = params.endDate.format('YYYY-MM-DD');
        if (isNonNullable(params.room)) {
            formParams.room = params.room;
        }
        if (isNonNullable(params.masterId)) {
            formParams.masterId = params.masterId;
        }
        return formParams;
    };
    // 获取班主任选择项
    const getMasterOptions = (allEmp) => {
        return allEmp.map(item => {
            return {
                label: item.name,
                value: item.id,
            }
        })
    }
    // 点击新增员工后查询班主任名字
    const onClickAddClazz = () => {
        setOpen(true);
        dispatch(getAllEmp());
    };
    // 点击确定后发送表单中新员工的所有数据
    const onCreate = values => {
        const newValues = getFormParams(values);
        console.log('新增班级的信息是：', newValues);
        dispatch(addClazz(newValues, getParams(tableParams)));
        setOpen(false);
    };
    // ------------------------------------------------------------

    // 分页查询
    const handleTableChange = (pagination) => {
        setTableParams(prev => ({
            ...prev,
            pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize,
            }
        }));
    };
    // 条件查询
    const handleQuery = (value) => {
        console.log(`当前选择参数：name : ${value?.name},
             begin : ${value.contract?.createTime[0]}, 
             end : ${value.contract?.createTime[1]}`);
        setTableParams({
            ...tableParams,
            name: value?.name,
            begin: value.contract?.createTime[0],
            end: value.contract?.createTime[1]
        });
    };
    // 重置后，查询条件都没有了，即是普通的分页查询，页数都是默认值
    const handleReset = () => {
        setTableParams({
            pagination: {
                current: 1,
                pageSize: 10,
            },
        });
    };
    // 通过条件、分页参数封装的传给后端的数据
    const getParams = useCallback((params) => {
        const { pagination, name, begin, end } = params;
        const result = {};
        result.page = pagination.current;
        result.pageSize = pagination.pageSize;
        if (isNonNullable(name)) {
            result.name = name;
        }
        if (isNonNullable(begin)) {
            result.begin = begin;
        }
        if (isNonNullable(end)) {
            result.end = end;
        }
        return result;
    }, []);
    // 分页查询员工列表 默认 第一页 每页10条数据
    useEffect(() => {
        dispatch(defaultFetchList(getParams(tableParams)));
    }, [
        dispatch,
        getParams,
        tableParams,
    ]);
    // ------------------------------------------------------------

    // 删除员工
    // 批量删除员工
    const [deleteLoading, setDeleteLoading] = useState(false);
    const deleteBatch = () => {
        setDeleteLoading(true);
        // ajax request after empty completing
        dispatch(deleteEmpByIds({ ids: selectedRowKeys }, getParams(tableParams)));
        setTimeout(() => {
            setSelectedRowKeys([]);
            setDeleteLoading(false);
        }, 500);
    };
    const onSelectChange = newSelectedRowKeys => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true,
    };
    const hasSelected = selectedRowKeys.length > 0;
    // 删除员工确认框开合状态
    const [isModalOpenDel, setIsModalOpenDel] = useState(false);
    // 删除员工确认框
    const showModalDel = (id) => {
        setIsModalOpenDel(true);
        setSelectedId(id);
    };
    const handleOkDel = () => {
        setIsModalOpenDel(false);
        dispatch(deleteEmpByIds({ ids: selectedId }, getParams(tableParams)));
        setSelectedId(null);
        setSelectedRowKeys([]);
    };
    const handleCancelDel = () => {
        setIsModalOpenDel(false);
        setSelectedId(null);
    };
    // ------------------------------------------------------------

    // 更改员工信息
    // 查询回显
    const [editForm] = Form.useForm();
    const [editOpen, setEditOpen] = useState(false);
    const handleUpdateClick = (id) => {
        dispatch(getQueryReturnById(id));
        setEditOpen(true);
        setSelectedId(id);
    };
    const handleCancelUpdateModal = () => {
        setEditOpen(false);
        dispatch(setQueryReturn(null));
        setSelectedId(null);
    };
    const onUpdate = values => {
        const newValues = getFormParams(values);
        newValues.id = selectedId;
        console.log('更改后员工的信息是：', newValues);
        dispatch(updateEmp(newValues, getParams(tableParams)));
        setEditOpen(false);
        dispatch(setQueryReturn(null));
        setSelectedId(null);
    };
    const analyzeParams = useCallback((emp) => {
        if (emp === null) {
            return null;
        }
        const formParams = {};
        const username = emp.username;
        const name = emp.name;
        const gender = emp.gender;
        const phone = emp.phone;
        const job = emp.job;
        const salary = emp.salary;
        const deptId = emp.deptId;
        const entryTime = emp.entryTime;
        const empExprs = emp.exprList;
        if (isNonNullable(username)) {
            formParams.username = username;
        };
        if (isNonNullable(name)) {
            formParams.name = name;
        };
        if (isNonNullable(gender)) {
            formParams.gender = String(gender);
        };
        if (isNonNullable(phone)) {
            formParams.phone = phone;
        };
        if (isNonNullable(job)) {
            formParams.job = String(job);
        };
        if (isNonNullable(salary)) {
            formParams.salary = salary;
        };
        if (isNonNullable(deptId)) {
            formParams.deptId = String(deptId);
        };
        if (isNonNullable(entryTime)) {
            formParams.entryTime = dayjs(entryTime);
        };
        if (isNonNullable(empExprs)) {
            const newEmpExprs = empExprs.map((expr) => {
                return {
                    ...expr,
                    date: [dayjs(expr.begin), dayjs(expr.end)]
                };
            });
            formParams.empExprs = newEmpExprs;
        }
        return formParams;
    }, []);
    useEffect(() => {
        if (editOpen && queryReturn) {
            editForm.setFieldsValue(analyzeParams(queryReturn));
        }
    }, [editOpen, editForm, queryReturn, analyzeParams]);

    // 列表的表头
    const columns = [
        {
            title: '序号',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: '班级名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '班级教室',
            dataIndex: 'room',
            key: 'room',
        },
        {
            title: '班主任',
            dataIndex: 'masterName',
            key: 'masterName',
        },
        {
            title: '开课时间',
            dataIndex: 'beginDate',
            key: 'beginDate',
        },
        {
            title: '结课时间',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
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
                        onClick={() => handleUpdateClick(record.id)}
                        style={{ color: 'blue', cursor: 'pointer' }}
                    >
                        修改
                    </span>
                    <span
                        onClick={() => showModalDel(record.id)}
                        style={{ color: 'red', cursor: 'pointer' }}
                    >
                        删除
                    </span>
                </Space>
            ),
        },
    ];
    // ------------------------------------------------------------

    return (
        <Card>
            <h2>班级管理</h2>
            {/* 全局异常处理提示message */}
            {contextHolder}
            {/* 条件查询的条件筛选面板 */}
            <QueryFilter defaultCollapsed={false} split span={6.5} onFinish={handleQuery} onReset={handleReset}>
                <ProFormText name="name" label="班级名称" placeholder='请输入班级名称' />
                <ProFormDateRangePicker
                    placeholder={['开始时间', '结束时间']}
                    width="md"
                    name={['contract', 'createTime']}
                    label="结课时间"
                />
            </QueryFilter>
            {/* <Modal
                title="删除班级"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpenDel}
                onOk={handleOkDel}
                onCancel={handleCancelDel}
            >
                <p>确认要删除该班级吗？</p>
            </Modal> */}
            {/* 更改班级的登记面板 */}
            <Modal
                open={editOpen}
                title="更改员工"
                okText="确定"
                cancelText="取消"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={handleCancelUpdateModal}
                modalRender={dom => (
                    <Form
                        layout="horizontal"
                        form={editForm}
                        name="form_in_modal_edit"
                        onFinish={values => onUpdate(values)}
                        validateTrigger='onBlur'
                        style={{ width: 850 }}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Flex wrap gap={'small'}>
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input placeholder='请输入员工用户名，2-20个字' maxLength={20} style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名!' }]}>
                        <Input placeholder='请输入员工姓名，2-10个字' maxLength={10} style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item
                        label="性别"
                        name="gender"
                        rules={[{ required: true, message: '请输入性别!' }]}
                    >
                        <Select placeholder='请选择' options={[{ label: '男', value: '1' }, { label: '女', value: '2' }]} style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号!' },
                            { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号格式！' }
                        ]}>
                        <Input placeholder='请输入员工手机号' style={{ width: 150 }} />
                    </Form.Item>
                    {/* 职位，1 班主任 2 讲师 3 学工主管 4 教研主管 5 咨询师 */}
                    <Form.Item
                        label="职位"
                        name="job"
                        rules={[]}
                    >
                        <Select style={{ width: 100 }} placeholder='请选择' options={[
                            { label: '班主任', value: '1' },
                            { label: '讲师', value: '2' },
                            { label: '学工主管', value: '3' },
                            { label: '教研主管', value: '4' },
                            { label: '咨询师', value: '5' }
                        ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="薪资"
                        name="salary"
                        rules={[]}
                    >
                        <InputNumber placeholder='请输入员工薪资' style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                        label="所属部门"
                        name="deptId"
                        rules={[]}
                    >
                        <Select style={{ width: 100 }} placeholder='请选择' options={[
                            { label: '学工部', value: '1' },
                            { label: '教研部', value: '2' },
                            { label: '咨询部', value: '3' },
                            { label: '就业部', value: '4' },
                            { label: '人事部', value: '5' },
                            { label: '行政部', value: '6' }
                        ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="入职日期"
                        name="entryTime"
                        rules={[]}
                    >
                        <DatePicker placeholder='请选择入职日期' style={{ width: 150 }} />
                    </Form.Item>
                </Flex>
            </Modal>

            {/* 新增班级的登记面板 */}
            <Modal
                open={open}
                title="新增班级"
                okText="确定"
                cancelText="取消"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={() => {
                    setOpen(false);
                }}
                destroyOnHidden
                modalRender={dom => (
                    <Form
                        layout="horizontal"
                        form={addForm}
                        name="form_in_modal_add"
                        clearOnDestroy
                        onFinish={values => onCreate(values)}
                        validateTrigger='onBlur'
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    name="name"
                    label="班级名称"
                    rules={[{ required: true, message: '请输入班级名称！' }]}
                >
                    <Input placeholder='请输入班级名称，2-30个字' maxLength={30} style={{ width: 250 }} />
                </Form.Item>
                <Form.Item
                    label="班级教室"
                    name="room"
                >
                    <Input placeholder='请输入班级教室，2-20个字' maxLength={20} style={{ width: 250 }} />
                </Form.Item>
                <Form.Item
                    label="开课时间"
                    name="beginDate"
                    rules={[{ required: true, message: '请输入开课时间！' }]}
                >
                    <DatePicker placeholder='请选择开课时间' style={{ width: 150 }} />
                </Form.Item>
                <Form.Item
                    label="结课时间"
                    name="endDate"
                    rules={[{ required: true, message: '请输入结课时间！' }]}
                >
                    <DatePicker placeholder='请选择结课时间' style={{ width: 150 }} />
                </Form.Item>
                <Form.Item
                    label="班主任"
                    name="masterId"
                    rules={[]}
                >
                    <Select style={{ width: 100 }} placeholder='请选择' options={getMasterOptions(allEmp)}
                    />
                </Form.Item>
                <Form.Item
                    label="学科"
                    name="subject"
                    rules={[{ required: true, message: '请选择学科！' }]}
                >
                    <Select style={{ width: 100 }} placeholder='请选择' options={[
                        { label: 'Java', value: '1' },
                        { label: '前端', value: '2' },
                        { label: '大数据', value: '3' },
                        { label: 'Python', value: '4' },
                        { label: 'Go', value: '5' },
                        { label: '嵌入式', value: '6' }
                    ]}
                    />
                </Form.Item>
            </Modal>
            {/* 新增班级按钮 */}
            <Flex align="center" gap="middle">
                <Button onClick={onClickAddClazz}>新增班级</Button>
            </Flex>
            {/* 展示数据列表的表 */}
            <Table
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

export default ClazzManagement;