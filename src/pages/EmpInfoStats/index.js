import { Card, Flex } from "antd";
import { Column, Pie } from "@ant-design/charts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEmpJobData } from "@/store/modules/emp";

const EmpInfoStats = () => {
    const dispatch = useDispatch();
    // 获取统计数据
    const { empJobStats, empGenderStats } = useSelector(state => state.emp);
    useEffect(() => {
        dispatch(getEmpJobData());
    }, [dispatch]);
    const jobConfig = {
        data: empJobStats,
        xField: 'pos',
        yField: 'num',
        label: {
            textBaseline: 'bottom',
        },
        style: {
            stroke: 'black',
            strokeWidth: 2,
        },
    };
    const genderConfig = {
        data: [
            // empGenderStats
            { type: '男', value: 40 },
            { type: '女', value: 60 },
        ],
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };
    return (
        <Card>
            <h2>员工信息统计</h2>
            <Flex>
                <Card style={{ width: '50%' }}>
                    <Flex vertical>
                        <h3>员工职位统计</h3>
                        <Column {...jobConfig} />
                    </Flex>
                </Card>
                <Card style={{ width: '50%' }}>
                    <Flex vertical>
                        <h3>员工性别统计</h3>
                        <Pie {...genderConfig} />
                    </Flex>
                </Card>
            </Flex>
        </Card>
    );
}

export default EmpInfoStats;