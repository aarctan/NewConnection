import { Box, Typography, Avatar, Stack } from "@mui/material";

export default function SideProfile() {
  return (
    <Box>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Avatar
          alt="Rebecca Sharp"
          src="/static/images/avatars/rebecca.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h6">Rebecca Sharp</Typography>
      </Stack>
    </Box>
  );
}
