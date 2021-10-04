// Source: https://github.com/devias-io/material-kit-react
import { Outlet } from "react-router-dom";

// This is an outlet that renders the child routes element from within AuthRoutes.js
const MainLayout = () => {
  return <Outlet />;
};

export default MainLayout;
