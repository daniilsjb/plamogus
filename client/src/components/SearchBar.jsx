import { useState } from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const SearchBar = ({ setSearch }) => {
  const [value, setValue] = useState(null);

  const handleSearch = () => {
    setSearch(value?.trim()?.replace(/\s+/g, ' '));
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <Paper component="form" sx={{ display: "flex", flex: 1, alignItems: "center" }}>
      <IconButton onClick={handleSearch}>
        <SearchIcon/>
      </IconButton>

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        onBlur={handleSearch}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </Paper>
  );
};

export default SearchBar;
