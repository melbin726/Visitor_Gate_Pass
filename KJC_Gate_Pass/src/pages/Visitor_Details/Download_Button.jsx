import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import "./Download_Button.css";

const Download_Button = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("today");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const togglePopover = (e) => {
    e.preventDefault(); // Prevent default behavior
    setIsOpen(!isOpen);
  };

  const handleProceed = (e) => {
    e.preventDefault(); // Prevent default behavior
    // Handle proceed action
    console.log("Proceeding with option:", selectedOption);
    if (selectedOption === "custom") {
      console.log("Date range:", startDate, " to ", endDate);
    }
    setIsOpen(false);
  };

  return (
    <div className="download-button-container">
      <button
        className="custom-download-btn"
        onClick={togglePopover}
        id="downloadBtn"
        // type="button"
      >
        Download
      </button>

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
