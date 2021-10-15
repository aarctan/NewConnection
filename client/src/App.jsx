import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import routes from "src/routes";
import { createTheme } from "@mui/material/styles";
import GlobalStyles from "./styles/styles";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import AuthRoutes from "./AuthRoutes";

const theme = createTheme({
  typography: {
    fontFamily: ["Arial"],
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#00000",
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
        <ThemeProvider theme={theme}>
          {authCtx.isLoggedIn ? routing : routingAuth}
        </ThemeProvider>
      </div>
    </div>
  );
};

export default App;
