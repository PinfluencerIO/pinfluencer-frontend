// import MailIcon from "@mui/icons-material/Mail";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Avatar,
  // Badge,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collaborations, listings as data } from "../../api/data";
import { CollaborationsStateCounts } from "../../presentation/CollaborationsStateCounts";
const text = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
export const ProposalList = () => {
  const nav = useNavigate();

  const [listings, setListings] = React.useState([]);

  const handleClick = (listing) => {
    nav("/listing/view/" + listing.id);
  };
  useEffect(() => {
    setListings(data);
  }, []);
  return (
    <Box>
      <Box display="flex" justifyContent="end" pb={1}>
        <Button variant="outlined" onClick={() => nav("/listings/new")}>
          New Listing
        </Button>
      </Box>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Typography variant="h5">My Listings ({listings.length})</Typography>
        <Box sx={{ overflow: "auto", height: "200px" }}>
          {listings
            .sort((a, b) => Date.parse(b.created) - Date.parse(a.created))
            .map((p) => (
              <Box
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginTop: "10px",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <Box
                  onClick={() => handleClick(p)}
                  style={{ whiteSpace: "nowrap", marginRight: "10px" }}
                >
                  <Avatar src={p.image} />
                </Box>
                <Box
                  style={{
                    minWidth: "100px",
                    overflow: "hidden",
                    flexGrow: 2,
                    marginRight: "10px",
                  }}
                >
                  <Box onClick={() => handleClick(p)} style={text}>
                    {p.title}
                  </Box>
                  <Box onClick={() => handleClick(p)} style={text}>
                    {p.name}
                  </Box>
                  <CollaborationsStateCounts
                    hideTitle
                    collaborations={collaborations}
                    listingsId={p.id}
                  />
                </Box>

                <IconButton onClick={() => handleClick(p)}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            ))}
        </Box>
      </Paper>
    </Box>
  );
};
