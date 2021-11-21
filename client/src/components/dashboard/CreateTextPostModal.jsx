import { useState, useContext } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AuthContext from "src/store/auth-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import PostTags from "./createpost/PostTags";
import PostVisibility from "./createpost/PostVisibility";
import PostFriendSelect from "./createpost/PostFriendSelect";

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

const CreateTextPostModal = ({ isModalOpen, setIsModalOpen, handleCreate }) => {
  const handleClose = () => setIsModalOpen(false);
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [unlisted, setUnlisted] = useState(false);
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isModalOpen) return null;

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
          <Box display="flex" flexDirection="column">
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
              label={`What's happening, ${authCtx.userdata.displayName}?`}
              multiline
              rows={5}
              fullWidth
              margin="dense"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </Box>

          <PostTags categories={categories} setCategories={setCategories} />

          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <PostVisibility
                visibility={visibility}
                setVisibility={setVisibility}
                unlisted={unlisted}
                setUnlisted={setUnlisted}
              />
              {visibility === "PRIVATE" && <PostFriendSelect />}
            </Box>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() =>
                handleCreate(
                  title,
                  description,
                  "text/plain",
                  content,
                  categories,
                  visibility,
                  unlisted
                )
              }
              style={{
                color: "black",
                backgroundColor: "white",
                marginTop: "3pt",
                border: "1pt solid #dbdbdb",
                height: "25pt",
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

export default CreateTextPostModal;
