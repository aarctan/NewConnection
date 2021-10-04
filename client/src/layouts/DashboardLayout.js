// Source: https://github.com/devias-io/material-kit-react
import { Outlet } from "react-router-dom";

// This is an outlet that renders the child routes element from within routes.js or AuthRoutes.js
const DashboardLayout = () => {
  return <Outlet />;
};

export default DashboardLayout;
