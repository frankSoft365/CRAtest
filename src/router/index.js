import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import Index from "@/pages/Index";
import DeptManagement from "@/pages/DeptManagement";
import EmpManagement from "@/pages/EmpManagement";
import EmpInfoStats from "@/pages/EmpInfoStats";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Index />
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
        ]
    },
    {
        path: '/login',
        element: <Login />
    }
]);

export default router;