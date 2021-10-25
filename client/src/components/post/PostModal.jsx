import Modal from "@mui/material/Modal";
import {
  CardContent,
  Box,
  CardActions,
  Typography,
  Paper,
  InputBase,
  Divider,
  Avatar,
} from "@mui/material";
import Comment from "src/components/post/Comment";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 815,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 0,
  borderRadius: "0px",
};

// This is a modal that contains a post and is primarily used for viewing all comments of a post
// This modal is rendered in Post.jsx
const PostModal = ({ isModalOpen, setIsModalOpen, post }) => {
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
        <Box sx={{ ...style, display: "flex" }}>
          {/* Left box to hold image/text */}
          <Box
            component="img"
            sx={{
              height: 600,
              width: 480,
              minWidth: 480,
            }}
            alt="The house from the offer."
            src={post.content}
          />
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Right box to hold comments */}
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fffff",
                  padding: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt="Chad"
                    src={post.profileImage}
                    sx={{ width: 32, height: 32, mx: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight="600"
                  >
                    {post.displayName}
                  </Typography>
                </Box>
                <IconButton aria-label="settings">
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <Divider />
              <CardContent sx={{ py: 1, backgroundColor: "#ffffff" }}>
                {post.comments.map((comment) => (
                  <Comment
                    user={comment.author.displayName}
                    comment={comment.comment}
                  />
                ))}
              </CardContent>
            </Box>
            <Divider />
            <CardActions disableSpacing sx={{ paddingBottom: "5px" }}>
              <IconButton aria-label="add to favorites">
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton aria-label="comment">
                <ChatBubbleOutlineIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
            </CardActions>

            <CardContent sx={{ py: "0px", paddingBottom: 0 }}>
              <Typography
                variant="body2"
                color="text.primary"
                fontWeight="600"
                sx={{ paddingBottom: 2 }}
              >
                8,032 likes
              </Typography>
            </CardContent>
            <Divider />

            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fafafa",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Comment..."
                inputProps={{ "aria-label": "comment" }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton color="primary" sx={{ p: "10px" }} aria-label="send">
                <SendIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PostModal;
