import React, { useState, useEffect } from "react";
import SideBarNavi from "../../components/SideBarNavi/SideBarNavi.jsx";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import CompleteSidebar from "../../components/SideBarNavi/CompleteSidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import VisitorTable2 from "./VisitorTable2.jsx";
import Download_Button from "./Download_Button.jsx"; // Your original download button component
import axios from "axios";
import { API_BASE_URL } from "../../library/helper.js";
import useWindowSize from "../../hooks/useWindowSize";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const API_URL = API_BASE_URL + "/visitors";

const Visitor_Details = () => {
  const { width, height } = useWindowSize();
  const [filterText, setFilterText] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Visitor Details: ${width} x ${height}`;
  }, [width, height]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await axios.get(API_URL);
        setVisitorData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        setLoading(false);
      }
    };
    fetchVisitorData();
  }, []);

  useEffect(() => {
    const filtered = visitorData.filter(
      (visitor) =>
        visitor.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        visitor.phone_number?.includes(filterText)
    );
    setFilteredVisitors(filtered);
  }, [filterText, visitorData]);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <div className="content">
          <CompleteSidebar isActive="visitorDetails" />
          <main
            className="mainContent"
            style={{ paddingBottom: "50px" }} 
          >
            <Container
              maxWidth="lg"
              sx={{
                backgroundColor: "transparent",
                padding: { xs: 2, sm: 3, md: 4 },
                minHeight: "100vh",
                paddingBottom: "50px" 
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Today's Visitors
              </Typography>

              {/* Filter and Download Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end", // Align to right
                  alignItems: "center",
                  marginBottom: 3 // Spacing below the filter section
                }}
              >
                {/* Search Field */}
                <TextField
                  variant="outlined"
                  placeholder="Search"
                  value={filterText}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "20px",
                      backgroundColor: "#fff",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
                    }
                  }}
                  sx={{
                    width: {
                      xs: "70%", // Adjusted for smaller screens
                      sm: "50%", // Adjusted for tablets
                      md: "30%" // Adjusted for larger screens
                    },
                    marginRight: 2 // Space between search and download button
                  }}
                />

                <Download_Button />
              </Box>

              {/* Visitor Data Table */}
              <Box>
                {loading ? (
                  <LoadingSpinner />
                ) : filteredVisitors.length === 0 ? (
                  <Typography variant="h6">No Visitor Found!</Typography>
                ) : (
                  <VisitorTable2 visitors={filteredVisitors} />
                )}
              </Box>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Visitor_Details;
