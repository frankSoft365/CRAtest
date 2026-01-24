import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import FrontPage from "@/pages/FrontPage";
import DeptManagement from "@/pages/DeptManagement";
import EmpManagement from "@/pages/EmpManagement";
import EmpInfoStats from "@/pages/EmpInfoStats";
import ClazzManagement from "@/pages/ClazzManagement";
import StudentManagement from "@/pages/StudentManagement";
import StuInfoStats from "@/pages/StuInfoStats";
import { AuthRoute } from "@/components/AuthRoute";
import LogInfoStats from "@/pages/LogInfoStats";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <AuthRoute><Layout /></AuthRoute>,
        children: [
            {
                index: true,
                element: <FrontPage />
            },
            {
                path: '/deptManagement',
                element: <DeptManagement />
            },
            {
                path: '/empManagement',
                element: <EmpManagement />
            },
            {
                path: '/empInfoStats',
                element: <EmpInfoStats />
            },
            {
                path: '/clazzManagement',
                element: <ClazzManagement />
            },
            {
                path: '/studentManagement',
                element: <StudentManagement />
            },
            {
                path: '/stuInfoStats',
                element: <StuInfoStats />
            },
            {
                path: '/logInfoStats',
                element: <LogInfoStats />
            },
        ]
    },
]);

export default router;