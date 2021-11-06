import { useState, useContext } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AuthContext from "src/store/auth-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import PostTags from "./createpost/PostTags";
import PostVisibility from "./createpost/PostVisibility";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 3,
  borderRadius: "8px",
};

const CreateTextPostModal = ({
  isModalOpen,
  setIsModalOpen,
  handlePostSubmit,
}) => {
  const handleClose = () => setIsModalOpen(false);
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [visibility, setVisibility] = useState("Public");
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
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
          Authorization: `Token ${authCtx.token}`,
        },
      });
      if (postResponse.ok) {
        const postData = await postResponse.json();
        handlePostSubmit(e, postData);
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
        <Box
          sx={style}
          style={small ? { width: "90%", height: "70%" } : { width: 500 }}
        >
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
            >
              Create a new post
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <TextField
              label={`What's happening, ${authCtx.userdata.displayName} ?`}
              multiline
              rows={5}
              fullWidth
              margin="dense"
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </Box>

          <PostTags tags={tags} setTags={setTags} />

          <Box display="flex" justifyContent="space-between">
            <PostVisibility
              visibility={visibility}
              setVisibility={setVisibility}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleCreate}
              style={{
                color: "black",
                backgroundColor: "white",
                marginTop: "3pt",
                border: "1pt solid #dbdbdb",
                height: "25pt",
              }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CreateTextPostModal;
