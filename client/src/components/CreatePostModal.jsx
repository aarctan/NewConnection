import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useContext } from "react";
import AuthContext from "src/store/auth-context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 3,
  borderRadius: "8px",
};


export default function CreatePostModal({ isModalOpen, setIsModalOpen }) {
  const handleClose = () => setIsModalOpen(false);
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");
  if (!isModalOpen) return null;

  const handleCreate = async (e) => {
    const userdata = authCtx.userdata;
    console.log(userdata);
    try {
      const postResponse = await fetch(`${userdata.id}/posts/`, {
        method: "POST",
        body: JSON.stringify({
          author: userdata,
          title: title,
          description: description,
          contentType: "text/plain",
          content: text,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (postResponse.ok) {
        setIsModalOpen(false);
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
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            Create a new post
          </Typography>
          <TextField
            label="Title"
            fullWidth
            multiline
            margin="dense"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            label="Description"
            fullWidth
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <TextField
            label="What's happening, Chad?"
            multiline
            rows={5}
            fullWidth
            margin="dense"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />

          <Grid container>
            <Grid item xs={6} align="left"></Grid>
            <Grid item xs={6} align="right">
              <Button endIcon={<SendIcon />} onClick={handleCreate}>
                Post
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
