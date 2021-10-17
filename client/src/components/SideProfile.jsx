import { Box, Card, Typography, Avatar, Stack } from "@mui/material";

export default function SideProfile(props) {
  const recentAuthors = props.recentAuthors;
  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Avatar
            alt="Chad"
            src="/static/images/avatars/chad.jpg"
            sx={{ width: 56, height: 56 }}
          />
          <Typography variant="h6">Gigachad</Typography>
        </Stack>

        <Typography variant="body2">Recently joined NewConnection</Typography>
        {recentAuthors.map(function (author, idx) {
          return <Typography variant="body2">{author.displayName}</Typography>;
        })}
      </Stack>
    </Box>
  );
}
