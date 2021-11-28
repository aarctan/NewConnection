import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useState, useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PostTags from "src/components/dashboard/createpost/PostTags";
import AuthContext from "src/store/auth-context";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 3,
  borderRadius: "8px",
};

const Input = styled("input")({
  display: "none",
});

const EditImagePostModal = ({
  isEditImagePostModalOpen,
  setIsEditImagePostModalOpen,
  post,
  handleEdit,
}) => {
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [content, setContent] = useState(post.content);
  const [categories, setCategories] = useState([...post.categories]);
  const [contentType, setContentType] = useState(post.contentType);
  const [imgPreview, setImgPreview] = useState(""); // image url or base64 encoded image
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isEditImagePostModalOpen) return null;

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    setImgPreview(base64);
    setContent(base64);
  };

  const convertBase64 = (file) => {
    setContentType(`${file.type};base64`);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
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
        setIsEditImagePostModalOpen(false);
      }
    } catch (error) {
      let errorMessage = "Edit Image Post failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  const handleClose = () => {
    setTitle(post.title);
    setDescription(post.description);
    setContent(post.content);
    setContentType(post.contentType);
    setCategories([...post.categories]);
    setImgPreview("");
    setContent("");
    setIsEditImagePostModalOpen(false);
  };

  return (
    <>
      <Modal open={isEditImagePostModalOpen} onClose={handleClose}>
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
              Edit post
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
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
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <TextField
                label={`Image URL`}
                margin="dense"
                sx={{
                  width: "60%",
                }}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setImgPreview(e.target.value);
                  setContentType("text/plain");
                }}
              />
              <Typography id="or" variant="h6" align="center" sx={{ py: 1 }}>
                or
              </Typography>
              <label htmlFor="contained-button-file">
                <Input
                  disabled={content !== ""}
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  style={{
                    width: "40%",
                  }}
                  onChange={handleFileRead}
                />
                <Button
                  disabled={content !== ""}
                  variant="contained"
                  component="span"
                  sx={{
                    width: "40%",
                  }}
                  style={{
                    color: "black",
                    border: "1pt solid #dbdbdb",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Upload Image
                </Button>
              </label>
            </Box>
            <img
              alt=""
              src={imgPreview}
              style={{
                marginTop: 5,
                maxHeight: 200,
                border: 0,
                borderRadius: "5px",
                borderColor: "gray",
              }}
            />
          </Box>
          <PostTags categories={categories} setCategories={setCategories} />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Button
              endIcon={<SendIcon />}
              onClick={() =>
                editPost(title, description, contentType, content, categories)
              }
              variant="contained"
              style={{
                color: "black",
                border: "1pt solid #dbdbdb",
                height: "25pt",
                marginTop: "3pt",
                justifyContent: "center",
                alignItems: "center",
                width: "80pt",
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

export default EditImagePostModal;
