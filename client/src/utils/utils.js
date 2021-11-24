export const authCredentials = (hostname) => {
  if (hostname === "https://cmput404-vgt-socialdist.herokuapp.com/") {
    return "VeryGoodAuth:CoolPassword";
  } else if (hostname === "https://newconnection-server.herokuapp.com/") {
    return "admin:NewConnectionAdmin";
  } else if (hostname === "http://127.0.0.1:8000/") {
    return "admin:NewConnectionAdmin";
  }
};
