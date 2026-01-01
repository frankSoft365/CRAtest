import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, Flex, Form, Modal, InputNumber, DatePicker, Select, Upload, message } from 'antd';
import dayjs from 'dayjs';
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
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
    // 新增员工
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState();
    const [open, setOpen] = useState(false);
    const onCreate = values => {
        // Transform empExprs date to begin/end
        const newEmpExprs = values.empExprs?.map(item => ({
            ...item,
            begin: item.date?.[0].format('YYYY-MM-DD'),
            end: item.date?.[1].format('YYYY-MM-DD'),
        })) || [];
        const newValues = {
            ...values,
            empExprs: newEmpExprs.map(({ date, ...rest }) => rest), // remove 'date' key
        };
        console.log('新增员工的信息是：', newValues);
        setFormValues(newValues);
        setOpen(false);
    };

    // 头像上传
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    // 职位，1 班主任 2 讲师 3 学工主管 4 教研主管 5 咨询师
    const job = {
        1: '班主任',
        2: '讲师',
        3: '学工主管',
        4: '教研主管',
        5: '咨询师'
    }

    // 判断参数是否为null undefined
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

    // 列表的列
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

    // 分页
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

    // 条件查询
    const handleQuery = (value) => {
        console.log(value);

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
    }

    // 新增员工 出现表单 填写表单确认后 新增 再次获取列表
    const handleAddEmp = () => {

    }

    // 表单中的头像上传
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const beforeUpload = file => {  // 上传前检验
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG格式图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, url => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    return (
        <Card>
            <h2>员工管理</h2>
            <pre>{JSON.stringify(formValues, null, 2)}</pre>
            <QueryFilter defaultCollapsed={false} split span={6.5} onFinish={handleQuery} onReset={handleReset}>
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

            {/*<Modal
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
                <Button onClick={() => setOpen(true)}>新增员工</Button>
                <Button type="primary" disabled={!hasSelected}>
                    批量删除
                </Button>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
            </Flex>

            <Modal
                open={open}
                title="新增员工"
                okText="确定"
                cancelText="取消"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={() => setOpen(false)}
                destroyOnHidden
                modalRender={dom => (
                    <Form
                        layout="horisontal"
                        form={form}
                        name="form_in_modal"
                        initialValues={{ modifier: 'public' }}
                        clearOnDestroy
                        onFinish={values => onCreate(values)}
                        validateTrigger='onBlur'
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="姓名"
                    name="name"
                    rules={[{ required: true, message: '请输入姓名!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="性别"
                    name="gender"
                    rules={[{ required: true, message: '请输入性别!' }]}
                >
                    <Select options={[{ label: '男', value: '1' }, { label: '女', value: '2' }]} />
                </Form.Item>
                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[{ required: true, message: '请输入手机号!' }]}>
                    <Input />
                </Form.Item>
                {/* 职位，1 班主任 2 讲师 3 学工主管 4 教研主管 5 咨询师 */}
                <Form.Item
                    label="职位"
                    name="job"
                    rules={[]}
                >
                    <Select options={[
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
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="所属部门"
                    name="deptId"
                    rules={[]}
                >
                    <Select options={[
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
                    <DatePicker />
                </Form.Item>
                <Form.Item>
                    <Card size='small' style={{ width: 250, height: 100, fontSize: 10 }}>
                        <p>图片大小不超过2M</p>
                        <p>只能上传JPG、PNG图片</p>
                        <p>建议上传200*200或300*300尺寸的图片</p>
                    </Card>
                    {/* <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? (
                            <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                            uploadButton
                        )}
                    </Upload> */}
                </Form.Item>
                <Form.List name="empExprs">
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
            </Modal>
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