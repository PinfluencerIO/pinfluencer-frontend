import {
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React from "react";
const numbersBetween0and100 = new RegExp("^\\b([0-9]|[1-9][0-9]|100)\\b$");

export function AudiencePercentages({ collection, data, handleChange }) {
  const numberCheck = (event) => {
    if (
      numbersBetween0and100.test(event.target.value) ||
      event.target.value === ""
    ) {
      handleChange(event);
    }
  };

  const defaultValueCheck = (event) => {
    if (event.target.value === "" || event.target.value === undefined)
      handleChange({
        target: { name: event.target.name, value: undefined },
        currentTarget: { name: event.target.name, value: undefined },
        dataset: {},
      });
  };

  return (
    <Grid container spacing={3} rowGap={1}>
      {collection.map((audience) => (
        <Grid item key={audience.id}>
          <FormControl
            sx={{
              width: 120,
            }}
          >
            <InputLabel sx={{ mt: 0.5 }} htmlFor={audience.id}>
              {audience.label}
            </InputLabel>
            <Input
              type="number"
              id={audience.id}
              name={audience.id}
              variant="standard"
              value={data[audience.id]}
              onChange={numberCheck}
              onBlur={defaultValueCheck}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              sx={{ input: { textAlign: "right" } }}
            />
          </FormControl>
        </Grid>
      ))}
    </Grid>
  );
}
