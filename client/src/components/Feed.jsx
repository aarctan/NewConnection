import * as React from "react";
import { Card, CardContent, Stack, Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
    <Box>
      <Grid display="flex" container spacing={2}>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
              <Stack spacing={0.5}>
                <h1>hello</h1>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Feed;
