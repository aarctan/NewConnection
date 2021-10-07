import * as React from "react";
import { Card, CardContent, Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SideProfile from "./SideProfile";

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
  hr: {
    backgroundColor: "#000000",
    height: "1px",
  },
}));

const Feed = () => {
  const classes = useStyles();
  return (
    <Box display="flex" mx="20%" my="1%">
      <Grid container spacing={4} justifyContent="flex-start">
        <Grid item xs={8}>
          <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
              <h1>Placeholder</h1>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <SideProfile />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Feed;
