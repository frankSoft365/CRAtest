import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Flex, Form, Modal, DatePicker, Select, message } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
    defaultFetchList,
    deleteStuByIds,
    addStudent,
    updateStudent,
    getQueryReturnById,
    setQueryReturn,
    setResult,
    violationAction,
} from '@/store/modules/student';
import { getAllClazz } from '@/store/modules/clazz';
import {
    ProFormText,
    QueryFilter,
    ProFormSelect
} from '@ant-design/pro-components';
import isNonNullable from '@/utils/isNonNullable';

const StudentManagement = () => {
    const { rows, total, queryReturn, result } = useSelector(state => state.student);
    const { allClazz } = useSelector(state => state.clazz);
    const dispatch = useDispatch();
    // 删除、修改、违纪处理时选中学员的id
    const [selectedId, setSelectedId] = useState(null);
    // 初始的表单参数
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    // 给每一行数据添加key
    const dataSource = rows.map(row => {
        return {
            ...row,
            key: row.id
        };
    });

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

    // 新增学员
    const [addForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const getFormParams = (params) => {  // 封装新增学员的参数
        const formParams = {};
        formParams.name = params.name;
        formParams.no = params.no;
        formParams.gender = params.gender;
        formParams.phone = params.phone;
        formParams.idCard = params.idCard;
        formParams.isCollege = params.isCollege;
        if (isNonNullable(params.address)) {
            formParams.address = params.address;
        }
        if (isNonNullable(params.degree)) {
            formParams.degree = params.degree;
        }
        if (isNonNullable(params.graduationDate)) {
            formParams.graduationDate = params.graduationDate.format('YYYY-MM-DD');
        }
        if (isNonNullable(params.clazzId)) {
            formParams.clazzId = params.clazzId;
        }
        return formParams;
    };
    // 点击新增学员后查询所有班级名字
    const onClickAddStudent = () => {
        setOpen(true);
        dispatch(getAllClazz());
    };
    // 点击确定后发送表单中新学员的所有数据
    const onCreate = values => {
        console.log(values);
        const newValues = getFormParams(values);
        console.log('新增学员的信息是：', newValues);
        dispatch(addStudent(newValues, getParams(tableParams)));
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
        setTableParams({
            ...tableParams,
            name: value?.name,
            degree: value?.degree,
            clazzId: value?.clazzId,
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
        const { pagination, name, degree, clazzId } = params;
        const result = {};
        result.page = pagination.current;
        result.pageSize = pagination.pageSize;
        if (isNonNullable(name)) {
            result.name = name;
        }
        if (isNonNullable(degree)) {
            result.degree = degree;
        }
        if (isNonNullable(clazzId)) {
            result.clazzId = clazzId;
        }
        return result;
    }, []);
    // 分页查询学员列表 默认 第一页 每页10条数据
    useEffect(() => {
        dispatch(defaultFetchList(getParams(tableParams)));
        dispatch(getAllClazz());
    }, [
        dispatch,
        getParams,
        tableParams,
    ]);
    // ------------------------------------------------------------

    // 删除学员
    // 批量删除
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isModalOpenBatchDel, setIsModalOpenBatchDel] = useState(false);
    const deleteBatch = () => {
        setDeleteLoading(true);
        dispatch(deleteStuByIds(selectedRowKeys, getParams(tableParams)));
        setIsModalOpenBatchDel(false);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setDeleteLoading(false);
        }, 500);
    };
    const handleCancelBatchDel = () => {
        setIsModalOpenBatchDel(false);
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
    // 删除学员确认框开合状态
    const [isModalOpenDel, setIsModalOpenDel] = useState(false);
    // 删除学员确认框
    const showModalDel = (id) => {
        setIsModalOpenDel(true);
        setSelectedId(id);
    };
    const handleOkDel = () => {
        setIsModalOpenDel(false);
        dispatch(deleteStuByIds([selectedId], getParams(tableParams)));
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
        // 获取最新所有班级列表
        dispatch(getAllClazz());
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
        console.log('更改后学员的信息是：', newValues);
        dispatch(updateStudent(newValues, getParams(tableParams)));
        setEditOpen(false);
        dispatch(setQueryReturn(null));
        setSelectedId(null);
    };
    const analyzeParams = useCallback((stu) => {
        if (stu === null) {
            return null;
        }
        const formParams = {};
        const name = stu.name;
        const no = stu.no;
        const gender = stu.gender;
        const phone = stu.phone;
        const idCard = stu.idCard;
        const isCollege = stu.isCollege;
        const address = stu.address;
        const degree = stu.degree;
        const graduationDate = stu.graduationDate;
        const clazzId = stu.clazzId;
        if (isNonNullable(name)) {
            formParams.name = name;
        };
        if (isNonNullable(no)) {
            formParams.no = no;
        };
        if (isNonNullable(gender)) {
            formParams.gender = gender;
        };
        if (isNonNullable(phone)) {
            formParams.phone = phone;
        };
        if (isNonNullable(idCard)) {
            formParams.idCard = idCard;
        };
        if (isNonNullable(isCollege)) {
            formParams.isCollege = isCollege;
        };
        if (isNonNullable(address)) {
            formParams.address = address;
        };
        if (isNonNullable(degree)) {
            formParams.degree = degree;
        };
        if (isNonNullable(graduationDate)) {
            formParams.graduationDate = dayjs(graduationDate);
        };
        if (isNonNullable(clazzId)) {
            formParams.clazzId = clazzId;
        };
        return formParams;
    }, []);
    useEffect(() => {
        if (editOpen && queryReturn) {
            editForm.setFieldsValue(analyzeParams(queryReturn));
        }
    }, [editOpen, editForm, queryReturn, analyzeParams]);
    // ------------------------------------------------------------

    // 违纪扣分
    // 扣分增量
    const [deltaViolationScore, setDeltaViolationScore] = useState(null);
    // 填写框打开与否状态
    const [isModalOpenViolation, setIsMadalOpenViolation] = useState(false);
    const showModalViolation = (id) => {
        setIsMadalOpenViolation(true);
        setSelectedId(id);
    };
    const handleCancelViolation = () => {
        setIsMadalOpenViolation(false);
        setSelectedId(null);
        setDeltaViolationScore(null);
    };
    const handleOkViolation = () => {
        // 将扣分数值传给后端
        dispatch(violationAction(selectedId, deltaViolationScore, getParams(tableParams)))
        setIsMadalOpenViolation(false);
        setSelectedId(null);
        setDeltaViolationScore(null);
    };
    // ------------------------------------------------------------

    //最高学历, 1: 初中, 2: 高中 , 3: 大专 , 4: 本科 , 5: 硕士 , 6: 博士
    const degreeOption = {
        1: '初中',
        2: '高中',
        3: '大专',
        4: '本科',
        5: '硕士',
        6: '博士'
    }
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '学号',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: '班级',
            dataIndex: 'clazzName',
            key: 'clazzName',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render: (_, record) => record.gender === 1 ? '男' : '女'
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '最高学历',
            dataIndex: 'degree',
            key: 'degree',
            render: (_, record) => degreeOption[record.degree]
        },
        {
            title: '违纪次数',
            dataIndex: 'violationCount',
            key: 'violationCount',
        },
        {
            title: '违纪扣分',
            dataIndex: 'violationScore',
            key: 'violationScore',
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
                        onClick={() => showModalViolation(record.id)}
                        style={{ color: 'goldenrod', cursor: 'pointer' }}
                    >
                        违纪
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
    // 获取所有班级选项
    const getClazzOption = (clazzList) => {
        return clazzList.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        });
    }
    // ------------------------------------------------------------

    return (
        <Card>
            <h2>学员管理</h2>
            {/* 全局异常处理提示message */}
            {contextHolder}
            {/* 条件查询的条件筛选面板 */}
            <QueryFilter defaultCollapsed={false} split span={6} onFinish={handleQuery} onReset={handleReset}>
                <ProFormText name="name" label="姓名" placeholder='请输入学生姓名' width='xs' />
                <ProFormSelect
                    placeholder='请选择'
                    width="xs"
                    options={[
                        { label: '初中', value: 1 },
                        { label: '高中', value: 2 },
                        { label: '大专', value: 3 },
                        { label: '本科', value: 4 },
                        { label: '硕士', value: 5 },
                        { label: '博士', value: 6 },
                    ]}
                    name="degree"
                    label="最高学历"
                />
                <ProFormSelect
                    placeholder='请选择'
                    width="sm"
                    options={getClazzOption(allClazz)}
                    name="clazzId"
                    label="所属班级"
                />
            </QueryFilter>
            {/* 单独删除学员确认框 */}
            <Modal
                title="删除员工"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpenDel}
                onOk={handleOkDel}
                onCancel={handleCancelDel}
            >
                <p>确认要删除该员工吗？</p>
            </Modal>
            {/* 批量删除学员确认框 */}
            <Modal
                title="删除员工"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpenBatchDel}
                onOk={deleteBatch}
                onCancel={handleCancelBatchDel}
            >
                <p>确认要删除该员工吗？</p>
            </Modal>
            {/* 更改学员的登记面板 */}
            <Modal
                open={editOpen}
                title="更改学员"
                okText="确定"
                cancelText="取消"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={handleCancelUpdateModal}
                modalRender={dom => (
                    <Form
                        layout="horizontal"
                        form={editForm}
                        name="form_in_modal_add"
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
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名!' }]}>
                        <Input placeholder='请输入学员姓名，2-10个字' maxLength={10} style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item
                        label="学号"
                        name="no"
                        rules={[{ required: true, message: '请输入学号!' }]}>
                        <Input placeholder='请输入10位学号' maxLength={10} style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item
                        label="性别"
                        name="gender"
                        rules={[{ required: true, message: '请输入性别!' }]}
                    >
                        <Select placeholder='请选择' options={[{ label: '男', value: 1 }, { label: '女', value: 2 }]} style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号!' },
                            { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号格式！' }
                        ]}>
                        <Input placeholder='请输入学员手机号' maxLength={11} style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                        label="身份证号"
                        name="idCard"
                        rules={[
                            { required: true, message: '请输入身份证号!' },
                            { pattern: /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/, message: '请输入正确的身份证号格式！' }
                        ]}>
                        <Input placeholder='请输入身份证号' maxLength={18} style={{ width: 250 }} />
                    </Form.Item>
                    {/* 是否来自院校 1 是 0 否 */}
                    <Form.Item
                        label="是否院校"
                        name="isCollege"
                        rules={[{ required: true, message: '请选择!' }]}
                    >
                        <Select style={{ width: 100 }} placeholder='请选择' options={[
                            { label: '是', value: 1 },
                            { label: '否', value: 0 }
                        ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="联系地址"
                        name="address"
                        rules={[]}>
                        <Input placeholder='请输入联系地址' maxLength={100} style={{ width: 500 }} />
                    </Form.Item>
                    <Form.Item
                        label="最高学历"
                        name="degree"
                        rules={[]}
                    >
                        <Select style={{ width: 100 }} placeholder='请选择' options={[
                            { label: '初中', value: 1 },
                            { label: '高中', value: 2 },
                            { label: '大专', value: 3 },
                            { label: '本科', value: 4 },
                            { label: '硕士', value: 5 },
                            { label: '博士', value: 6 },
                        ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="毕业时间"
                        name="graduationDate"
                        rules={[]}
                    >
                        <DatePicker placeholder='请选择毕业时间' style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                        label="所属班级"
                        name="clazzId"
                        rules={[]}
                    >
                        <Select style={{ width: 250 }} placeholder='请选择' options={getClazzOption(allClazz)}
                        />
                    </Form.Item>
                </Flex>
            </Modal>
            {/* 违纪扣分填写框 */}
            <Modal
                title="请输入违纪扣分"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpenViolation}
                onOk={handleOkViolation}
                onCancel={handleCancelViolation}
            >
                <Input value={deltaViolationScore} onChange={(e) => setDeltaViolationScore(e.target.value)} />
            </Modal>
            {/* 新增学员的登记面板 */}
            <Modal
                open={open}
                title="新增学员"
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
                        style={{ width: 850 }}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Flex wrap gap={'small'}>
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名!' }]}>
                        <Input placeholder='请输入学员姓名，2-10个字' maxLength={10} style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item
                        label="学号"
                        name="no"
                        rules={[{ required: true, message: '请输入学号!' }]}>
                        <Input placeholder='请输入10位学号' maxLength={10} style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item
                        label="性别"
                        name="gender"
                        rules={[{ required: true, message: '请输入性别!' }]}
                    >
                        <Select placeholder='请选择' options={[{ label: '男', value: 1 }, { label: '女', value: 2 }]} style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号!' },
                            { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号格式！' }
                        ]}>
                        <Input placeholder='请输入学员手机号' maxLength={11} style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                        label="身份证号"
                        name="idCard"
                        rules={[
                            { required: true, message: '请输入身份证号!' },
                            { pattern: /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/, message: '请输入正确的身份证号格式！' }
                        ]}>
                        <Input placeholder='请输入身份证号' maxLength={18} style={{ width: 250 }} />
                    </Form.Item>
                    {/* 是否来自院校 1 是 0 否 */}
                    <Form.Item
                        label="是否院校"
                        name="isCollege"
                        rules={[{ required: true, message: '请选择!' }]}
                    >
                        <Select style={{ width: 100 }} placeholder='请选择' options={[
                            { label: '是', value: 1 },
                            { label: '否', value: 0 }
                        ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="联系地址"
                        name="address"
                        rules={[]}>
                        <Input placeholder='请输入联系地址' maxLength={100} style={{ width: 500 }} />
                    </Form.Item>
                    <Form.Item
                        label="最高学历"
                        name="degree"
                        rules={[]}
                    >
                        <Select style={{ width: 100 }} placeholder='请选择' options={[
                            { label: '初中', value: 1 },
                            { label: '高中', value: 2 },
                            { label: '大专', value: 3 },
                            { label: '本科', value: 4 },
                            { label: '硕士', value: 5 },
                            { label: '博士', value: 6 },
                        ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="毕业时间"
                        name="graduationDate"
                        rules={[]}
                    >
                        <DatePicker placeholder='请选择毕业时间' style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                        label="所属班级"
                        name="clazzId"
                        rules={[]}
                    >
                        <Select style={{ width: 250 }} placeholder='请选择' options={getClazzOption(allClazz)}
                        />
                    </Form.Item>
                </Flex>
            </Modal>
            <Flex align="center" gap="middle">
                <Button onClick={onClickAddStudent}>新增学员</Button>
                <Button type="primary" onClick={() => setIsModalOpenBatchDel(true)} disabled={!hasSelected} loading={deleteLoading}>
                    批量删除
                </Button>
                {hasSelected ? `批量删除选中的 ${selectedRowKeys.length} 项` : null}
            </Flex>
            {/* 展示数据列表的表 */}
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
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

export default StudentManagement;