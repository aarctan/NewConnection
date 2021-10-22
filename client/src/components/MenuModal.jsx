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

const MenuModal = ({ isModalOpen, setIsModalOpen }) => {
  const handleClose = () => setIsModalOpen(false);

  if (!isModalOpen) return null;

  return (
    <>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <Button
            variant="outlined"
            sx={{
              justifyContent: "center",
              backgroundColor: "white",
              color: "red",
            }}
            fullWidth
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
