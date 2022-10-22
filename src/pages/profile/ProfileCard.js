import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

export const ProfileCard = ({ title, children, view, urlPrefix = "edit/" }) => {
  const nav = useNavigate();
  console.log(view);
  return (
    <Paper sx={{ padding: 2 }} variant="outlined">
      <Stack
        direction="row"
        justifyContent="space-between"
        onClick={() => nav(urlPrefix + title.replace(/\s/g, "").toLowerCase())}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {
          <Typography variant="h5" sx={{ mb: 2 }} fontWeight="900">
            <KeyboardArrowRightIcon />
          </Typography>
        }
      </Stack>
      <Box>{children}</Box>
    </Paper>
  );
};
