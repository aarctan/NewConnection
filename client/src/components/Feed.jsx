import * as React from "react";
import { useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Box,
  Grid,
  Button,
  Stack,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SideProfile from "./SideProfile";
import CreatePostModal from "./CreatePostModal";
import Post from "./Post";
import posts from "../__mocks__/posts";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#EDECEC",
  },
  buttonContainer: {
    textAlign: "center",
  },
  cardContent: {
    padding: theme.spacing(3),
  },
}));

const Feed = () => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box display="flex" mx="20%" my="1%">
      <Grid container spacing={4} justifyContent="flex-start">
        <Grid item xs={8}>
          <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
              <Grid container spacing={1} justifyContent="flex-start">
                <Grid item xs={2}>
                  <Avatar
                    alt="Chad"
                    src="/static/images/avatars/chad.jpg"
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Stack alignItems="center" direction="column" spacing={1}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "15px",
                        justifyContent: "center",
                        backgroundColor: "#eaeaea",
                      }}
                      fullWidth
                      onClick={() => setIsModalOpen(true)}
                    >
                      Write a text post
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "15px",
                        justifyContent: "center",
                        backgroundColor: "#eaeaea",
                      }}
                      fullWidth
                    >
                      Upload an image
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {posts.map((post) => (
            <Post
              title={post.title}
              description={post.description}
              displayName={post.author.displayName}
              contentType={post.contentType}
              content={post.content}
              count={post.count}
              profileImage={post.author.profileImage}
              comments={post.comments}
            />
          ))}
        </Grid>
        <Grid
          display="flex"
          alignItems="flex-start"
          item
          xs={4}
          sx={{ marginTop: 1 }}
        >
          <SideProfile />
        </Grid>
      </Grid>
      <CreatePostModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      ></CreatePostModal>
    </Box>
  );
};

export default Feed;
