import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils";

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

const toURLSearchParams = record => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(record)) {
        params.append(key, value);
    }
    return params;
};

const defaultFetchList = (tableParams) => {
    return async (dispatch) => {
        const params = toURLSearchParams(tableParams);
        console.log('页面传递的参数是' + params.toString());
        const res = await request.get(`http://localhost:8080/emps?${params.toString()}`);
        console.log(res.data.data);
        dispatch(setRows(res.data.data.rows));
        dispatch(setTotal(res.data.data.total));
    };
};

const deleteEmpById = (id, tableParams) => {
    return async (dispatch) => {
        await request.delete('http://localhost:8080/depts?id=' + id);
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

const updateDept = (dept) => {
    return async (dispatch) => {
        // await request.put('http://localhost:8080/depts', dept);
        // console.log('已发送update请求');
        // dispatch(fetchList());
    }
}

const getDeptNameById = (id) => {
    return async (dispatch) => {
        // const res = await request.get('http://localhost:8080/depts/' + id);
        // console.log(res.data.data);
        // dispatch(setQueryReturn(res.data.data));
    };
};


const reducer = empReducer.reducer;

export { defaultFetchList, deleteEmpById, addEmp, updateDept, getDeptNameById };

export default reducer;