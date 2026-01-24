import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table, message } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
    defaultFetchList,
    removeResult,
} from '@/store/modules/logInfo';
export default function LogInfoStats() {
    // 状态
    const { rows, total, result } = useSelector(state => state.logInfo);
    const dispatch = useDispatch();
    // 初始的表单参数
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
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
    // 通过分页参数封装的传给后端的数据
    const getParams = useCallback((params) => {
        const { pagination } = params;
        const result = {};
        result.page = pagination.current;
        result.pageSize = pagination.pageSize;
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
    // 列表的表头
    const columns = [
        {
            title: '序号',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: '操作人',
            dataIndex: 'operateEmpName',
            key: 'operateEmpName',
        },
        {
            title: 'className',
            dataIndex: 'className',
            key: 'className',
        },
        {
            title: 'methodName',
            dataIndex: 'methodName',
            key: 'methodName',
        },
        {
            title: 'methodParams',
            dataIndex: 'methodParams',
            key: 'methodParams',
        },
        {
            title: 'returnValue',
            dataIndex: 'returnValue',
            key: 'returnValue',
        },
        {
            title: 'costTime',
            dataIndex: 'costTime',
            key: 'costTime',
        },
        {
            title: '操作时间',
            dataIndex: 'operateTime',
            key: 'operateTime',
            render: (_, record) => dayjs(record.operateTime).format('YYYY-MM-DD HH:mm:ss')
        },
    ];
    // 异常全局处理
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (result.code !== null && result.message !== null) {
            messageApi.open({
                type: result.code === 1 ? 'success' : 'error',
                content: result.message,
                onClose: () => dispatch(removeResult()),
            });
        }
    }, [result, messageApi, dispatch]);
    return (
        <Card>
            <h2>日志信息统计</h2>
            {contextHolder}
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