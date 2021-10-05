import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import routes from "src/routes";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import AuthRoutes from "./AuthRoutes";
import { createTheme } from "@mui/material/styles";
import GlobalStyles from "./styles/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1775ee",
    },
    secondary: {
      main: "#FEDB04",
    },
  },
});

const App = () => {
  const authCtx = useContext(AuthContext);

  const routing = useRoutes(routes);
  const routingAuth = useRoutes(AuthRoutes);

  return (
    <div className="page-container">
      <div className="content-wrap">
        <GlobalStyles />
        <ThemeProvider theme={theme}>{routing}</ThemeProvider>
      </div>
    </div>
  );
};

export default App;
//{authCtx.isLoggedIn ? routing : routingAuth}
