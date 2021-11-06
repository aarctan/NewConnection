import Header from "src/components/header/Header";
import Feed from "src/components/dashboard/Feed";
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/authors/`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.items.sort(function(a1,a2) {
          const d1 = new Date(a1.created);
          const d2 = new Date(a2.created);
          return d2 - d1;
        });
        setAuthors(data.items);
      })
      .catch((error) => console.log("Dashboard useEffect", error));
  }, []);

  return (
    <>
      <Header />
      <Feed recentAuthors={authors.slice(0, 5)} />
    </>
  );
};

export default Dashboard;
