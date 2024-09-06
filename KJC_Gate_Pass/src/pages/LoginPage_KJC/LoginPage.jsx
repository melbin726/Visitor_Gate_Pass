import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { DirectionsCar, Group, Assignment, Timeline, Gavel } from "@mui/icons-material";
import LoginForm from "./LoginForm";
import Header from "./Header";
import Footer from "../../components/Footer/Footer";

function LoginPage() {
  return (
    <div className="fakeBody">
      <Box
        sx={{
          height: "calc(100vh - 38px)", // Reduce the overall height to allow room for the footer
          display: "flex",
          flexDirection: "column", // Stack header, content, footer vertically
          backgroundColor: '#fff', // Background color
          boxSizing: "border-box", // Ensure padding and borders don't cause overflow
          width: "100%", // Full width of the viewport
          pb: 5, // Add padding at the bottom to create space above the footer
        }}
      >
        <Header />

        <Box
          sx={{
            flex: "1", // Content will fill the remaining space between header and footer
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            px: 1,
            py: 4,
            pb: 2, // Add padding at the bottom to avoid footer overlap
          }}
        >
          <Grid
            container
            spacing={4}
            alignItems="center"
            direction="column"
            textAlign="center"
          >
            <Grid item xs={12}>
              <Box
                sx={{
                  px: { xs: 2, sm: 0, md: 4, lg: 2 },
                  maxWidth: { xs: "100%", sm: "100%", md: "80%", lg: "80%" },
                  mx: "auto",
                  width: "100%",
                  p: 0,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="700"
                  gutterBottom
                  sx={{ lineHeight: 1.2, mb: 1 }} // Reduced line height and bottom margin
                >
                  Welcome to
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  gutterBottom
                  sx={{ lineHeight: 1.2, mb: 1 }} // Reduced line height and bottom margin
                >
                  Secure Campus
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  paragraph
                  sx={{ lineHeight: 1.4 }} // Slightly reduced line height for the paragraph
                >
                  Secure Campus is your trusted partner in college security. From managing visitors to upholding student discipline,
                  we ensure a safe and efficient environment. Experience peace of mind with our comprehensive safety solutions.
                </Typography>
              </Box>

            </Grid>
            <Grid item xs={12}>
              <LoginForm />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ backgroundColor: "#fff", py: 1, width: "100%" }}> {/* Reduced vertical padding */}
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Box textAlign="center" sx={{ mb: 1 }}> {/* Reduced margin bottom */}
                <DirectionsCar fontSize="large" color="primary" />
                <Typography variant="body2" sx={{ lineHeight: 1 }}> {/* Reduced line height */}
                  Vehicle Management
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box textAlign="center" sx={{ mb: 1 }}>
                <Group fontSize="large" color="primary" />
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  Visitors Management
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box textAlign="center" sx={{ mb: 1 }}>
                <Assignment fontSize="large" color="primary" />
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  Visitors Logs
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box textAlign="center" sx={{ mb: 1 }}>
                <Timeline fontSize="large" color="primary" />
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  Real Time Reports
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box textAlign="center" sx={{ mb: 1 }}>
                <Gavel fontSize="large" color="primary" />
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  Student Discipline
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>


        <Footer />
      </Box>
    </div>
  );
}

export default LoginPage;
