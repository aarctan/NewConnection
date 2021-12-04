import Header from "src/components/header/Header";
import Feed from "src/components/dashboard/Feed";
import { useEffect, useState, useContext } from "react";
import CredentialsContext from "src/store/credentials-context";

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [authors, setAuthors] = useState([]);
  const getCredentialsHandler = useContext(CredentialsContext);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${API_URL}/authors/`);
        const responseData = await response.json();
        setAuthors([...responseData.items]);
      } catch (error) {
        console.log(error.message);
      }
    };
    window.scrollTo(0, 0);
    fetchAuthors();
  }, [getCredentialsHandler]);

  return (
    <>
      <Header />
      <Feed recentAuthors={authors} />
    </>
  );
};

export default Dashboard;
