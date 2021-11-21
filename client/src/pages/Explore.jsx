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

const API_URL = process.env.REACT_APP_API_URL;

const Explore = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const responseOne = await fetch(
          `https://cmput404-vgt-socialdist.herokuapp.com/service/authors`
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
                <Stack alignItems="center" direction="column">
                  <Avatar
                    alt="Avatar"
                    src={author.profileImage}
                    sx={{
                      width: 128,
                      height: 128,
                      border: 1,
                      borderColor: "gray",
                    }}
                  />
                  <Typography variant="h6">{author.displayName}</Typography>
                </Stack>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Explore;
