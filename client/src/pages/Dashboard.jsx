import Header from "src/components/Header";
import Feed from "src/components/Feed";
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  /*
  const navigate = useNavigate();
  const onLogoutHandler = () => {
    navigate("/login", { replace: true });
  };
  */
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/authors/`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.items);
        setAuthors(data.items);
      })
      .catch((error) => console.log("Dashboard useEffect", error));
  }, []);

  return (
    <>
      <Header />
      <Feed />
    </>
  );
};

export default Dashboard;
