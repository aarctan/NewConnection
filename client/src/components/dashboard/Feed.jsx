import { useState, useEffect, useContext, useCallback } from "react";
import { Box, Grid, Typography, Hidden, Container } from "@mui/material";
import SideProfile from "src/components/dashboard/SideProfile";
import AuthContext from "src/store/auth-context";
import Post from "src/components/post/Post";
import CreateNewPostContainer from "src/components/dashboard/CreateNewPostContainer";
import CircularProgress from "@mui/material/CircularProgress";
import CredentialsContext from "src/store/credentials-context";

const Feed = (props) => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const getCredentialsHandler = useContext(CredentialsContext);

  // https://www.robinwieruch.de/react-remove-item-from-list
  const handleRemove = (id) => {
    const newList = posts.filter((post) => post.id !== id);
    setPosts(newList);
  };

  // fetch the users inbox
  const fetchInbox = useCallback(async () => {
    setPosts([]);
    setPostsLoading(true);
    let credentials = getCredentialsHandler(authCtx.userdata.host);
    const response = await fetch(`${authCtx.userdata.id}/inbox/`, {
      headers: { Authorization: `Basic ` + btoa(credentials) },
    });
    if (response.ok) {
      const inboxData = await response.json();
      const inbox = inboxData["items"].filter((item) => item.type === "post");
      setPostsLoading(false);
      setPosts(inbox);
    } else {
      console.log("Feed useEffect failed - fetching inbox");
    }
  }, [authCtx, getCredentialsHandler]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  return (
    <Container maxWidth="md" sx={{ px: 0 }}>
      <Box display="flex" my="85px">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={8} lg={9}>
            <CreateNewPostContainer setPosts={setPosts} />
            {postsLoading ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            ) : posts.length ? (
              posts
                .sort((p1, p2) => {
                  const d1 = new Date(p1.published);
                  const d2 = new Date(p2.published);
                  return d2 - d1;
                })
                .map((post, idx) => {
                  return (
                    <Post
                      key={idx}
                      post={post}
                      id={post.id}
                      title={post.title}
                      description={post.description}
                      author={post.author}
                      contentType={post.contentType}
                      content={post.content}
                      published={post.published}
                      categories={post.categories}
                      visibility={post.visibility}
                      count={post.count}
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
                <i>Looks like you have nothing in your inbox!</i>
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
      </Box>
    </Container>
  );
};

export default Feed;
