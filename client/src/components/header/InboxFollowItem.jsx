import { Box, Button, Typography, Avatar } from "@mui/material";
import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import CredentialsContext from "src/store/credentials-context";

const InboxFollowItem = (props) => {
  const item = props.item;
  const getCredentialsHandler = useContext(CredentialsContext);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [followerPic, setFollowerPic] = useState("");
  const [followerName, setFollowerName] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Gets info about the author sending the inbox item
  const fetchActor = useCallback(async () => {
    let credentials = getCredentialsHandler(item.actor.host);
    let url = `${item.actor.id}/`;
    // Fix for t26
    if (item.actor.host === "https://plurr.herokuapp.com/")
      url = `${item.actor.id.replace("/author", "/service/author")}/`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ` + btoa(credentials),
      },
    });
    if (response.ok) {
      const data = await response.json();
      setFollowerPic(data["profileImage"]);
      setFollowerName(data["displayName"]);
    } else {
      console.log("InboxFollowItem useEffect failed - fetching inbox");
    }
  }, [item.actor, getCredentialsHandler]);

  useEffect(() => {
    fetchActor();
  }, [fetchActor]);

  // Determines if author sending the follow request is a follower already, if so, make the button disabled and 'Accepted'
  useEffect(() => {
    const fetchIsFollower = async () => {
      try {
        const words = item.actor.id.split("/");
        const actorID = words[words.length - 1];
        const response = await fetch(
          `${authCtx.userdata.id}/followers/${actorID}/`
        );
        if (response.ok) {
          const data = await response.json();
          setButtonDisabled(data === "true" ? true : false);
        }
      } catch (error) {
        setButtonDisabled(false);
      }
    };
    fetchIsFollower();
  }, [authCtx.userdata.id, item.actor.id]);

  // Called when the user clicks the 'Accept' button
  // Adds the author to the users followers
  const acceptFriendReq = async (e) => {
    const actor_url = item.actor.id.split("/");
    const actor_id = actor_url[actor_url.length - 1];
    const putResponse = await fetch(
      `${item.object.id}/followers/${actor_id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
      }
    );
    if (putResponse.ok) {
      setButtonDisabled(true);
    }
  };

  return (
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
          src={followerPic}
          sx={{
            width: 17,
            height: 17,
            marginRight: 1,
            cursor: "pointer",
            border: 1,
            borderColor: "gray",
          }}
          onClick={() => {
            const words = item.actor.id.split("/");
            const word = words[words.length - 1];
            navigate(`/app/author/${word}`, { state: item.actor });
          }}
        />
        <Typography variant="body2">
          <b>{followerName}</b> wants to follow you
        </Typography>
      </Box>

      <Button
        disabled={buttonDisabled}
        variant="contained"
        style={{
          color: "black",
          border: "1pt solid #dbdbdb",
          height: "25pt",
          float: "right",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={acceptFriendReq}
      >
        {buttonDisabled ? "Accepted" : "Accept"}
      </Button>
    </Box>
  );
};

export default InboxFollowItem;
