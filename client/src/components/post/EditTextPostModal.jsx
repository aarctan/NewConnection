import { useState, useContext } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AuthContext from "src/store/auth-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import PostTags from "src/components/dashboard/createpost/PostTags";

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

// Modal to edit a text post
const EditTextPostModal = ({
  isEditTextPostModalOpen,
  setIsEditTextPostModalOpen,
  post,
  handleEdit,
}) => {
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [content, setContent] = useState(post.content);
  const [categories, setCategories] = useState([...post.categories]);
  const [markdownCheckbox, setMarkdownCheckbox] = useState(false);
  const [contentType, setContentType] = useState(post.contentType);
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isEditTextPostModalOpen) return null;

  const handleClose = () => {
    setMarkdownCheckbox(false);
    setTitle(post.title);
    setDescription(post.description);
    setContent(post.content);
    setContentType(post.contentType);
    setCategories([...post.categories]);
    setIsEditTextPostModalOpen(false);
  };

  const handleMarkdownChange = (event) => {
    setMarkdownCheckbox(event.target.checked);
    if (event.target.checked) setContentType("text/markdown");
    else setContentType("text/plain");
  };

  // Edits a post
  // This is called when the user clicks the Edit button
  const editPost = async (
    title,
    description,
    contentType,
    content,
    categories
  ) => {
    try {
      let body = {
        title: title,
        description: description,
        contentType: contentType,
        content: content,
        categories: categories,
      };
      // Edits a post
      const postResponse = await fetch(`${post.id}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
      });
      if (postResponse.ok) {
        const postData = await postResponse.json();
        // Update the post with the new content
        handleEdit(postData);
        // close the modal
        setIsEditTextPostModalOpen(false);
      }
    } catch (error) {
      let errorMessage = "Edit Text Post failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Modal open={isEditTextPostModalOpen} onClose={handleClose}>
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
              Edit Post
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <TextField
              label={`What's happening, ${authCtx.userdata.displayName}?`}
              multiline
              rows={5}
              fullWidth
              margin="dense"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </Box>
          <Box display="flex" sx={{ mb: 0.5 }}>
            <PostTags categories={categories} setCategories={setCategories} />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <FormControlLabel
              control={
                <Checkbox
                  checked={markdownCheckbox}
                  onChange={handleMarkdownChange}
                />
              }
              label="Markdown"
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() =>
                editPost(title, description, contentType, content, categories)
              }
              style={{
                color: "black",
                backgroundColor: "white",
                marginTop: "3pt",
                border: "1pt solid #dbdbdb",
                height: "25pt",
              }}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditTextPostModal;
