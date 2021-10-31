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
  const handleClose = () => setIsModalOpen(false);
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
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
          content: imageURL,
        }),
        headers: {
          "Content-Type": "application/json",
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

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
  };

  const convertBase64 = (file) => {
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
              : { width: 500, height: 450 }
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
            <TextField
              label={`Image URL`}
              fullWidth
              margin="dense"
              onChange={(e) => {
                setImageURL(e.target.value);
              }}
            />
            <Typography id="or" variant="h6" align="center" sx={{ py: 1 }}>
              -OR-
            </Typography>
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleFileRead}
              />
              <Button
                variant="contained"
                component="span"
                style={{
                  color: "black",
                  border: "1pt solid #dbdbdb",
                  height: "25pt",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Upload Image
              </Button>
            </label>
          </Box>
          <Box display="flex" justifyContent="flex-end">
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
