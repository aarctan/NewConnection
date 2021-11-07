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

  const handleCreate = async (
    title,
    description,
    contentType,
    content,
    categories,
    visibility,
    unlisted
  ) => {
    try {
      const postResponse = await fetch(`${authCtx.userdata.id}/posts/`, {
        method: "POST",
        body: JSON.stringify({
          author: authCtx.userdata,
          title: title,
          description: description,
          contentType: contentType,
          content: content,
          categories: categories,
          visibility: visibility,
          unlisted: false,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
      });
      if (postResponse.ok) {
        const postData = await postResponse.json();
        props.setPosts((oldPosts) => [...oldPosts, postData]);
        setIsTextModalOpen(false);
        setIsImageModalOpen(false);
      } else {
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
