import { Menu, Typography } from "@mui/material";

// Menu container that takes in a list of inbox items from Header.jsx
const InboxMenu = (props) => {
  return (
    <Menu
      anchorEl={props.anchorEl}
      open={props.menuOpen}
      onClose={props.handleClose}
      onClick={props.handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          width: 400,
          height: 360,
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 0.5,
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
      <Typography>{props.inbox}</Typography>
    </Menu>
  );
};

export default InboxMenu;