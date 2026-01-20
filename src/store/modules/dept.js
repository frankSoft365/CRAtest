import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils";

const deptReducer = createSlice({
    name: "dept",
    initialState: {
        list: [],
        queryReturn: null,
        result: {
            code: null,
            message: null
        },
    },
    reducers: {
        setList(state, action) {
            state.list = action.payload;
        },
        setQueryReturn(state, action) {
            state.queryReturn = action.payload;
        },
        setResult(state, action) {
            state.result = action.payload;
        },
    }
});

const { setList, setQueryReturn, setResult } = deptReducer.actions;

const fetchList = () => {
    return async (dispatch) => {
        const res = await request.get('/depts');
        console.log(res.data.data);
        const code = res.data.code;
        const data = res.data.data;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(setList(data));
        }
    };
};

const deleteDeptById = (id) => {
    return async (dispatch) => {
        const res = await request.delete(`/depts?id=${id}`);
        console.log('已发送delete请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(fetchList());
        }
    }
}

const addDept = (dept) => {
    return async (dispatch) => {
        const res = await request.post('/depts', dept);
        console.log('已发送add请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(fetchList());
        }
    }
}

const updateDept = (dept) => {
    return async (dispatch) => {
        const res = await request.put('/depts', dept);
        console.log('已发送update请求');
        const code = res.data.code;
        const message = res.data.msg;
        dispatch(setResult({ code: code, message: message }));
        if (code === 1) {
            dispatch(fetchList());
        }
    }
}

const getDeptNameById = (id) => {
    return async (dispatch) => {
        const res = await request.get(`/depts/${id}`);
        console.log(res.data.data);
        const code = res.data.code;
        if (code === 1) {
            dispatch(setQueryReturn(res.data.data));
        }
    };
};


const reducer = deptReducer.reducer;

export { fetchList, deleteDeptById, addDept, updateDept, getDeptNameById, setResult };

export default reducer;