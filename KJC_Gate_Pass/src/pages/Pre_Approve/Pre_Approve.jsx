import React, { useState } from "react";
import Register_Guest from "./Register_Guest.jsx";
import ResponsiveAppBar from "./ResponsiveAppBar";
import GuestDataGrid from "./GuestDataGrid.jsx";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const Pre_Approve = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            marginBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            endIcon={<PersonAddAltTwoToneIcon />}
            sx={{
              fontWeight: "600",
              textTransform: "none",
              backgroundColor: "#239700",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#28a800" },
            }}
            onClick={handleOpen}
          >
            New Guest
          </Button>
          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={open}
          >
            <Register_Guest handleClose={handleClose} />
          </Backdrop>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <GuestDataGrid />
        </Box>
      </Container>
    </div>
  );
};

export default Pre_Approve;
