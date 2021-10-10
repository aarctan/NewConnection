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
    <Box display="flex" mx="20%" my="85px">
      <Grid container spacing={4} justifyContent="flex-start">
        <Grid item xs={8}>
          <Card className={classes.root}>
            <CardContent
              className={classes.cardContent}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Avatar
                alt="Chad"
                src="/static/images/avatars/chad.jpg"
                sx={{ width: 56, height: 56, marginRight: 1.5 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  px: 1,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "15px",
                    justifyContent: "center",
                    backgroundColor: "#eaeaea",
                    marginBottom: 1.3,
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
              </Box>
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
