import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils";

const userReducer = createSlice({
    name: "user",
    initialState: {
        token: ''
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        }
    }
});

const { setToken } = userReducer.actions;

const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        const res = await request.post('/authorizations', loginForm);
        dispatch(setToken(res.data.token));
    };
};

const reducer = userReducer.reducer;

export { fetchLogin };

export default reducer;