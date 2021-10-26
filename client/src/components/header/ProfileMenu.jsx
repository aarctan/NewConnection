import { useContext } from "react";
import { Avatar, Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import AuthContext from "src/store/auth-context";
import { useNavigate } from "react-router-dom";

const ProfileMenu = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Menu
      anchorEl={props.anchorEl}
      open={props.profileMenuOpen}
      onClose={props.handleClose}
      onClick={props.handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          width: 150,
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
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
      <MenuItem
        onClick={() => {
          const words = authCtx.userdata.id.split("/");
          const word = words[words.length - 1];
          navigate(`/app/author/${word}`, { state: authCtx.userdata });
        }}
      >
        <Avatar /> Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={props.handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
