import { Box, Typography, Avatar, Stack } from "@mui/material";
import { useContext } from "react";
import AuthContext from "src/store/auth-context";

export default function SideProfile() {
  const authCtx = useContext(AuthContext);

  return (
    <Box>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Avatar
          alt="Chad"
          src="/static/images/avatars/chad.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h6">{authCtx.userdata.displayName}</Typography>
      </Stack>
    </Box>
  );
}
