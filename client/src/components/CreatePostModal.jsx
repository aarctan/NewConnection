import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

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
  if (!isModalOpen) return null;
  const handleClose = () => setIsModalOpen(false);
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
            label="What's happening, Rebecca?"
            multiline
            rows={5}
            variant="filled"
            fullWidth
            margin="dense"
          />

          <Grid container>
            <Grid item xs={6} align="left">
              <Button
                variant="text"
                startIcon={<InsertPhotoIcon />}
                component="label"
              >
                Add a Picture
                <Input accept="image/*" id="upload-image" type="file" />
              </Button>
            </Grid>
            <Grid item xs={6} align="right">
              <Button variant="text" endIcon={<SendIcon />}>
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
