import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DownloadIcon from "@mui/icons-material/Download";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import "./Download_Button.css";
import { API_BASE_URL } from "../../library/helper";

const Download_Button = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("today");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const API_URL = API_BASE_URL;

  const togglePopover = (e) => {
    e.preventDefault(); // Prevent default behavior
    setIsOpen(!isOpen);
  };

  const handleProceed = async (e) => {
    e.preventDefault(); // Prevent default behavior

    let formattedStartDate, formattedEndDate;

    if (selectedOption === "today") {
      const today = new Date();
      formattedStartDate = new Date(today.setHours(0, 0, 0, 0)).toISOString(); // Start of today
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString(); // End of today
    } else if (selectedOption === "lastWeek") {
      const today = new Date();
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7);
      formattedStartDate = new Date(
        lastWeekStart.setHours(0, 0, 0, 0)
      ).toISOString(); // Start of last week
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString(); // End of today
    } else if (selectedOption === "lastMonth") {
      const today = new Date();
      const lastMonthStart = new Date(today);
      lastMonthStart.setMonth(today.getMonth() - 1);
      formattedStartDate = new Date(
        lastMonthStart.setHours(0, 0, 0, 0)
      ).toISOString(); // Start of last month
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString(); // End of today
    } else if (selectedOption === "lastYear") {
      const today = new Date();
      const lastYearStart = new Date(today);
      lastYearStart.setFullYear(today.getFullYear() - 1);
      formattedStartDate = new Date(
        lastYearStart.setHours(0, 0, 0, 0)
      ).toISOString(); // Start of last year
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString(); // End of today
    } else {
      formattedStartDate = new Date(
        new Date(startDate).setHours(0, 0, 0, 0)
      ).toISOString(); // Custom start date with start of the day
      formattedEndDate = new Date(
        new Date(endDate).setHours(23, 59, 59, 999)
      ).toISOString(); // Custom end date with end of the day
    }

    console.log(formattedStartDate, formattedEndDate);

    try {
      const response = await axios.get(`${API_URL}/download-report`, {
        params: { startDate: formattedStartDate, endDate: formattedEndDate },
        responseType: "blob", // Important: specify the response type as 'blob'
      });

      // Log the response to ensure we received the correct data
      console.log("API Response:", response.data);

      // Create a new Blob object using the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a URL for the Blob object
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a new anchor element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Visitor_Report.xlsx"; // Set the file name for the download

      // Append the anchor to the body (required for Firefox)
      document.body.appendChild(link);

      // Programmatically click the anchor to trigger the download
      link.click();

      // Remove the anchor from the document
      document.body.removeChild(link);

      // Revoke the Blob URL to avoid memory leaks
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error fetching report:", error);
    }

    setIsOpen(false);
  };

  return (
    <div className="download-button-container">
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{textTransform:"none"}}
          startIcon={<DownloadIcon />}
          className="custom-download-btn"
          onClick={togglePopover}
          type="button"
        >
          <h6>Download</h6>
        </Button>
      </Stack>

      {isOpen && (
        <div className="custom-popover">
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="today"
                checked={selectedOption === "today"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Today
            </label>
            <label>
              <input
                type="radio"
                value="lastWeek"
                checked={selectedOption === "lastWeek"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Last Week
            </label>
            <label>
              <input
                type="radio"
                value="lastMonth"
                checked={selectedOption === "lastMonth"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Last Month
            </label>
            <label>
              <input
                type="radio"
                value="lastYear"
                checked={selectedOption === "lastYear"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Last Year
            </label>
            <label>
              <input
                type="radio"
                value="custom"
                checked={selectedOption === "custom"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Custom
            </label>
          </div>

          {selectedOption === "custom" && (
            <div className="date-picker-container">
              <div>
                <label>Start from:</label>
                <CustomDatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
              <div>
                <label>End on:</label>
                <CustomDatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
            </div>
          )}
          <button
            className="custom-proceed-btn"
            onClick={handleProceed}
            type="button" // Explicitly set button type
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default Download_Button;
