import { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import FriendsIcon from "@mui/icons-material/People";
import UnlistedIcon from "@mui/icons-material/InsertLink";
import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";

const PostVisibility = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex" }}>
      <Button
        variant="contained"
        fullWidth
        startIcon={
          (props.visibility === "PUBLIC" && !props.unlisted && (
            <PublicIcon />
          )) ||
          (props.visibility === "FRIENDS" && <FriendsIcon />) ||
          (props.unlisted && <UnlistedIcon />) ||
          (props.visibility === "PRIVATE" && <LockIcon />)
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
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
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
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              py: 0,
            }}
          >
            <Button
              startIcon={<PublicIcon />}
              onClick={() => {
                props.setVisibility("PUBLIC");
                props.setUnlisted(false);
                setAnchorEl(false);
              }}
              endIcon={props.visibility === "PUBLIC" && <CheckIcon />}
            >
              <Typography
                variant="body2"
                sx={{ padding: 0 }}
                style={{ fontSize: "12pt" }}
              >
                Public
              </Typography>
            </Button>

            <Button
              startIcon={<FriendsIcon />}
              endIcon={props.visibility === "FRIENDS" && <CheckIcon />}
              onClick={() => {
                props.setVisibility("FRIENDS");
                props.setUnlisted(false);
                setAnchorEl(false);
              }}
            >
              <Typography
                variant="body2"
                sx={{ padding: 0 }}
                style={{ fontSize: "12pt" }}
              >
                Friends
              </Typography>
            </Button>
            <Button
              startIcon={<UnlistedIcon />}
              endIcon={props.visibility === "Unlisted" && <CheckIcon />}
              onClick={() => {
                props.setVisibility("Unlisted");
                props.setUnlisted(true);
                setAnchorEl(false);
              }}
            >
              <Typography
                variant="body2"
                sx={{ padding: 0 }}
                style={{ fontSize: "12pt" }}
              >
                Unlisted
              </Typography>
            </Button>
            <Button
              startIcon={<LockIcon />}
              endIcon={props.visibility === "PRIVATE" && <CheckIcon />}
              onClick={() => {
                props.setVisibility("PRIVATE");
                props.setUnlisted(false);
                setAnchorEl(false);
              }}
            >
              <Typography
                variant="body2"
                sx={{ padding: 0 }}
                style={{ fontSize: "12pt" }}
              >
                Private
              </Typography>
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default PostVisibility;
