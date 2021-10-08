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
              <Stack alignItems="center" direction="row" spacing={2}>
                <Avatar
                  alt="Chad"
                  src="/static/images/avatars/chad.jpg"
                  sx={{ width: 38, height: 38 }}
                />
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "20px",
                    justifyContent: "flex-start",
                    backgroundColor: "#eaeaea",
                  }}
                  fullWidth
                  onClick={() => setIsModalOpen(true)}
                >
                  What's happening?
                </Button>
              </Stack>
            </CardContent>
          </Card>
          {posts.map((post) => (
            <Post
              likes={post.likes}
              name={post.name}
              contentUrl={post.contentUrl}
              pfpUrl={post.pfpUrl}
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
