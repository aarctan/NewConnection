import { useContext } from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import AuthContext from "src/store/auth-context";

export default function SideProfile(props) {
  const recentAuthors = props.recentAuthors;
  const authCtx = useContext(AuthContext);
  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Avatar
            alt="Avatar"
            src={authCtx.userdata.profileImage}
            sx={{ width: 56, height: 56 }}
          />
          <Typography variant="h6">{authCtx.userdata.displayName}</Typography>
        </Stack>

        <Typography>Recently joined NewConnection:</Typography>
        {recentAuthors.map(function (author, idx) {
          return (
            <Stack alignItems="center" direction="row" spacing={1}>
              <Avatar
                alt="Avatar"
                src={author.profileImage}
                sx={{ width: 20, height: 20 }}
              />
              <Typography variant="body2" key={idx}>
                {author.displayName}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
