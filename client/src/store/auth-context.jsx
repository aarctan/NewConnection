import React, { useState, useCallback } from "react";

const AuthContext = React.createContext({
  token: "",
  userdata: {},
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");

  return {
    token: storedToken,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const [userdata, setUserdata] = useState({});

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUserdata(null);
    localStorage.removeItem("token");
  }, []);

  const loginHandler = (token, userdata) => {
    setToken(token);
    setUserdata(userdata);
    localStorage.setItem("token", token);
  };

  const contextValue = {
    token: token,
    userdata: userdata,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
