import { useContext } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import AuthContext from "src/store/auth-context";
import SettingsIcon from "@mui/icons-material/Settings";

const Banner = (props) => {
  const authCtx = useContext(AuthContext);
  return (
    <>
      <Box display="flex" mx="30%" mt="85px" mb="45px">
        <Avatar
          alt="Avatar"
          src={authCtx.userdata.profileImage}
          sx={{ width: 135, height: 135, marginRight: 12 }}
        />
        <Box>
          <Box display="flex" alignItems="flex-start">
            <Typography variant="body1" fontSize="20pt">
              {authCtx.userdata.displayName}
            </Typography>
            <Button
              style={{
                color: "black",
                marginLeft: "20pt",
                marginTop: "3pt",
                border: "1pt solid #dbdbdb",
                height: "25pt",
              }}
            >
              Edit Profile
            </Button>
            <IconButton
              color="inherit"
              size="small"
              sx={{ ml: 2, marginTop: "2pt" }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
          <Box
            display="flex"
            alignItems="flex-start"
            sx={{ marginTop: "15pt" }}
          >
            <Typography variant="body2" fontSize="14pt">
              1 post
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mx: "30%" }} />
    </>
  );
};

export default Banner;
