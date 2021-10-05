import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();
  const onLogoutHandler = () => {
    navigate("/login", { replace: true });
  };

  return (
    <Button
      color="primary"
      fullWidth
      size="large"
      type="submit"
      variant="contained"
      onClick={onLogoutHandler}
    >
      Logout
    </Button>
  );
};

export default Dashboard;
