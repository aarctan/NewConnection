import { useEffect, useState } from "react";
import {
  Avatar,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "src/components/header/Header";
import GitHubIcon from "@mui/icons-material/GitHub";

const API_URL = process.env.REACT_APP_API_URL;
const hostColorMap = {
  "http://127.0.0.1:8000/": "black",
  "https://newconnection-server.herokuapp.com/": "black",
  "https://cmput404-vgt-socialdist.herokuapp.com/": "darkgreen",
};

const Explore = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const responseOne = await fetch(
          `https://cmput404-vgt-socialdist.herokuapp.com/service/authors/`
        );
        const responseOneData = await responseOne.json();

        const responseTwo = await fetch(`${API_URL}/authors/`);
        const responseTwoData = await responseTwo.json();
        setAuthors([...responseOneData.items, ...responseTwoData.items]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ px: 0, my: "60pt" }}>
        <Grid container spacing={5} justifyContent="center">
          {authors.map((author, idx) => (
            <Grid item xs={6} sm={4} md={2}>
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
                    <Typography variant="h6">{author.displayName}</Typography>
                  </Link>
                  {author.github && (
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Link
                        component="button"
                        onClick={() => {
                          window.open(author.github);
                        }}
                      >
                        <GitHubIcon sx={{ width: "15pt", height: "15pt" }} />
                      </Link>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Explore;
