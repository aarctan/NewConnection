import Header from "src/components/Header";
import Feed from "src/components/Feed";

const Dashboard = () => {
  /*
  const navigate = useNavigate();
  const onLogoutHandler = () => {
    navigate("/login", { replace: true });
  };
  */

  return (
    <>
      <Header />
      <Feed />
    </>
  );
};

export default Dashboard;
