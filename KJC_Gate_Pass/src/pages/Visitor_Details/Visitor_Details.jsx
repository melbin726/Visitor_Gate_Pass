import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SideBarNavi from "../../components/SideBarNavi/SideBarNavi.jsx";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import TotalVisitoirBlack_Icon from "../../assets/Icons/TotalVisitoirBlack_Icon.svg";
import "./Visitor_Details.css";
import VisitorTable2 from "./VisitorTable2.jsx";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper.js";

const API_URL = API_BASE_URL + "/visitors";

const Visitor_Details = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".dropdown2") === null) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
    console.log("Filter text changed:", filterText); // Log filter text
    console.log("Visitor data before filtering:", visitorData); // Log visitor data before filtering

    try {
      const filtered = visitorData.filter(
        (visitor) =>
          visitor.name?.toLowerCase().includes(filterText.toLowerCase()) ||
          visitor.phone_number?.includes(filterText) // Use correct key for phone number
      );

      setFilteredVisitors(filtered);
      console.log("Filtered visitors:", filtered); // Log filtered visitors
    } catch (error) {
      console.error("Error during filtering:", error);
      setFilteredVisitors([]); // Clear the list on error
    }
  }, [filterText, visitorData]);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
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
                  </div>
                  {loading ? (
                    <LoadingSpinner />
                  ) : filteredVisitors.length === 0 ? (
                    <h1>No Vistor Found!</h1>
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
