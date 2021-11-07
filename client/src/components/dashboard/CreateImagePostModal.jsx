import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PostTags from "./createpost/PostTags";

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

const CreateImagePostModal = ({
  isModalOpen,
  setIsModalOpen,
  handleCreate,
}) => {
  const handleClose = () => {
    setIsModalOpen(false);
    setContentType("text/plain");
    setImgPreview("");
    setContent("");
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("text/plain");
  const [imgPreview, setImgPreview] = useState(""); // image url or base64 encoded image
  const [categories, setCategories] = useState([]);
  // const [visibility, setVisibility] = useState("PUBLIC");
  // const [unlisted, setUnlisted] = useState(false);
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isModalOpen) return null;

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
          <Box display="flex" flexDirection="column" alignItems="center">
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
          <Box display="flex" justifyContent="center" mt={1.5}>
            <Button
              endIcon={<SendIcon />}
              onClick={() =>
                handleCreate(
                  title,
                  description,
                  contentType,
                  content,
                  categories,
                  "PUBLIC",
                  false
                )
              }
              variant="contained"
              style={{
                color: "black",
                border: "1pt solid #dbdbdb",
                height: "25pt",
                justifyContent: "center",
                alignItems: "center",
                width: "80pt",
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

export default CreateImagePostModal;
