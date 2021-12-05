import { useContext } from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import InboxFollowItem from "./InboxFollowItem";
import InboxLikeItem from "./InboxLikeItem";
import InboxDelete from "./InboxDelete";
import InboxPostItem from "./InboxPostItem";
import InboxCommentItem from "./InboxCommentItem";
import AuthContext from "src/store/auth-context";

// Menu container that takes in a list of inbox items from Header.jsx
const InboxMenu = (props) => {
  const num_items = props.inbox.length;
  const authCtx = useContext(AuthContext);
  return (
    <Menu
      anchorEl={props.anchorEl}
      open={props.menuOpen}
      onClose={props.handleClose}
      PaperProps={{
        elevation: 1,
        sx: {
          width: 400,
          maxHeight: 5 * 55,
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 0.5,
          "& .MuiList-root": {
            paddingTop: 0,
            paddingBottom: 0,
          },
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {props.inbox
        .filter((item) => {
          if (item.type.toLowerCase() === "follow") {
            return true;
          }
          return item.author.id !== authCtx.userdata.id;
        })
        .map((item, idx) => {
          return (
            <MenuItem key={idx} sx={{ height: 55 }}>
              {item.type === "Follow" && (
                <InboxFollowItem item={item}> </InboxFollowItem>
              )}
              {item.type === "Like" && (
                <InboxLikeItem item={item}></InboxLikeItem>
              )}
              {item.type === "post" && (
                <InboxPostItem item={item}></InboxPostItem>
              )}
              {item.type === "comment" && (
                <InboxCommentItem item={item}></InboxCommentItem>
              )}
            </MenuItem>
          );
        })}
      {num_items > 0 && (
        <MenuItem sx={{ height: 40, padding: 0 }}>
          <InboxDelete setInbox={props.setInbox} />
        </MenuItem>
      )}
      {num_items === 0 && (
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            variant: "body2",
            height: 55,
          }}
        >
          No inbox items!
        </Typography>
      )}
    </Menu>
  );
};

export default InboxMenu;
