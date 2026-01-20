import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Flex, Form, Modal, InputNumber, DatePicker, Select, Upload, message } from 'antd';
import dayjs from 'dayjs';
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    defaultFetchList,
    deleteEmpByIds,
    addEmp,
    updateEmp,
    getQueryReturnById,
    setQueryReturn,
    setResult
} from '@/store/modules/emp';
import {
    ProFormDateRangePicker,
    ProFormText,
    QueryFilter,
    ProFormSelect
} from '@ant-design/pro-components';
import { isNonNullable } from '@/utils';

const EmpManagement = () => {
    const { rows, total, queryReturn, result } = useSelector(state => state.emp);
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

    // 新增员工
    // 表单中的头像上传
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    // 头像的url 是OSS的URL
    const [imageUrl, setImageUrl] = useState();
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const beforeUpload = file => {  // 上传前检验
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            messageApi.error('只能上传JPG/PNG格式图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            messageApi.error('图片大小不能超过2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {imageUploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setImageUploadLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, () => {
                setImageUploadLoading(false);
                setImageUrl(info.file.response.data);
            });
        }
    };
    const [addForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const getFormParams = (params) => {  // 封装新增员工的参数
        const formParams = {};
        formParams.username = params.username;
        formParams.name = params.name;
        formParams.gender = params.gender;
        formParams.phone = params.phone;
        if (isNonNullable(params.job)) {
            formParams.job = params.job;
        }
        if (isNonNullable(params.salary)) {
            formParams.salary = params.salary;
        }
        if (isNonNullable(params.deptId)) {
            formParams.deptId = params.deptId;
        }
        if (isNonNullable(params.entryTime)) {
            formParams.entryTime = params.entryTime.format('YYYY-MM-DD');
        }
        // 头像的url封装 字段名image
        if (isNonNullable(imageUrl)) {
            formParams.image = imageUrl;
        }
        if (isNonNullable(params.empExprs)) {
            const newEmpExprs = params.empExprs.map(item => ({
                ...item,
                begin: item.date[0].format('YYYY-MM-DD'),
                end: item.date[1].format('YYYY-MM-DD'),
            }));
            const resultEmpExprs = newEmpExprs.map(({ date, ...rest }) => rest)
            formParams.exprList = resultEmpExprs;
        } else {
            formParams.exprList = [];
        }
        return formParams;
    };
    // 点击确定后发送表单中新员工的所有数据
    const onCreate = values => {
        console.log(values);
        const newValues = getFormParams(values);
        console.log('新增员工的信息是：', newValues);
        dispatch(addEmp(newValues, getParams(tableParams)));
        setOpen(false);
        setImageUrl(null);
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
        setImageUrl(null);
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
            if (queryReturn.image) {
                setImageUrl(queryReturn.image);
            } else {
                setImageUrl(null);
            }
        }
    }, [editOpen, editForm, queryReturn, analyzeParams]);

    // 列表的列
    // 根据index显示对应的职位，1 班主任 2 讲师 3 学工主管 4 教研主管 5 咨询师
    const job = {
        1: '班主任',
        2: '讲师',
        3: '学工主管',
        4: '教研主管',
        5: '咨询师'
    }
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
            render: (_, record) => <img src={record.image} alt="avatar" style={{ width: 40 }} />
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
            <h2>员工管理</h2>
            {/* 全局异常处理提示message */}
            {contextHolder}
            {/* 条件查询的条件筛选面板 */}
            <QueryFilter defaultCollapsed={false} split span={6.5} onFinish={handleQuery} onReset={handleReset}>
                <ProFormText name="name" label="姓名" placeholder='请输入员工姓名' />
                <ProFormSelect
                    placeholder='请选择'
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
                    placeholder={['开始日期', '结束日期']}
                    width="md"
                    name={['contract', 'createTime']}
                    label="入职时间"
                />
            </QueryFilter>
            <Modal
                title="删除员工"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpenDel}
                onOk={handleOkDel}
                onCancel={handleCancelDel}
            >
                <p>确认要删除该员工吗？</p>
            </Modal>
            {/* 更改员工的登记面板 */}
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
                <Form.Item label='头像' layout='horizontal'>
                    <Flex gap={'small'}>
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="http://localhost:8080/upload"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                        <Card size='small' style={{ width: 250, height: 125, fontSize: 12 }}>
                            <p>图片大小不超过2M</p>
                            <p>只能上传JPG、PNG图片</p>
                            <p>建议上传200*200或300*300尺寸的图片</p>
                        </Card>
                    </Flex>
                </Form.Item>
                <Form.Item label='工作经历'>
                    <Form.List name="empExprs" label='工作经历'>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            label="时间"
                                            name={[name, 'date']}
                                            rules={[{ required: true, message: '填写公司！' }]}
                                        >
                                            <DatePicker.RangePicker
                                                placeholder={['开始日期', '结束日期']}
                                                width="md"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            label="公司"
                                            name={[name, 'company']}
                                            rules={[{ required: true, message: '填写公司！' }]}
                                        >
                                            <Input placeholder="请输入公司的名字" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            label="职位"
                                            name={[name, 'job']}
                                            rules={[{ required: true, message: '填写职位！' }]}
                                        >
                                            <Input placeholder="请输入职位" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加工作经历
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
            </Modal>

            {/* 新增员工的登记面板 */}
            <Modal
                open={open}
                title="新增员工"
                okText="确定"
                cancelText="取消"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={() => {
                    setOpen(false);
                    setImageUrl(null);
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


                <Form.Item label='头像' layout='horizontal'>
                    <Flex gap={'small'}>
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="http://localhost:8080/upload"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                        <Card size='small' style={{ width: 250, height: 125, fontSize: 12 }}>
                            <p>图片大小不超过2M</p>
                            <p>只能上传JPG、PNG图片</p>
                            <p>建议上传200*200或300*300尺寸的图片</p>
                        </Card>
                    </Flex>
                </Form.Item>
                <Form.Item label='工作经历'>
                    <Form.List name="empExprs" label='工作经历'>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            label="时间"
                                            name={[name, 'date']}
                                            rules={[{ required: true, message: '填写公司！' }]}
                                        >
                                            <DatePicker.RangePicker
                                                placeholder={['开始日期', '结束日期']}
                                                width="md"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            label="公司"
                                            name={[name, 'company']}
                                            rules={[{ required: true, message: '填写公司！' }]}
                                        >
                                            <Input placeholder="请输入公司的名字" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            label="职位"
                                            name={[name, 'job']}
                                            rules={[{ required: true, message: '填写职位！' }]}
                                        >
                                            <Input placeholder="请输入职位" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加工作经历
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
            </Modal>
            <Flex align="center" gap="middle">
                <Button onClick={() => setOpen(true)}>新增员工</Button>
                <Button type="primary" onClick={deleteBatch} disabled={!hasSelected} loading={deleteLoading}>
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

export default EmpManagement;