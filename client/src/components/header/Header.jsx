import { useContext, useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Stack,
  Container,
  Hidden,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MailIcon from "@mui/icons-material/MailOutline";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { makeStyles } from "@mui/styles";
import Search from "src/components/header/Search";
import ProfileMenu from "src/components/header/ProfileMenu";
import AuthContext from "src/store/auth-context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import InboxMenu from "./InboxMenu";
import CredentialsContext from "src/store/credentials-context";

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
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const getCredentialsHandler = useContext(CredentialsContext);
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const [inbox, setInbox] = useState([]);

  // ProfileMenu
  const handleProfileClick = (event) => {
    setAnchorProfileEl(event.currentTarget);
  };
  const [anchorProfileEl, setAnchorProfileEl] = useState(null);
  const profileMenuOpen = Boolean(anchorProfileEl);
  const handleProfileClose = () => {
    setAnchorProfileEl(null);
  };
  const onLogoutHandler = () => {
    authCtx.logout();
    navigate("/login", { replace: true });
  };

  // InboxMenu
  const [anchorInboxEl, setAnchorInboxEl] = useState(null);
  const handleInboxClick = (event) => {
    fetchInbox();
    setAnchorInboxEl(event.currentTarget);
  };
  const inboxMenuOpen = Boolean(anchorInboxEl);
  const handleInboxClose = () => {
    setAnchorInboxEl(null);
  };

  // fetch the users inbox
  const fetchInbox = useCallback(async () => {
    let credentials = getCredentialsHandler(authCtx.userdata.host);
    const response = await fetch(`${authCtx.userdata.id}/inbox/`, {
      headers: { Authorization: `Basic ` + btoa(credentials) },
    });
    if (response.ok) {
      const inboxData = await response.json();
      setInbox(inboxData["items"].reverse());
    } else {
      console.log("Header useEffect failed - fetching inbox");
    }
  }, [authCtx, getCredentialsHandler]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  return (
    <AppBar
      elevation={1}
      position="fixed"
      style={{ background: "#FFFFFF", color: "black" }}
    >
      <Container maxWidth="lg">
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
                onClick={() => {
                  navigate(`/app/explore`);
                }}
                size="medium"
                aria-label="show new mail"
                color="inherit"
                sx={{ ml: 2 }}
              >
                <ExploreOutlinedIcon />
              </IconButton>
              <IconButton
                onClick={handleInboxClick}
                size="medium"
                aria-label="show new mail"
                color="inherit"
                sx={{ ml: 2 }}
              >
                <Badge
                  badgeContent={
                    inbox.filter((item) => {
                      if (item.type.toLowerCase() === "follow") {
                        return true;
                      }
                      return item.author.id !== authCtx.userdata.id;
                    }).length
                  }
                  color="error"
                >
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleProfileClick}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar
                  alt="Avatar"
                  src={authCtx.userdata.profileImage}
                  sx={{ width: 28, height: 28, border: 1, borderColor: "gray" }}
                />
              </IconButton>
            </Stack>
          </Box>
          <ProfileMenu
            anchorEl={anchorProfileEl}
            menuOpen={profileMenuOpen}
            handleClose={handleProfileClose}
            handleLogout={onLogoutHandler}
          />
          <InboxMenu
            anchorEl={anchorInboxEl}
            menuOpen={inboxMenuOpen}
            handleClose={handleInboxClose}
            inbox={inbox}
            setInbox={setInbox}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
