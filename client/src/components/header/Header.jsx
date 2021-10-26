import { useContext, useState } from "react";
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
import MailIcon from "@mui/icons-material/Mail";
import { makeStyles } from "@mui/styles";
import Search from "src/components/header/Search";
import ProfileMenu from "src/components/header/ProfileMenu";
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
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Props for ProfileMenu
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLogoutHandler = () => {
    authCtx.logout();
    navigate("/login", { replace: true });
  };

  const navigate = useNavigate();

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
          <ProfileMenu
            anchorEl={anchorEl}
            profileMenuOpen={profileMenuOpen}
            handleClose={handleClose}
            handleLogout={onLogoutHandler}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
