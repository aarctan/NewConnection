import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import AuthContext from "src/store/auth-context";

const Login = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  return (
    <>
      <Helmet>
        <title>Login | NewConnection</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          height: "100vh",
          marginLeft: "8%",
          marginRight: "8%",
        }}
      >
        <Box justifyContent="center" py="20px">
          <Typography
            display="flex"
            justifyContent="center"
            color="#1775ee"
            variant="h1"
            fontFamily="sans-serif"
          >
            NewConnection
          </Typography>
          <Typography
            display="flex"
            justifyContent="center"
            color="black"
            fontSize="22px"
            fontFamily="sans-serif"
            sx={{ mb: 4 }}
          >
            Distributed social network to connect with friends.
          </Typography>
        </Box>
        <Box
          item
          px="30px"
          py="40px"
          backgroundColor="white"
          borderRadius="10px"
          justifyContent="center"
        >
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              password: Yup.string().max(255).required("Password is required"),
            })}
            onSubmit={(values) => {
              const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_AUTH_KEY}`;
              fetch(url, {
                method: "POST",
                body: JSON.stringify({
                  email: values.email,
                  password: values.password,
                  returnSecureToken: true,
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
                      // if (data && data.error && data.error.message) {
                      //   errorMessage = data.error.message;
                      // }

                      throw new Error(errorMessage);
                    });
                  }
                })
                .then((data) => {
                  const expirationTime = new Date(
                    new Date().getTime() + +data.expiresIn * 1000
                  );
                  authCtx.login(data.idToken, expirationTime.toISOString());
                  navigate("/app/dashboard", { replace: true });
                })
                .catch((err) => {
                  alert(err.message);
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography color="textPrimary" variant="h4">
                    Sign in
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?{" "}
                  <Link component={RouterLink} to="/register" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export default Login;