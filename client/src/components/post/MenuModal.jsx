import { Modal, Box, Divider, Button } from "@mui/material";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300pt",
  height: "90pt",
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 0.5,
  borderRadius: "8px",
};

// This modal opens up a menu when the user clicks on the 3 dots in the top right corner of a post.
// Menu is conditionally rendered based on if the user is the author of the post or not.
// This modal is rendered in Post.jsx
const MenuModal = ({ isMenuOpen, setIsMenuOpen, setIsDeleteModalOpen }) => {
  const handleClose = () => setIsMenuOpen(false);
  if (!isMenuOpen) return null;

  return (
    <>
      <Modal open={isMenuOpen} onClose={handleClose}>
        <Box sx={style}>
          <Button
            variant="outlined"
            sx={{
              justifyContent: "center",
              backgroundColor: "white",
              color: "red",
              fontWeight: "bold",
            }}
            fullWidth
            onClick={() => {
              handleClose();
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Divider />
          <Button
            variant="outlined"
            sx={{
              justifyContent: "center",
              backgroundColor: "white",
            }}
            fullWidth
          >
            Edit
          </Button>
          <Divider />
          <Button
            variant="outlined"
            sx={{
              justifyContent: "center",
              backgroundColor: "white",
            }}
            fullWidth
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default MenuModal;
