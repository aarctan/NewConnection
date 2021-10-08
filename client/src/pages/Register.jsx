import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
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

const Register = () => {
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
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: "",
              displayName: "",
              password: "",
              policy: false,
            }}
            validationSchema={Yup.object().shape({
              displayName: Yup.string()
                .max(255)
                .required("Display name is required"),
              password: Yup.string().max(255).required("password is required"),
            })}
          >
            <form>
              <Box sx={{ mb: 0 }}>
                <Typography color="textPrimary" variant="h2" align="center">
                  Create an account
                </Typography>
              </Box>
              <TextField
                id="username"
                fullWidth
                label="Username"
                margin="dense"
                variant="outlined"
              />
              <TextField
                id="displayName"
                fullWidth
                label="Display Name"
                margin="dense"
                variant="outlined"
              />
              <TextField
                id="password"
                fullWidth
                label="Password"
                margin="dense"
                type="password"
                variant="outlined"
              />
              <TextField
                id="gtihub"
                fullWidth
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
              />
              <Box sx={{ py: 2 }}>
                <Button
                  color="primary"
                  fullWidth
                  type="submit"
                  variant="contained"
                  style={{ background: "#FFFFFF", color: "black" }}
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
            </form>
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Register;
