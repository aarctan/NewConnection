import React, { useState, useCallback } from "react";

const AuthContext = React.createContext({
  token: "",
  userdata: {},
  isLoggedIn: false,
  login: (token, userdata) => {},
  logout: () => {},
  update: (userdata) => {},
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");

  return {
    token: storedToken,
  };
};

const retrieveStoredUserData = () => {
  const storedUserData = localStorage.getItem("userdata");

  return {
    userdata: storedUserData,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  const userData = retrieveStoredUserData();
  let initialToken;
  let initialUserdata;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  if (userData) {
    // Turn userdata into an object
    initialUserdata = JSON.parse(userData.userdata);
  }
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUserdata);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userdata");
  }, []);

  const loginHandler = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    // Need to turn JSON into a string to store in local storage
    localStorage.setItem("userdata", JSON.stringify(user));
  };

  const updateHandler = (user) => {
    setUser(user);
    // Need to turn JSON into a string to store in local storage
    localStorage.setItem("userdata", JSON.stringify(user));
  };

  const contextValue = {
    token: token,
    userdata: user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    update: updateHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
