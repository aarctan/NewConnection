import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Register | Weather app</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              firstName: "",
              lastName: "",
              password: "",
              policy: false,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              firstName: Yup.string()
                .max(255)
                .required("First name is required"),
              lastName: Yup.string().max(255).required("Last name is required"),
              password: Yup.string().max(255).required("password is required"),
            })}
            onSubmit={(values) => {
              const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_AUTH_KEY}`;
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
                  //setIsLoading(false);
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
                  /*
                    const expirationTime = new Date(
                      new Date().getTime() + +data.expiresIn * 1000
                    );
                    */
                  //authCtx.login(data.idToken, expirationTime.toISOString());
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
                <Box sx={{ mb: 0 }}>
                  <Typography color="textPrimary" variant="h2">
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Use your email to create new account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="First name"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label="Last name"
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                />
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
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>{errors.policy}</FormHelperText>
                )}
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{" "}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Register;
