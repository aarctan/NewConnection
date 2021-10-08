import { Box, Typography, Avatar, Stack } from "@mui/material";

export default function SideProfile() {
  return (
    <Box>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Avatar
          alt="Chad"
          src="/static/images/avatars/chad.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h6">Chad</Typography>
      </Stack>
    </Box>
  );
}
