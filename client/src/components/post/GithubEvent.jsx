import {
  Avatar,
  Box,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const cardColorMap = { PushEvent: "#DCFEE5", IssuesEvent: "#e6dcf9" };

const GithubEvent = (props) => {
  const eventType = props.event.type;
  let eventTitle = "";
  let content = "";

  if (eventType === "PushEvent") {
    eventTitle = "Pushed";
    content = props.event.payload.commits[0].message;
  } else if (eventType === "IssuesEvent") {
    const action = props.event.payload.action;
    eventTitle = action.charAt(0).toUpperCase() + action.slice(1);
    eventTitle += " an issue";
    content = props.event.payload.issue.title;
  }

  const currDate = new Date();
  const postDate = new Date(props.event.created_at);
  const days_ago = Math.floor((currDate - postDate) / 86400000);
  let days_ago_text = `${days_ago} days ago`;
  if (days_ago === 0) {
    days_ago_text = "today";
  } else if (days_ago === 1) {
    days_ago_text = "yesterday";
  }
  const posted_time = formatAMPM(postDate);

  return (
    <Card elevation={3} sx={{ my: "10pt" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
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
          mt: "-15pt",
          backgroundColor: cardColorMap[eventType],
        }}
      >
        <Typography variant="body1" color="text.primary">
          {content}
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          mt: "-15pt",
          mb: "-5pt",
          backgroundColor: cardColorMap[eventType],
        }}
      >
        <Stack display="flex" direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" color="text.secondary" fontSize="9pt">
            GitHub event {days_ago_text} at {posted_time}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GithubEvent;
