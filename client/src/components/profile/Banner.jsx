import { useState, useContext } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Container,
  Divider,
} from "@mui/material";
import EditProfileModal from "src/components/profile/EditProfileModal";
import CheckIcon from "@mui/icons-material/Check";
import AuthContext from "src/store/auth-context";

// This component is on the user profile page and consists of their profile picture, display name, editprofile/follow button as well as
// post, follower and following counts
const Banner = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authCtx = useContext(AuthContext);

  const sendFollowToInbox = async (e) => {
    let body = {
      type: "Follow",
      summary: `${authCtx.userdata.displayName} wants to follow you`,
      actor: authCtx.userdata,
      object: props.author,
    };
    try {
      await fetch(`${props.author.id}/inbox/`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      let errorMessage = "Send Follow To Inbox failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt="60pt"
        mb="20pt"
      >
        <Avatar
          alt="Avatar"
          src={props.author.profileImage}
          sx={{
            width: 135,
            height: 135,
            border: 1,
            marginBottom: "3pt",
            borderColor: "gray",
          }}
        />
        <Typography variant="body1" fontSize="20pt">
          {props.author.displayName}
        </Typography>
        {/* Condiontially render an edit profile button or follow settings */}
        {props.isUser ? (
          <Box>
            <Button
            variant="contained"
              style={{
                color: "black",
                backgroundColor: "white",
                marginTop: "3pt",
                border: "1pt solid #dbdbdb",
                height: "25pt",
              }}
              onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </Button>
          </Box>
        ) : (
          <Box>
            {props.following ? (
              <Button
                style={{
                  color: "black",
                  backgroundColor: "white",
                  marginTop: "3pt",
                  height: "25pt",
                  border: "1pt solid #dbdbdb",
                  width: "80pt",
                }}
                elevation={5}
                endIcon={<CheckIcon />}
              >
                Following
              </Button>
            ) : (
              <Button
                style={{
                  color: "black",
                  backgroundColor: "white",
                  marginTop: "3pt",
                  height: "25pt",
                  border: "1pt solid #dbdbdb",
                  width: "70pt",
                }}
                onClick={sendFollowToInbox}
              >
                Follow
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        marginLeft="15pt"
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Typography variant="body2" fontSize="14pt">
          1 Post
        </Typography>
        <Typography variant="body2" fontSize="14pt">
          5 Followers
        </Typography>
        <Typography variant="body2" fontSize="14pt">
          1 Following
        </Typography>
      </Box>
      <Divider />
      <EditProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      ></EditProfileModal>
    </Container>
  );
};

export default Banner;
