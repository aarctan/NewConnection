import { useContext } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import AuthContext from "src/store/auth-context";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#EDECEC",
  },
  buttonContainer: {
    textAlign: "center",
  },
  cardContent: {
    padding: theme.spacing(3),
  },
}));

const CreateNewPostContainer = (props) => {
  const classes = useStyles();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Card elevation={3} sx={{ paddingBottom: 0, backgroundColor: "EDECEC" }}>
      <CardContent
        className={classes.cardContent}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Avatar
          alt="Avatar"
          src={authCtx.userdata.profileImage}
          sx={{ width: 56, height: 56, marginRight: 1.5, cursor: "pointer" }}
          onClick={() => {
            const words = authCtx.userdata.id.split("/");
            const word = words[words.length - 1];
            navigate(`/app/author/${word}`, { state: authCtx.userdata });
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            px: 1,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: "15px",
              justifyContent: "center",
              backgroundColor: "#eeeeee",
              marginBottom: 1.3,
            }}
            fullWidth
            onClick={() => props.setIsModalOpen(true)}
          >
            <Typography>Write a text post</Typography>
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: "15px",
              justifyContent: "center",
              backgroundColor: "#eeeeee",
            }}
            fullWidth
          >
            <Typography>Upload an image</Typography>
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateNewPostContainer;
