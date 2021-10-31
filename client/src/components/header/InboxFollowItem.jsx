import {
  Box,
  Button,
  Typography,
  Avatar,
} from "@mui/material";

import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

const InboxFollowItem = (props) => {
  const item = props.item;
  const navigate = useNavigate();

  const [followerPic, setFollowerPic] = useState("");
  const [followerName, setFollowerName] = useState("");

  const fetchInbox = useCallback(async () => {
    const response = await fetch(`${item.actor.id}/`);
    if (response.ok) {
      const data = await response.json();
      setFollowerPic(data["profileImage"]);
      setFollowerName(data["displayName"]);
    } else {
      console.log("InboxFollowItem useEffect failed - fetching inbox");
    }
  }, [item.actor.id]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const acceptFriendReq = async (e) => {
    const actor_url = item.actor.id.split("/");
    const actor_id = actor_url[actor_url.length - 1];
    const putResponse = await fetch(
      `${item.object.id}/followers/${actor_id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (putResponse.ok) {
      // disable accept button
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
          sx={{ width: 17, height: 17, marginRight: 1, cursor: "pointer" }}
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

      <Box
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
        
          disabled={false}
          variant="contained"
          style={{
            color: "black",
            marginTop: "3pt",
            border: "1pt solid #dbdbdb",
            height: "25pt",
            float: "right",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={acceptFriendReq}
        >
          <Typography variant="body2">Accept</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default InboxFollowItem;
