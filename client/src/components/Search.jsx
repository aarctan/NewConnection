import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const API_URL = process.env.REACT_APP_API_URL;

const SearchTab = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${API_URL}/authors/`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.items);
        setAuthors(data.items);
      })
      .catch((error) => console.log("Dashboard useEffect", error));
  }, []);

  return (
    <Autocomplete
      style={{ width: "30%" }}
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
            border: "solid 1px #f2f2f2",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
          }}
          {...params}
          placeholder="Search"
          InputProps={{
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
