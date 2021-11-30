import Modal from "@mui/material/Modal";
import {
  CardContent,
  Box,
  Typography,
  Divider,
  Avatar,
  Stack,
  CardMedia,
} from "@mui/material";
import Comment from "src/components/post/Comment";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
            {post.contentType === "text/markdown" && (
              <CardContent sx={{ ml: 1 }}>
                <ReactMarkdown
                  children={post.content}
                  remarkPlugins={[remarkGfm]}
                />
              </CardContent>
            )}
            {/* Conditionally render content based on content type */}
            {post.contentType === "text/plain" &&
            post.content.slice(0, 4) === "http" ? (
              /* Render an image if it is a hyperlink */
              <CardContent
                sx={{
                  display: "flex",
                  padding: 0,
                  paddingBottom: 0,
                }}
                style={{ paddingBottom: "0px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    style={{
                      padding: 0,
                      margin: 0,
                      maxHeight: 500,
                      maxWidth: "100%",
                      width: "auto",
                    }}
                    image={post.content}
                    alt="selfie"
                  />
                </div>
              </CardContent>
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
                    // T16 had a 'unique' way of sending back imaghes :)
                    src={
                      post.author.host === "https://i-connect.herokuapp.com"
                        ? `data:${post.contentType},${post.content}`
                        : post.content
                    }
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
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PostModal;
