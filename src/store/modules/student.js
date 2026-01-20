import { createSlice } from "@reduxjs/toolkit";
import { request, toURLSearchParams } from "@/utils";

const studentReducer = createSlice({
    name: "student",
    initialState: {
        rows: [],
        total: null,
        queryReturn: null,
        result: {
            code: null,
            message: null
        },
        numOfStuInClazzStats: [],
        stuDegreeStats: [],
    },
    reducers: {
        setRows(state, action) {
            state.rows = action.payload;
        },
        setTotal(state, action) {
            state.total = action.payload;
        },
        setQueryReturn(state, action) {
            state.queryReturn = action.payload;
        },
        setResult(state, action) {
            state.result = action.payload;
        },
        setNumOfStuInClazzStats(state, action) {
            state.numOfStuInClazzStats = action.payload;
        },
        setStuDegreeStats(state, action) {
            state.stuDegreeStats = action.payload;
        },
    }
});
const {
    setRows,
    setTotal,
    setQueryReturn,
    setResult,
    setNumOfStuInClazzStats,
    setStuDegreeStats,
} = studentReducer.actions;
// 设置异常处理 获取员工列表
const defaultFetchList = (tableParams) => {
    return async (dispatch) => {
        const params = toURLSearchParams(tableParams).toString();
        const res = await request.get(`/students?${params}`);
        const code = res.data.code;
        const data = res.data.data;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(setRows(data.rows));
            dispatch(setTotal(data.total));
        }
    };
};

const deleteStuByIds = (ids, tableParams) => {
    return async (dispatch) => {
        const params = ids.join(',');
        console.log("url参数 : ", params);
        const res = await request.delete(`/students/${params}`);
        console.log('已发送delete请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(defaultFetchList(tableParams));
        }
    }
}

const addStudent = (student, tableParams) => {
    return async (dispatch) => {
        const res = await request.post('/students', student);
        console.log('已发送add请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(defaultFetchList(tableParams));
        }
    }
}

// 设置异常处理 更改员工信息
const updateStudent = (stu, tableParams) => {
    return async (dispatch) => {
        const res = await request.put('/students', stu);
        console.log('已发送update请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(defaultFetchList(tableParams));
        }
    }
}

// 设置异常处理 获取查询回显的学员信息
const getQueryReturnById = (id) => {
    return async (dispatch) => {
        console.log('发送查询回显请求！');
        const res = await request.get(`/students/${id}`);
        console.log('查询回显获取到学员信息：', res.data.data);
        const code = res.data.code;
        if (code === 1) {
            dispatch(setQueryReturn(res.data.data));
        }
    };
};

// 获取班级人数
const getNumOfStuInClazzData = () => {
    return async (dispatch) => {
        const res = await request.get('/report/studentCountData');
        const code = res.data.code;
        if (code === 1) {
            dispatch(setNumOfStuInClazzStats(res.data.data));
        }
    }
}

// 学员学历统计
const getStuDegreeData = () => {
    return async (dispatch) => {
        const res = await request.get('/report/studentDegreeData');
        const code = res.data.code;
        if (code === 1) {
            dispatch(setStuDegreeStats(res.data.data));
        }
    }
}

// 违纪处理 将选择的学生id和扣分数值传给后端
const violationAction = (id, score, tableParams) => {
    return async (dispatch) => {
        const res = await request.put(`/students/violation/${id}/${score}`);
        console.log('已发送违纪处理请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(defaultFetchList(tableParams));
        }
    }
}

const reducer = studentReducer.reducer;

export {
    defaultFetchList,
    deleteStuByIds,
    addStudent,
    updateStudent,
    getQueryReturnById,
    setQueryReturn,
    setResult,
    getNumOfStuInClazzData,
    getStuDegreeData,
    violationAction,
};

export default reducer;