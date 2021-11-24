import { Modal, Box, Divider, Button, Typography } from "@mui/material";
import { useContext } from "react";
import AuthContext from "src/store/auth-context";
import CredentialsContext from "src/store/credentials-context";

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

// SharePostModal is a modal that confirms if the user wants to share the selected post.
// This modal is rendered in Post.jsx
const SharePostModal = ({ isShareModalOpen, setIsShareModalOpen, post }) => {
  const authCtx = useContext(AuthContext);
  const getCredentialsHandler = useContext(CredentialsContext);
  const handleClose = () => setIsShareModalOpen(false);

  if (!isShareModalOpen) return null;

  const handleShare = async () => {
    try {
      let body = {
        author: authCtx.userdata,
        title: post.title,
        description: post.description,
        contentType: post.contentType,
        content: post.content,
        source: post.id,
        origin: post.origin,
        categories: post.categories,
        visibility: post.visibility,
        unlisted: post.unlisted,
      };

      // Create the post, a shared post will have different source as you got it from another user
      const shareResponse = await fetch(`${authCtx.userdata.id}/posts/`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
      });
      if (shareResponse.ok) {
        setIsShareModalOpen(false);
        const shareData = await shareResponse.json();
        // if the post is a friends post, we should send this post to the inbox of our followers
        if (shareData.visibility === "FRIENDS") {
          // Get Followers
          const responseFollowers = await fetch(
            `${authCtx.userdata.id}/followers/`
          );
          if (responseFollowers.ok) {
            const data = await responseFollowers.json();
            // Loop through the followers and send them the post to their inbox
            for (let follower of data["items"]) {
              let credentials = getCredentialsHandler(follower.host);
              fetch(`${follower.id}/inbox/`, {
                method: "POST",
                body: JSON.stringify(shareData),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Basic ` + btoa(credentials),
                },
              });
            }
          }
        }
      }
    } catch (error) {
      let errorMessage = "Share post in SharePostModal.jsx failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Modal open={isShareModalOpen} onClose={handleClose}>
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
              {`Share ${post.author.displayName}'s post?`}
            </Typography>
            <Typography
              id="Are-you-sure"
              variant="body2"
              fontSize="11pt"
              color="text.secondary"
            >
              Are you sure you want to share this post?
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
                fontWeight: "bold",
              }}
              onClick={handleShare}
            >
              Share
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

export default SharePostModal;
