import React, { useState, useEffect } from "react";
import SideBarNavi from "../../components/SideBarNavi/SideBarNavi.jsx";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import Download_Button from "./Download_Button.jsx";
import TotalVisitoirBlack_Icon from "../../assets/Icons/TotalVisitoirBlack_Icon.svg";
import "./Visitor_Details.css";
import VisitorTable2 from "./VisitorTable2.jsx";
import axios from "axios";
import { API_BASE_URL, formatDateWithPadding } from "../../library/helper.js";
// import DateFilter from "./DateFilter.jsx";

const API_URL = API_BASE_URL + "/visitors";

const Visitor_Details = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from your database API
    fetch('/visitors') // Replace with your actual API endpoint
      .then(response => response.json())
      .then(fetchedData => setData(fetchedData));
  }, []);


  const [filterText, setFilterText] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await axios.get(API_URL);
        setVisitorData(response.data); // Store data from API
        setLoading(false);
        console.log("Fetched visitor data:", response.data); // Log data
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, []);
  useEffect(() => {
    const filtered = visitorData.filter((visitor) => {
      // Filter by name or phone number
      const matchesNameOrPhone =
        visitor.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        visitor.phone_number?.includes(filterText);

      // Parse the visitor's check-in time as a Date object
      const visitorDate = new Date(visitor.check_in_time);

      // Check if the visitor's check_in_time matches the selected date
      const isSameDate =
        formatDateWithPadding(visitorDate.toDateString()) ===
        startDate.toDateString();

      // Return true if either the name/phone number matches OR the date matches
      return matchesNameOrPhone || isSameDate;
    });

    setFilteredVisitors(filtered);

    console.log("Filtered visitors:", filtered); // Log filtered visitors
  }, [filterText, visitorData, startDate]); // Re-run the filtering whenever filterText, visitorData, or startDate changes

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleDateChange = (event) => {
    const selectedValue = event.target.value;
    const date = new Date(selectedValue); // Convert the input value to a Date object

    if (!isNaN(date.getTime())) {
      // Check if the date is valid
      setStartDate(date); // Update the start date
      console.log("Selected Date:", date);
    } else {
      console.log("Invalid Date selected");
    }
  };

  return (
    <div className="totalContent">
      <SideBarNavi activeLink="VisiorDetailsLink" />
      <div className="content">
        <div className="fakeSideBAr" />
        <main className="mainContent">
          <div className="visitor-register-form">
            <div className="form-title">
              <div className="icon-text-visitor">
                <img
                  src={TotalVisitoirBlack_Icon}
                  alt="TotalVisitoirBlack_Icon"
                />
                <h2 className="visitorname2">Visitor Details</h2>
              </div>
              <div className="lines">
                <div className="line1" />
                <div className="line2" />
              </div>
            </div>

            <form className="main-form-vd">
              <div className="Vcontainer">
                <div className="visitor-details-container">
                  <div className="vt_date_search">
                    <input
                      className="vt_searchcontainer"
                      type="text"
                      placeholder="Filter by name or phone number"
                      value={filterText}
                      onChange={handleFilterChange}
                    />
                    {/* <div className="filter">
                    <DateFilter data={data} />
                    </div> */}
                    <div className="dowload-data">
                      <Download_Button />
                    </div>
                  </div>
                  {loading ? (
                    <LoadingSpinner />
                  ) : filteredVisitors.length === 0 ? (
                    <h1>No Visitor Found!</h1>
                  ) : (
                    <VisitorTable2 visitors={filteredVisitors} />
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Visitor_Details;
