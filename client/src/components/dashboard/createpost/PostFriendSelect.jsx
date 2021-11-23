import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { useEffect, useState, useContext } from "react";

import AuthContext from "src/store/auth-context";

// This is a input component used to search for users
// This component is rendered in the Header.jsx file
const PostFriendSelect = (props) => {
  const [followers, setFollowers] = useState([]);
  const authCtx = useContext(AuthContext);

  // Checks if the if from the url matches the logged in user id
  // if it doesnt, we need to check if the logged in user is following the user id from the URL
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(`${authCtx.userdata.id}/followers`);
        if (response.ok) {
          const data = await response.json();
          setFollowers(data["items"]);
        }
      } catch (error) {
        setFollowers([]);
      }
    };

    fetchFollowers();
  }, [authCtx.userdata.id]);

  return (
    <Box sx={{ display: "flex" }}>
      <Autocomplete
        size="small"
        style={{
          width: "120pt",
          marginLeft: "8pt",
          marginRight: "16pt",
          marginTop: "5pt",
        }}
        options={followers}
        getOptionLabel={(option) => option.displayName}
        onChange={(e, value) => {
          try {
            props.setPrivateReceiver(value);
          } catch (error) {}
        }}
        renderInput={(params) => (
          <TextField
            style={{
              border: "solid 1pt #f2f2f2",
              borderRadius: "5pt",
              backgroundColor: "#f0f0f0",
            }}
            {...params}
            placeholder="Search"
            InputProps={{
              style: {
                padding: "0pt 4pt",
                width: "100%",
              },
              ...params.InputProps,
            }}
          />
        )}
      />
    </Box>
  );
};

export default PostFriendSelect;
