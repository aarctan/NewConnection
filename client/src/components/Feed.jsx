import { useState, useEffect } from "react";
import { Box, Grid, Typography, Hidden, Container } from "@mui/material";
import SideProfile from "./SideProfile";
import CreatePostModal from "./CreatePostModal";
import Post from "./Post";
import CreateNewPostContainer from "./CreateNewPostContainer";

const Feed = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const handlePostSubmit = (e, post) => {
    setPosts([...posts, post]);
  };

  // https://www.robinwieruch.de/react-remove-item-from-list
  const handleRemove = (id) => {
    const newList = posts.filter((post) => post.id !== id);
    setPosts(newList);
  };

  useEffect(() => {
    for (let i = 0; i < props.recentAuthors.length; i++) {
      fetch(`${props.recentAuthors[i].id}/posts/`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          for (let j = 0; j < data.length; j++) {
            setPosts((oldArray) => [...oldArray, data[j]]);
          }
        })
        .catch((error) => console.log("Feed useEffect", error));
    }
  }, [props.recentAuthors]);

  return (
    <Container maxWidth="lg" sx={{ px: 0 }}>
      <Box display="flex" my="85px">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={8} lg={9}>
            <CreateNewPostContainer setIsModalOpen={setIsModalOpen} />
            {posts.length ? (
              posts.map((post, idx) => (
                <Post
                  key={idx}
                  id={post.id}
                  title={post.title}
                  description={post.description}
                  author={post.author}
                  contentType={post.contentType}
                  content={post.content}
                  count={1}
                  comments={[]}
                  handleRemove={handleRemove}
                />
              ))
            ) : (
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "#858585", marginTop: "10%" }}
              >
                <i>It's quiet here, why not add a new post?</i>
              </Typography>
            )}
          </Grid>
          <Hidden mdDown>
            <Grid
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              item
              xs={0}
              sm={0}
              md={4}
              lg={3}
              sx={{ marginTop: 1 }}
            >
              <SideProfile recentAuthors={props.recentAuthors} />
            </Grid>
          </Hidden>
        </Grid>
        <CreatePostModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handlePostSubmit={handlePostSubmit}
        ></CreatePostModal>
      </Box>
    </Container>
  );
};

export default Feed;
