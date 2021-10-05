import { Navigate } from "react-router-dom";
import DashboardLayout from "src/layouts/DashboardLayout";
import MainLayout from "src/layouts/MainLayout";
import Dashboard from "src/pages/Dashboard";
import Login from "src/pages/Login";
import NotFound from "src/pages/NotFound";
import Register from "src/pages/Register";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "404", element: <NotFound /> },
      { path: "/", element: <Navigate to="/login" replace={true} /> },
      { path: "*", element: <Navigate to="/404" replace={true} /> },
    ],
  },
  {
    path: "app",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
