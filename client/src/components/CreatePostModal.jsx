import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  styled,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

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

const Input = styled("input")({
  display: "none",
});

const CreatePostModal = ({ isModalOpen, setIsModalOpen }) => {
  const handleClose = () => setIsModalOpen(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");
  if (!isModalOpen) return null;
  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
            label="What's happening, Rebecca?"
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
              <Button variant="text" endIcon={<SendIcon />} align="center">
                Post
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default CreatePostModal;
