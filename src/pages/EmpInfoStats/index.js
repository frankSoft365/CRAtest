import { Card, Flex } from "antd";
import { Column } from "@ant-design/charts";

const EmpInfoStats = () => {
    const jobConfig = {
        data: {
            type: 'fetch',
            value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-column.json',
        },
        xField: 'letter',
        yField: 'frequency',
        label: {
            text: (d) => `${(d.frequency * 100).toFixed(1)}%`,
            textBaseline: 'bottom',
        },
        axis: {
            y: {
                labelFormatter: '.0%',
            },
        },
        style: {
            stroke: 'black',
            strokeWidth: 2,
        },
    };
    const genderConfig = {
        data: {
            type: 'fetch',
            value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-column.json',
        },
        xField: 'letter',
        yField: 'frequency',
        label: {
            text: (d) => `${(d.frequency * 100).toFixed(1)}%`,
            textBaseline: 'bottom',
        },
        axis: {
            y: {
                labelFormatter: '.0%',
            },
        },
        style: {
            stroke: 'black',
            strokeWidth: 2,
        },
    };
    return (
        <Card>
            <h2>员工信息统计</h2>
            <Card>
                <Flex vertical>
                    <h3>员工职位统计</h3>
                    <Column {...jobConfig} />
                </Flex>
            </Card>
            <Card>
                <Flex vertical>
                    <h3>员工性别统计</h3>
                    <Column {...genderConfig} />
                </Flex>
            </Card>
        </Card>
    );
}

export default EmpInfoStats;