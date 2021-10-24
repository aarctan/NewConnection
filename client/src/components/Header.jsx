import { useContext, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Stack,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Container,
  Hidden,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MailIcon from "@mui/icons-material/Mail";
import Logout from "@mui/icons-material/Logout";
import { makeStyles } from "@mui/styles";
import Search from "src/components/Search";
import AuthContext from "src/store/auth-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles({
  logo: {
    maxWidth: 160,
  },
});

// Header of the app.
// This is rendered in Dashboard.jsx and Profile.jsx
// This component contains a logo, a search input and navigation icons
const Header = () => {
  const classes = useStyles();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLogoutHandler = () => {
    authCtx.logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      elevation={1}
      position="fixed"
      style={{ background: "#FFFFFF", color: "black" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          style={
            small
              ? { justifyContent: "space-between" }
              : { justifyContent: "space-around" }
          }
        >
          <img
            src="/newconnectionlogo.png"
            alt="logo"
            className={classes.logo}
            onClick={() => {
              navigate(`/app/dashboard`);
            }}
            style={{ cursor: "pointer" }}
          />
          <Hidden smDown>
            <Search />
          </Hidden>
          <Box>
            <Stack alignItems="center" direction="row" spacing={1}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar
                  alt="Avatar"
                  src={authCtx.userdata.profileImage}
                  sx={{ width: 28, height: 28 }}
                />
              </IconButton>
            </Stack>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
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
            <MenuItem onClick={onLogoutHandler}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
