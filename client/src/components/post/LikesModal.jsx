import { Avatar, Modal, Box, Typography, Stack, Link } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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

export default function LikesModal({ isModalOpen, setIsModalOpen, likes }) {
  const handleClose = () => setIsModalOpen(false);
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isModalOpen) return null;

  return (
    <>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={style}
          style={
            small
              ? { width: "90%", height: "70%" }
              : { width: 300, height: 400 }
          }
        >
          <Typography
            id="likes-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            Authors who liked this
          </Typography>

          <Box display="flex" flexDirection="column">
            {likes.map((like, idx) => (
              <Stack alignItems="center" direction="row" spacing={1} key={idx}>
                <Avatar
                  alt="Avatar"
                  src={like.author.profileImage}
                  sx={{ width: 38, height: 38 }}
                />
                <Link component="button" variant="h6" underline="hover">
                  {like.author.displayName}
                </Link>
              </Stack>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
