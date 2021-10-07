import * as React from "react";
import { useState } from "react";
import { Card, CardContent, Box, Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SideProfile from "./SideProfile";
import CreatePostModal from "./CreatePostModal";

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

const Feed = () => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box display="flex" mx="20%" my="1%">
      <Grid container spacing={4} justifyContent="flex-start">
        <Grid item xs={8}>
          <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  justifyContent: "flex-start",
                  backgroundColor: "#eaeaea",
                }}
                fullWidth
                onClick={() => setIsModalOpen(true)}
              >
                What's happening?
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid display="flex" alignItems="center" item xs={4}>
          <SideProfile />
        </Grid>
      </Grid>
      <CreatePostModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      ></CreatePostModal>
    </Box>
  );
};

export default Feed;
