import { useState, forwardRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";

const API_URL = process.env.REACT_APP_API_URL;

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [openFailureAlert, setOpenFailureAlert] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const handleUsernameBlur = () => {
    if (username === "") {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handlePasswordBlur = () => {
    if (password === "") {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword === "") {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenFailureAlert(false);
  };

  const handleRegistration = async (e) => {
    try {
      const response = await fetch(`${API_URL}/dj-rest-auth/registration/`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password1: password,
          password2: confirmPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        navigate("/login", { replace: true });
      } else {
        response.json().then((res) => {
          let message = "";
          for (const p in res) {
            message =
              message +
              `${
                p === "username"
                  ? "Username"
                  : p === "password1"
                  ? "Password"
                  : p === "password2"
                  ? "Confirm Password"
                  : p
              }: ${res[p]}\n`;
          }
          setSnackbarMessage(message);
          setOpenFailureAlert(true);
        });
      }
    } catch (error) {
      let errorMessage = "Authentication failed!";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | NewConnection</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Container maxWidth="sm">
          <Box display="flex" justifyContent="center" py="10px">
            <img
              src="/newconnectionlogo.png"
              alt="logo"
              style={
                small
                  ? { maxWidth: 300, marginBottom: 20 }
                  : { maxWidth: 400, marginBottom: 10 }
              }
              display="flex"
            />
          </Box>
          <Box
            item
            px="20pt"
            py="20pt"
            backgroundColor="white"
            borderRadius="10px"
            justifyContent="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            />
            <TextField
              id="username"
              fullWidth
              label="Username"
              margin="dense"
              variant="outlined"
              error={usernameError}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              onFocus={(e) => {
                setUsernameError(false);
              }}
              onBlur={(e) => handleUsernameBlur()}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleRegistration();
                }
              }}
            />

            <TextField
              id="password"
              fullWidth
              label="Password"
              margin="dense"
              type="password"
              variant="outlined"
              error={passwordError}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onFocus={(e) => {
                setPasswordError(false);
              }}
              onBlur={(e) => handlePasswordBlur()}
            />

            <TextField
              id="confirmPassword"
              fullWidth
              label="Confirm Password"
              margin="dense"
              type="password"
              variant="outlined"
              error={confirmPasswordError}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              onFocus={(e) => {
                setConfirmPasswordError(false);
              }}
              onBlur={(e) => handleConfirmPasswordBlur()}
            />

            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                fullWidth
                type="submit"
                variant="contained"
                style={{ background: "#FFFFFF", color: "black" }}
                onClick={handleRegistration}
              >
                Register
              </Button>
            </Box>
            <Box display="flex" justifyContent="center">
              <Typography
                marginRight="10pt"
                color="textSecondary"
                variant="body1"
                align="center"
              >
                Have an account?
              </Typography>
              <Link component={RouterLink} to="/login" variant="body1">
                Sign in
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      <Snackbar
        open={openFailureAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        style={{ whiteSpace: "pre-wrap" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
