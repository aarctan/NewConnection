import { Modal, Box, Divider, Button, Typography } from "@mui/material";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300pt",
  height: "150pt",
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 0,
  borderRadius: "8px",
};

// DeletePostModal is a modal that confirms if the user wants to delete the selected post.
// This modal is only shown to authors of the post.
// This modal is rendered in Post.jsx
const DeletePostModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  post,
  handleRemove,
}) => {
  const handleClose = () => setIsDeleteModalOpen(false);

  if (!isDeleteModalOpen) return null;

  const handleDelete = async (e) => {
    try {
      const deletePost = await fetch(`${post.id}/`, {
        method: "DELETE",
      });
      if (deletePost.ok) {
        handleRemove(post.id);
        setIsDeleteModalOpen(false);
      } else {
      }
    } catch (error) {
      let errorMessage = "Delete failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Modal open={isDeleteModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="80pt"
          >
            <Typography
              id="Delete-Post"
              variant="h5"
              fontSize="14pt"
              marginBottom="5pt"
            >
              Delete Post?
            </Typography>
            <Typography
              id="Are-you-sure"
              variant="body2"
              fontSize="11pt"
              color="text.secondary"
            >
              Are you sure you want to delete this post?
            </Typography>
          </Box>
          <Divider />
          <Divider />
          <Box display="flex" flexDirection="column" flexWrap="wrap">
            <Button
              variant="outlined"
              fullWidth
              sx={{
                height: "35pt",
                justifyContent: "center",
                color: "red",
                fontWeight: "bold",
              }}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Divider />
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                handleClose();
              }}
              sx={{
                height: "35pt",
                justifyContent: "center",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeletePostModal;
