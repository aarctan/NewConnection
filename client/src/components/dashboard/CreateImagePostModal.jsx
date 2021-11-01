import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useState, useContext } from "react";
import AuthContext from "src/store/auth-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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
  handlePostSubmit,
}) => {
  const handleClose = () => {
    setIsModalOpen(false);
    setContentType("text/plain");
    setImgPreview("");
    setImgURL("");
  };
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [contentType, setContentType] = useState("text/plain");
  const [imgPreview, setImgPreview] = useState(""); // image url or base64 encoded image
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isModalOpen) return null;

  // https://stackoverflow.com/a/29672957
  const handleCreate = async (e) => {
    const userdata = authCtx.userdata;
    try {
      const postResponse = await fetch(`${userdata.id}/posts/`, {
        method: "POST",
        body: JSON.stringify({
          author: userdata,
          title: title,
          description: description,
          contentType: contentType,
          content: imgURL,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (postResponse.ok) {
        const postData = await postResponse.json();
        handlePostSubmit(e, postData);
        setIsModalOpen(false);
        setContentType("text/plain");
        setImgPreview("");
        setImgURL("");
      } else {
      }
    } catch (error) {
      let errorMessage = "Post failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    setImgPreview(base64);
    setImgURL(base64);
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
          style={
            small
              ? { width: "90%", height: "70%" }
              : { width: 500, height: imgPreview ? "550px" : "400px" }
          }
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
                  setImgURL(e.target.value);
                  setImgPreview(e.target.value);
                  setContentType("text/plain");
                }}
              />
              <Typography id="or" variant="h6" align="center" sx={{ py: 1 }}>
                or
              </Typography>
              <label htmlFor="contained-button-file">
                <Input
                  disabled={imgURL !== ""}
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
                  disabled={imgURL !== ""}
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
                maxHeight: 200,
                border: 0,
                borderRadius: "5px",
                borderColor: "gray",
              }}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
              endIcon={<SendIcon />}
              onClick={handleCreate}
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
