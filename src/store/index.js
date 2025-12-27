import { configureStore } from "@reduxjs/toolkit";
import userReducer from './modules/user'
import deptReduer from './modules/dept';

export default configureStore({
    reducer: {
        user: userReducer,
        dept: deptReduer
    }
});