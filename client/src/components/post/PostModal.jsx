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
  Stack,
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
  minHeight: 400,
  maxHeight: 600,
  bgcolor: "background.paper",
  boxShadow: 20,
  borderRadius: "0px",
};

// This is a modal that contains a post and is primarily used for viewing all comments of a post
// This modal is rendered in Post.jsx
const PostModal = ({ isModalOpen, setIsModalOpen, post, comments }) => {
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
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 480,
              minWidth: 480,
              borderRight: 1,
              borderColor: "#0000001f",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: 56,
              }}
            >
              <Stack direction="column" sx={{ marginLeft: 2 }}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight="600"
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize="10pt"
                >
                  {post.description}
                </Typography>
              </Stack>
            </Box>
            <Divider />
            {/* Conditionally render content based on content type */}
            {post.contentType === "text/plain" &&
            post.content.slice(0, 4) === "http" ? (
              /* Render an image if it is a hyperlink */
              <Box
                sx={{ display: "flex", justifyContent: "center", padding: 0 }}
              >
                <img
                  style={{
                    maxHeight: 500,
                    maxWidth: "100%",
                    width: "auto",
                  }}
                  image={post.content}
                  alt=""
                />
              </Box>
            ) : (
              /* Render text */
              post.contentType === "text/plain" && (
                <Box sx={{ marginLeft: 2, marginTop: 2 }}>
                  <Typography variant="body1" color="text.primary">
                    {post.content}
                  </Typography>
                </Box>
              )
            )}
            {/* Renders an image */}
            {post.contentType.includes("base64") && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <Box sx={{ padding: 0, margin: 0 }}>
                  <img
                    style={{
                      maxHeight: 500,
                      maxWidth: "100%",
                      width: "auto",
                    }}
                    src={post.content}
                    alt=""
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* Right box to hold comments */}
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              maxHeight: 600,
            }}
          >
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
                {/* Box containing avatar, displayName and horizantal icon */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt="Chad"
                    src={post.author.profileImage}
                    sx={{
                      width: 32,
                      height: 32,
                      mx: 1,
                      border: 1,
                      borderColor: "gray",
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight="600"
                  >
                    {post.author.displayName}
                  </Typography>
                </Box>
                <IconButton aria-label="settings">
                  <MoreHorizIcon />
                </IconButton>
              </Box>

              <Divider />

              {/* Card content that displays all of the comments on the post */}
              <Box sx={{ py: 1, px: 1.5, overflow: "auto", maxHeight: 350 }}>
                {comments.map((comment) => (
                  <Comment author={comment.author} comment={comment.comment} />
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Box containing like button and amount if likes */}
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

            {/* Hold the comment input base */}
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
