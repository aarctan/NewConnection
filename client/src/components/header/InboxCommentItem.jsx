import { Box, Typography, Avatar } from "@mui/material";
import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CredentialsContext from "src/store/credentials-context";

const InboxCommentItem = (props) => {
  const item = props.item;
  const navigate = useNavigate();
  const getCredentialsHandler = useContext(CredentialsContext);

  const [followerPic, setFollowerPic] = useState("");
  const [followerName, setFollowerName] = useState("");

  const fetchInbox = useCallback(async () => {
    let credentials = getCredentialsHandler(item.author.host);
    const response = await fetch(`${item.author.id}/`, {
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
      console.log("InboxCommentItem useEffect failed - fetching inbox");
    }
  }, [item.author, getCredentialsHandler]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  let commentText = ` commented: ${item.comment}`;
  if (commentText.length > 25) {
    commentText = commentText.substring(0, 25) + "...";
  }

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
            const words = item.author.id.split("/");
            const word = words[words.length - 1];
            navigate(`/app/author/${word}`, { state: item.author });
          }}
        />
        <Typography variant="body2">
          <b>{followerName}</b>{commentText}
        </Typography>
      </Box>
    </Box>
  );
};

export default InboxCommentItem;
