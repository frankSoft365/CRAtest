import { createSlice } from "@reduxjs/toolkit";
import { request, toURLSearchParams } from "@/utils";

const empReducer = createSlice({
    name: "emp",
    initialState: {
        rows: [],
        total: null,
        queryReturn: null
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
        }
    }
});

const { setRows, setTotal, setQueryReturn } = empReducer.actions;

const defaultFetchList = (tableParams) => {
    return async (dispatch) => {
        const params = toURLSearchParams(tableParams).toString();
        console.log('页面传递的参数是' + params);
        const res = await request.get(`http://localhost:8080/emps?${params}`);
        console.log(res.data.data);
        dispatch(setRows(res.data.data.rows));
        dispatch(setTotal(res.data.data.total));
    };
};

const deleteEmpByIds = (ids, tableParams) => {
    return async (dispatch) => {
        const params = toURLSearchParams(ids).toString();
        console.log("url参数 : ", params);
        await request.delete(`http://localhost:8080/emps?${params}`);
        console.log('已发送delete请求');
        dispatch(defaultFetchList(tableParams));
    }
}

const addEmp = (emp, tableParams) => {
    return async (dispatch) => {
        await request.post('http://localhost:8080/emps', emp);
        console.log('已发送add请求');
        dispatch(defaultFetchList(tableParams));
    }
}

const updateEmp = (emp, tableParams) => {
    return async (dispatch) => {
        await request.put('http://localhost:8080/emps', emp);
        console.log('已发送update请求');
        dispatch(defaultFetchList(tableParams));
    }
}

const getQueryReturnById = (id) => {
    return async (dispatch) => {
        console.log('发送查询回显请求！');
        const res = await request.get('http://localhost:8080/emps/' + id);
        console.log('查询回显获取到员工信息：', res.data.data);
        dispatch(setQueryReturn(res.data.data));
    };
};


const reducer = empReducer.reducer;

export { defaultFetchList, deleteEmpByIds, addEmp, updateEmp, getQueryReturnById, setQueryReturn };

export default reducer;