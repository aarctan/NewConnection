import Header from "src/components/header/Header";
import Feed from "src/components/dashboard/Feed";
import { useEffect, useState } from "react";
import { authCredentials } from "src/utils/utils";

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        let credentials = authCredentials(
          "https://cmput404-vgt-socialdist.herokuapp.com/"
        );
        const responseOne = await fetch(
          `https://cmput404-vgt-socialdist.herokuapp.com/service/authors/`,
          {
            headers: {
              Authorization: `Basic ` + btoa(credentials),
            },
          }
        );
        const responseOneData = await responseOne.json();

        const responseTwo = await fetch(`${API_URL}/authors/`);
        const responseTwoData = await responseTwo.json();
        setAuthors([...responseOneData.items, ...responseTwoData.items]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <>
      <Header />
      <Feed recentAuthors={authors} />
    </>
  );
};

export default Dashboard;
