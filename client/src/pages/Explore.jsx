import { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Chip,
  Container,
  Grid,
  Link,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "src/components/header/Header";
import GitHubIcon from "@mui/icons-material/GitHub";
import CredentialsContext from "src/store/credentials-context";
import CircularProgress from "@mui/material/CircularProgress";

const API_URL = process.env.REACT_APP_API_URL;
const hostColorMap = {
  "http://127.0.0.1:8000/": "black",
  "https://newconnection-server.herokuapp.com/": "black",
  "https://cmput404-vgt-socialdist.herokuapp.com/": "darkgreen",
  "https://i-connect.herokuapp.com": "#663399", // rebecca purple
  "https://project-api-404.herokuapp.com/api/": "blue",
  "https://plurr.herokuapp.com/": "#0fa6dc", // cerulean blue
};

const Explore = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();
  const getCredentialsHandler = useContext(CredentialsContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setIsLoading(true);
        // Team 20
        let credentials = getCredentialsHandler(
          "https://cmput404-vgt-socialdist.herokuapp.com/"
        );
        const responseOne = await fetch(
          `https://cmput404-vgt-socialdist.herokuapp.com/service/authors/`,
          {
            headers: {
              Authorization: `Basic ` + btoa(credentials),
            },
          }
        );
        const responseOneData = await responseOne.json();

        // Team 16
        credentials = getCredentialsHandler("https://i-connect.herokuapp.com/");
        const responseTwo = await fetch(
          `https://i-connect.herokuapp.com/service/authors/`,
          {
            headers: {
              Authorization: `Basic ` + btoa(credentials),
            },
          }
        );
        const responseTwoData = await responseTwo.json();

        // Team 23
        credentials = getCredentialsHandler(
          "https://project-api-404.herokuapp.com/api/"
        );
        const responseThree = await fetch(
          `https://project-api-404.herokuapp.com/api/authors`,
          {
            headers: {
              Authorization: `Basic ` + btoa(credentials),
            },
          }
        );
        const responseThreeData = await responseThree.json();

        // Team 26
        credentials = getCredentialsHandler("https://plurr.herokuapp.com/");
        const responseFour = await fetch(
          `https://plurr.herokuapp.com/service/authors/`,
          {
            headers: {
              Authorization: `Basic ` + btoa(credentials),
            },
          }
        );
        let responseFourData = await responseFour.json();

        // Team 06 (us)
        const responseFive = await fetch(`${API_URL}/authors/`);
        const responseFiveData = await responseFive.json();
        setAuthors([
          ...responseOneData.items,
          ...responseTwoData.items,
          ...responseThreeData,
          ...responseFourData.items.filter(
            (key) => key.host === "https://plurr.herokuapp.com/"
          ),
          ...responseFiveData.items,
        ]);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAuthors();
  }, [getCredentialsHandler]);

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ px: 0, my: "60pt" }}>
        <Grid container spacing={5} justifyContent="center">
          {isLoading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack alignItems="center" direction="column" mt={5}>
                {Object.keys(hostColorMap)
                  .filter((key) => key !== "http://127.0.0.1:8000/")
                  .map((key, idx) => (
                    <Chip
                      key={idx}
                      label={key}
                      variant="outlined"
                      size="small"
                      style={{
                        color: hostColorMap[key],
                        backgroundColor: "#ffffff",
                      }}
                      sx={{ mt: 0.8 }}
                    />
                  ))}
              </Stack>
              {authors
                .filter((author) => author.host in hostColorMap)
                .map((author, idx) => (
                  <Grid key={idx} item xs={6} sm={4} md={2}>
                    <Stack alignItems="center" direction="column">
                      <Link
                        component="button"
                        onClick={() => {
                          const words = author.id.split("/");
                          const word = words[words.length - 1];
                          navigate(`/app/author/${word}`, { state: author });
                        }}
                      >
                        <Avatar
                          alt="Avatar"
                          src={author.profileImage}
                          sx={{
                            width: 128,
                            height: 128,
                            border: 2,
                            borderColor:
                              author.host in hostColorMap
                                ? hostColorMap[author.host]
                                : "red",
                          }}
                        />
                      </Link>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Link
                          component="button"
                          variant="body2"
                          underline="hover"
                          onClick={() => {
                            const words = author.id.split("/");
                            const word = words[words.length - 1];
                            navigate(`/app/author/${word}`, { state: author });
                          }}
                        >
                          <Typography variant="h6">
                            {author.displayName.length > 10
                              ? `${author.displayName.substring(0, 10)}...`
                              : author.displayName}
                          </Typography>
                        </Link>
                        {author.github && (
                          <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                          >
                            <Link
                              component="button"
                              onClick={() => {
                                window.open(author.github);
                              }}
                            >
                              <GitHubIcon
                                sx={{ width: "15pt", height: "15pt" }}
                              />
                            </Link>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                ))}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Explore;
