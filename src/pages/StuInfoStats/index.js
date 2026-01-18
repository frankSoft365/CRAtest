import { Card, Flex } from "antd";
import { Column, Pie } from "@ant-design/charts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getNumOfStuInClazzData, getStuDegreeData } from "@/store/modules/student";

const StuInfoStats = () => {
    const dispatch = useDispatch();
    // 获取统计数据
    const { numOfStuInClazzStats, stuDegreeStats } = useSelector(state => state.student);
    useEffect(() => {
        dispatch(getNumOfStuInClazzData());
        dispatch(getStuDegreeData());
    }, [dispatch]);
    const stuCountConfig = {
        data: numOfStuInClazzStats,
        xField: 'clazz',
        yField: 'num',
        label: {
            textBaseline: 'bottom',
        },
        style: {
            stroke: 'black',
            strokeWidth: 2,
        },
    };
    const stuDegreeConfig = {
        data: stuDegreeStats,
        angleField: 'value',
        colorField: 'name',
        label: {
            text: 'name',
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
            <h2>学员信息统计</h2>
            <Flex>
                <Card style={{ width: '50%' }}>
                    <Flex vertical>
                        <h3>班级人数统计</h3>
                        <Column {...stuCountConfig} />
                    </Flex>
                </Card>
                <Card style={{ width: '50%' }}>
                    <Flex vertical>
                        <h3>学员学历统计</h3>
                        <Pie {...stuDegreeConfig} />
                    </Flex>
                </Card>
            </Flex>
        </Card>
    );
}

export default StuInfoStats;