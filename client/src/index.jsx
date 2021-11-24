import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthContextProvider } from "./store/auth-context";
import { CredentialsContextProvider } from "./store/credentials-context";

ReactDOM.render(
  <AuthContextProvider>
    <CredentialsContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CredentialsContextProvider>
  </AuthContextProvider>,
  document.getElementById("root")
);
