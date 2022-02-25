import { useEffect, useState, useContext } from "react";
import {
  Avatar,
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

        const fetches = [];

        // Team 06 (us)
        const responseFive = fetch(`${API_URL}/authors/`).then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error("Invalid response");
          }
        });
        fetches.push(responseFive);

        const data = await Promise.allSettled(fetches);
        const validAuthors = [];

        for (const response of data) {
          if (response.status === "fulfilled" && response.value.items) {
            validAuthors.push(response.value.items);
          } else {
            validAuthors.push(response.value);
          }
        }

        setAuthors(validAuthors.flat());
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    window.scrollTo(0, 0);
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
