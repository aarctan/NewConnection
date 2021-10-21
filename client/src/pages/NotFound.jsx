import { Helmet } from "react-helmet";
import { Box, Container, Typography } from "@mui/material";

const NotFound = () => (
  <>
    <Helmet>
      <title>404 | NewConnection</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography align="center" color="textPrimary" variant="h3">
          404: The page you are looking for isn’t here
        </Typography>
        <Typography align="center" color="textPrimary" variant="subtitle1">
          You either tried some shady route or you came here by mistake.
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <img
            alt="Under development"
            src="/static/images/undraw_page_not_found_su7k.svg"
            style={{
              marginTop: 50,
              display: "inline-block",
              maxWidth: "100%",
              width: 560,
            }}
          />
        </Box>
      </Container>
    </Box>
  </>
);

export default NotFound;
