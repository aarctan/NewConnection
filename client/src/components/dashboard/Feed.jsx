import { useState, useEffect } from "react";
import { Box, Grid, Typography, Hidden, Container } from "@mui/material";
import SideProfile from "src/components/dashboard/SideProfile";
import CreateTextPostModal from "src/components/dashboard/CreateTextPostModal";
import CreateImagePostModal from "src/components/dashboard/CreateImagePostModal";
import Post from "src/components/post/Post";
import CreateNewPostContainer from "src/components/dashboard/CreateNewPostContainer";
import CircularProgress from "@mui/material/CircularProgress";

const Feed = (props) => {
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const handlePostSubmit = (e, post) => {
    setPosts([...posts, post]);
  };

  // https://www.robinwieruch.de/react-remove-item-from-list
  const handleRemove = (id) => {
    const newList = posts.filter((post) => post.id !== id);
    setPosts(newList);
  };

  useEffect(() => {
    setPosts([]);
    setPostsLoading(true);
    for (let i = 0; i < props.recentAuthors.length; i++) {
      fetch(`${props.recentAuthors[i].id}/posts/`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          for (let j = 0; j < data.length; j++) {
            setPosts((oldArray) => [...oldArray, data[j]]);
            console.log(data[j]);
          }
          setPostsLoading(false);
        })
        .catch((error) => console.log("Feed useEffect", error));
    }
  }, [props.recentAuthors]);

  return (
    <Container maxWidth="md" sx={{ px: 0 }}>
      <Box display="flex" my="85px">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={8} lg={9}>
            <CreateNewPostContainer
              setIsTextModalOpen={setIsTextModalOpen}
              setIsImageModalOpen={setIsImageModalOpen}
            />
            {postsLoading ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            ) : posts.length ? (
              posts.sort(function (p1, p2) {
                const d1 = new Date(p1.published);
                const d2 = new Date(p2.published);
                return d1 - d2;
              }).map((post, idx) => {
                return (
                  <Post
                    key={idx}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    author={post.author}
                    contentType={post.contentType}
                    content={post.content}
                    count={1}
                    likes={[]}
                    handleRemove={handleRemove}
                  />
                );
              })
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
              display={{ xs: "none", sm: "none", md: "flex" }}
              alignItems="flex-start"
              justifyContent="center"
              item
              md={4}
              lg={3}
              sx={{ marginTop: 1 }}
            >
              <SideProfile recentAuthors={props.recentAuthors} />
            </Grid>
          </Hidden>
        </Grid>
        <CreateTextPostModal
          isModalOpen={isTextModalOpen}
          setIsModalOpen={setIsTextModalOpen}
          handlePostSubmit={handlePostSubmit}
        ></CreateTextPostModal>
        <CreateImagePostModal
          isModalOpen={isImageModalOpen}
          setIsModalOpen={setIsImageModalOpen}
          handlePostSubmit={handlePostSubmit}
        ></CreateImagePostModal>
      </Box>
    </Container>
  );
};

export default Feed;
