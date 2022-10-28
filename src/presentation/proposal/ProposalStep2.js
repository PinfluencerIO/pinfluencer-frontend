import { Box, FormControl, TextField } from "@mui/material";
import React from "react";
import { Image } from "../image/Image";

export const ProposalStep2 = ({ data, handleChange, view, id }) => {
  return (
    <Box noValidate autoComplete="off">
      <FormControl fullWidth margin="none">
        <TextField
          inputProps={{ readOnly: view ? "readonly" : "" }}
          fullWidth
          id="name"
          name={"name"}
          value={data.name}
          label="Name"
          variant="standard"
          onChange={(event) => handleChange(event)}
          sx={{ mb: 3 }}
        />
        <Image
          id={id}
          data={data}
          handleChange={handleChange}
          label="Product Image"
          width={170}
          height={170}
          sizeLabel="Best 300 (w) x 300 (h) pixels"
        />
      </FormControl>
    </Box>
  );
};