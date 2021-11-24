import React, { useState, useCallback, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;
const CredentialsContext = React.createContext();

export const CredentialsContextProvider = (props) => {
  const [nodes, setNodes] = useState([]);

  const getCredentialsHandler = (hostname) => {
    try {
      let node = nodes.find((o) => o.host_uri === hostname);
      let username = node["username"];
      let password = node["password"];
      return `${username}:${password}`;
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchNodes = useCallback(async () => {
    const response = await fetch(`${API_URL}/nodes/`);
    if (response.ok) {
      const responseData = await response.json();
      setNodes(responseData);
    } else {
      console.log("fetch nodes failed - fetching nodes");
    }
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  return (
    <CredentialsContext.Provider value={getCredentialsHandler}>
      {props.children}
    </CredentialsContext.Provider>
  );
};

export default CredentialsContext;
