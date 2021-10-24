import { useState } from "react";
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
import GitHub from "@mui/icons-material/GitHub";
import InputAdornment from "@mui/material/InputAdornment";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const API_URL = process.env.REACT_APP_API_URL;
const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [github, setGithub] = useState("");
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRegistration = async (e) => {
    console.log(
      `username: ${username}\ndisplayName: ${displayName}\npassword: ${password}\ngithub: ${github}\n`
    );
    try {
      const response = await fetch(`${API_URL}/dj-rest-auth/registration/`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password1: password,
          password2: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        navigate("/login", { replace: true });
      } else {
        console.log("Error logging in");
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
              justifyContent="center"
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
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              id="displayName"
              fullWidth
              label="Display Name"
              margin="dense"
              variant="outlined"
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
            <TextField
              id="password"
              fullWidth
              label="Password"
              margin="dense"
              type="password"
              variant="outlined"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              id="gtihub"
              fullWidth
              label="Github (optional)"
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHub />
                  </InputAdornment>
                ),
              }}
              defaultValue="https://github.com/"
              variant="outlined"
              onChange={(e) => {
                setGithub(e.target.value);
              }}
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
    </>
  );
};

export default Register;
