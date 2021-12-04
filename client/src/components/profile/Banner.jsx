import { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Container,
  Divider,
} from "@mui/material";
import EditProfileModal from "src/components/profile/EditProfileModal";
import FollowersModal from "src/components/profile/FollowersModal";
import CheckIcon from "@mui/icons-material/Check";
import AuthContext from "src/store/auth-context";
import CredentialsContext from "src/store/credentials-context";

// This component is on the user profile page and consists of their profile picture, display name, editprofile/follow button as well as
// post, follower and following counts
const Banner = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followBtnText, setFollowBtnText] = useState("Follow");
  const authCtx = useContext(AuthContext);
  const getCredentialsHandler = useContext(CredentialsContext);
  const [followers, setFollowers] = useState([]);

  // Sends a follow object to the authors inbox
  const sendFollowToInbox = async (e) => {
    let body = {
      type: "Follow",
      summary: `${authCtx.userdata.displayName} wants to follow you`,
      actor: authCtx.userdata,
      object: props.author,
    };
    try {
      let credentials = getCredentialsHandler(props.author.host);
      let url = `${props.author.id}/inbox`;
      // Fix for t26
      if (props.author.host === "https://plurr.herokuapp.com/")
        url = `${props.author.id.replace("/author", "/service/author")}/inbox/`;
      const postResponse = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ` + btoa(credentials),
        },
      });
      if (postResponse.ok) {
        setFollowBtnText("Requested");
      }
    } catch (error) {
      let errorMessage = "Send Follow To Inbox failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  // Unfollows the author
  const stopFollowing = async (e) => {
    try {
      const words = authCtx.userdata.id.split("/");
      const id = words[words.length - 1];
      let credentials = getCredentialsHandler(props.author.host);
      const deleteResponse = await fetch(
        `${props.author.id}/followers/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ` + btoa(credentials),
          },
        }
      );
      if (deleteResponse.ok) {
        props.setFollowing(false);
      }
    } catch (error) {
      let errorMessage = "stop following failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  // Checks if the if from the url matches the logged in user id
  // if it doesnt, we need to check if the logged in user is following the user id from the URL
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        let credentials = getCredentialsHandler(props.author.host);
        let url = `${props.author.id}/followers`;
        // Fix for t26
        if (props.author.host === "https://plurr.herokuapp.com/")
          url = `${props.author.id.replace(
            "/author",
            "/service/author"
          )}/followers/`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Basic ` + btoa(credentials),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFollowers(data["items"]);
        }
      } catch (error) {
        setFollowers([]);
      }
    };

    fetchFollowers();
  }, [props.author.id, props.author.host, getCredentialsHandler]);

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
            borderColor: "gray",
            marginBottom: "3pt",
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
                variant="contained"
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
                onClick={stopFollowing}
              >
                Following
              </Button>
            ) : (
              <Button
                variant="contained"
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
                {followBtnText}
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Typography
          sx={{ cursor: "pointer" }}
          variant="body2"
          fontSize="14pt"
          onClick={() => setIsFollowersModalOpen(true)}
        >
          {`${followers.length} followers`}
        </Typography>
      </Box>
      <Divider />
      {/* Opens modal for user to edit their profile */}
      <EditProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      ></EditProfileModal>
      {/* Opens the followers in a modal to view all followers of the author */}
      <FollowersModal
        isModalOpen={isFollowersModalOpen}
        setIsModalOpen={setIsFollowersModalOpen}
        followers={followers}
      ></FollowersModal>
    </Container>
  );
};

export default Banner;
