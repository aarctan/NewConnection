import { useState, useContext } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import AuthContext from "src/store/auth-context";
import { useNavigate } from "react-router-dom";
import CreateTextPostModal from "src/components/dashboard/CreateTextPostModal";
import CreateImagePostModal from "src/components/dashboard/CreateImagePostModal";
import { authCredentials } from "src/utils/utils";

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

const CreateNewPostContainer = (props) => {
  const classes = useStyles();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Creates a post
  // This function is called from CreateImagePostModal.jsx and CreateTextPostModal.jsx
  // Gets passed in as a prop to these files
  const handleCreate = async (
    title,
    description,
    contentType,
    content,
    categories,
    visibility,
    unlisted,
    privateReceiver
  ) => {
    try {
      if (visibility === "Unlisted") visibility = "PUBLIC";
      let body = {
        author: authCtx.userdata,
        title: title,
        description: description,
        contentType: contentType,
        content: content,
        categories: categories,
        visibility: visibility,
        unlisted: unlisted,
      };
      // Create a post
      const postResponse = await fetch(`${authCtx.userdata.id}/posts/`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
      });
      if (postResponse.ok) {
        const postData = await postResponse.json();
        // If the post if a friends post, get followers of author and send to their inbox
        if (postData.visibility === "FRIENDS") {
          // Get Followers
          const responseFollowers = await fetch(
            `${authCtx.userdata.id}/followers/`
          );
          if (responseFollowers.ok) {
            const data = await responseFollowers.json();
            body["type"] = "post";
            // Loop through the followers and send them the post to their inbox
            for (let follower of data["items"]) {
              let credentials = authCredentials(follower.hostname);
              fetch(`${follower.id}/inbox/`, {
                method: "POST",
                body: JSON.stringify(postData),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Basic ` + btoa(credentials),
                },
              });
            }
          }
        } else if (postData.visibility === "PRIVATE") {
          postData["visibility"] = "FRIENDS";
          let credentials = authCredentials(privateReceiver.hostname);
          fetch(`${privateReceiver.id}/inbox/`, {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ` + btoa(credentials),
            },
          });
        }
        // If its a public post or unlisted, add the post to the users feed
        else {
          props.setPosts((oldPosts) => [...oldPosts, postData]);
        }
        setIsTextModalOpen(false);
        setIsImageModalOpen(false);
      }
    } catch (error) {
      let errorMessage = "Post failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Card elevation={3} sx={{ paddingBottom: 0, backgroundColor: "EDECEC" }}>
        <CardContent
          className={classes.cardContent}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Avatar
            alt="Avatar"
            src={authCtx.userdata.profileImage}
            sx={{
              width: 56,
              height: 56,
              marginRight: 1.5,
              cursor: "pointer",
              border: 1,
              borderColor: "gray",
            }}
            onClick={() => {
              const words = authCtx.userdata.id.split("/");
              const word = words[words.length - 1];
              navigate(`/app/author/${word}`, { state: authCtx.userdata });
            }}
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
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: "15px",
                justifyContent: "center",
                backgroundColor: "#eeeeee",
                marginBottom: 1.3,
              }}
              fullWidth
              onClick={() => setIsTextModalOpen(true)}
            >
              <Typography>Write a text post</Typography>
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: "15px",
                justifyContent: "center",
                backgroundColor: "#eeeeee",
              }}
              fullWidth
              onClick={() => setIsImageModalOpen(true)}
            >
              <Typography>Upload an image</Typography>
            </Button>
          </Box>
        </CardContent>
      </Card>
      <CreateTextPostModal
        isModalOpen={isTextModalOpen}
        setIsModalOpen={setIsTextModalOpen}
        handleCreate={handleCreate}
      ></CreateTextPostModal>
      <CreateImagePostModal
        isModalOpen={isImageModalOpen}
        setIsModalOpen={setIsImageModalOpen}
        handleCreate={handleCreate}
      ></CreateImagePostModal>
    </>
  );
};

export default CreateNewPostContainer;
