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

const fetchList = () => {
    return async (dispatch) => {
        // const res = await request.get('http://localhost:8080/depts');
        // console.log(res.data.data);
        // dispatch(setList(res.data.data));
    };
};

const deleteDeptById = (id) => {
    return async (dispatch) => {
        // await request.delete('http://localhost:8080/depts?id=' + id);
        // console.log('已发送delete请求');
        // dispatch(fetchList());
    }
}

const addDept = (dept) => {
    return async (dispatch) => {
        // await request.post('http://localhost:8080/depts', dept);
        // console.log('已发送add请求');
        // dispatch(fetchList());
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

export { fetchList, deleteDeptById, addDept, updateDept, getDeptNameById };

export default reducer;