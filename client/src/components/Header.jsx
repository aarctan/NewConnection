import * as React from "react";
import { AppBar, Box, Toolbar, IconButton, Badge } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import { makeStyles } from "@mui/styles";

import Search from "src/components/Search";

const useStyles = makeStyles({
  logo: {
    maxWidth: 160,
  },
});

const Header = () => {
  const menuId = "primary-search-account-menu";
  const classes = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={1}
        position="fixed"
        style={{ background: "#FFFFFF", color: "black" }}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mx: "15%",
          }}
        >
          <img
            src="/newconnectionlogo.png"
            alt="logo"
            className={classes.logo}
          />
          <Search/>
          <Box>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
