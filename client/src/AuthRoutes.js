import { Navigate } from "react-router-dom";
import MainLayout from "src/components/MainLayout";
import Login from "src/pages/Login";
import NotFound from "src/pages/NotFound";
import Register from "src/pages/Register";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" replace={true} /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <Navigate to="/login" replace={true} /> },
    ],
  },
];

export default routes;
