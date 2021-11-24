import {
  Avatar,
  Modal,
  MenuList,
  Typography,
  Box,
  Divider,
  MenuItem,
  Link,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 20,
  borderRadius: "8px",
};

const LikesModal = ({ isModalOpen, setIsModalOpen, likes }) => {
  const handleClose = () => setIsModalOpen(false);
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={style}
          style={
            small
              ? { width: "90%", height: "70%" }
              : { width: 350, height: 350 }
          }
        >
          <Typography
            id="likes-modal-title"
            variant="h6"
            component="h2"
            align="center"
            sx={{ padding: 1 }}
          >
            Likes
          </Typography>
          <Divider />
          <MenuList display="flex" flexdirection="column">
            {likes.map((like, idx) => {
              return (
                <MenuItem key={idx} sx={{ height: 55 }}>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        alt="Avatar"
                        src={like.author.profileImage}
                        sx={{
                          width: 38,
                          height: 38,
                          marginRight: 1,
                          cursor: "pointer",
                          border: 1,
                          borderColor: "gray",
                        }}
                        onClick={() => {
                          const words = like.author.id.split("/");
                          const word = words[words.length - 1];
                          navigate(`/app/author/${word}`, {
                            state: like.author,
                          });
                        }}
                      />
                      <Link
                        component="button"
                        variant="body2"
                        underline="hover"
                        fontWeight="600"
                        sx={{ marginRight: 1 }}
                        onClick={() => {
                          const words = like.author.id.split("/");
                          const word = words[words.length - 1];
                          navigate(`/app/author/${word}`, {
                            state: like.author,
                          });
                        }}
                      >
                        {like.author.displayName}
                      </Link>
                    </Box>
                  </Box>
                </MenuItem>
              );
            })}
          </MenuList>
        </Box>
      </Modal>
    </>
  );
};

export default LikesModal;
