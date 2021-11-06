import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import FriendsIcon from "@mui/icons-material/People";
import UnlistedIcon from "@mui/icons-material/InsertLink";
import CheckIcon from "@mui/icons-material/Check";

const PostVisibility = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex" }}>
      <Button
        variant="contained"
        fullWidth
        startIcon={
          (props.visibility === "Public" && <PublicIcon />) ||
          (props.visibility === "Friends" && <FriendsIcon />) ||
          (props.visibility === "Unlisted" && <UnlistedIcon />)
        }
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        sx={{ width: "80pt" }}
        style={{
          color: "black",
          backgroundColor: "white",
          marginTop: "3pt",
          border: "1pt solid #dbdbdb",
          height: "25pt",
        }}
      >
        {props.visibility}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box display="flex" flexDirection="column" sx={{ p: 1 }}>
          <Typography
            id="visibility-popover"
            variant="body2"
            align="center"
            sx={{ padding: 1 }}
          >
            Who should see this?
          </Typography>
          <Box
            sx={{
              mx: 1,
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "left",
              py: 0,
            }}
          >
            <Stack alignItems="center" direction="column" spacing={0}>
              <Divider />
              <Button
                startIcon={<PublicIcon />}
                onClick={() => {
                  props.setVisibility("Public");
                }}
                endIcon={props.visibility === "Public" && <CheckIcon />}
              >
                {" "}
                <Typography
                  variant="body2"
                  sx={{ padding: 0 }}
                  style={{ fontSize: "12pt" }}
                >
                  Public
                </Typography>
              </Button>
              <Divider />
              <Button
                startIcon={<FriendsIcon />}
                endIcon={props.visibility === "Friends" && <CheckIcon />}
                onClick={() => {
                  props.setVisibility("Friends");
                }}
              >
                {" "}
                <Typography
                  variant="body2"
                  sx={{ padding: 0 }}
                  style={{ fontSize: "12pt" }}
                >
                  Friends
                </Typography>
              </Button>
              <Divider />
              <Button
                startIcon={<UnlistedIcon />}
                endIcon={props.visibility === "Unlisted" && <CheckIcon />}
                onClick={() => {
                  props.setVisibility("Unlisted");
                }}
              >
                {" "}
                <Typography
                  variant="body2"
                  sx={{ padding: 0 }}
                  style={{ fontSize: "12pt" }}
                >
                  Unlisted
                </Typography>
              </Button>
            </Stack>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default PostVisibility;
