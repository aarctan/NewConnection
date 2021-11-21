import {
  Avatar,
  Box,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";

const cardColorMap = { PushEvent: "#DCFEE5" };

const GithubEvent = (props) => {
  console.log(props.event);
  const eventType = props.event.type;
  let eventTitle = "";
  let content = "";

  if (eventType === "PushEvent") {
    eventTitle = "Pushed";
    content = props.event.payload.commits[0].message;
  }

  return (
    <Card elevation={3} sx={{ my: "25px" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: cardColorMap[eventType],
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="author"
              src={props.event.actor.avatar_url}
              sx={{
                width: 38,
                height: 38,
                marginRight: 2,
                border: 1,
                borderColor: "gray",
              }}
              style={{ cursor: "pointer" }}
            />
            <Stack direction="column" spacing={0}>
              <Typography variant="body1" color="text.primary" fontWeight="600">
                {eventTitle}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="10pt"
              >
                Repository:{" "}
                <Link
                  component="button"
                  underline="hover"
                  target="_blank"
                  to="http://www.google.com"
                >
                  {props.event.repo.name}
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </CardContent>
      <CardContent
        sx={{
          backgroundColor: cardColorMap[eventType],
        }}
      >
        <Typography variant="body1" color="text.primary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GithubEvent;
