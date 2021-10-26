import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const API_URL = process.env.REACT_APP_API_URL;

// This is a input component used to search for users
// This component is rendered in the Header.jsx file
const SearchTab = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${API_URL}/authors/`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAuthors(data.items);
      })
      .catch((error) => console.log("Dashboard useEffect", error));
  }, []);

  return (
    <Autocomplete
      style={{
        width: "200pt",
        marginLeft: "24pt",
        marginRight: "16pt",
      }}
      size="small"
      freeSolo
      options={authors}
      getOptionLabel={(option) => option.displayName}
      onChange={(e, value) => {
        const words = value.id.split("/");
        const word = words[words.length - 1];
        navigate(`/app/author/${word}`, { state: value });
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
              padding: "1pt 8pt",
              width: "100%",
            },
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchTab;
