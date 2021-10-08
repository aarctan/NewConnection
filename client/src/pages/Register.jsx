import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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

const API_URL = process.env.REACT_APP_API_URL;
const Register = () => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [github, setGithub] = useState("");

  const handleRegistration = async (e) => {
    console.log(
      `username: ${username}\ndisplayName: ${displayName}\npassword: ${password}\ngithub: ${github}\n`
    );
    const url = `${API_URL}/dj-rest-auth/registration/`;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password1: password,
        password2: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err.message);
      });
    console.log(`${API_URL}`);
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
          height: "100vh",
          marginTop: "10%",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 0 }}>
            <Typography color="textPrimary" variant="h3" align="center">
              Create an account
            </Typography>
          </Box>
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
          <Typography color="textSecondary" variant="body1" align="center">
            Have an account?{" "}
            <Link component={RouterLink} to="/login" variant="body1">
              Sign in
            </Link>
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Register;
