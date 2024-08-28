import "./Register_Guest.css";
import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper";
import SideBarNavi from "../../components/SideBarNavi/SideBarNavi";
import CustomDropDown from "../../components/CustomDropDown/CustomDropDown";
import { ToastContainer, toast, Slide } from "react-toastify";
import DatePicker from "react-datepicker";

const API_URL = API_BASE_URL;

const Register_Guest = () => {
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const dataGuest = {
  //       name: "Vandana",
  //       email: "vandanasaharan11@gmail.com",
  //       phone: "9876543210",
  //       emailSubject: "Invitation from KJC",
  //       eventName: "Ideathon",
  //       invitedAs: "Judge",
  //       arrivalDate: new Date(),
  //     };
  //     console.log("Sending data:", dataGuest);

  //     try {
  //       const response = await axios.post(`${API_URL}/register-guest`, dataGuest);
  //       console.log("Response:", response.data);

  //       if (response.status === 200) {
  //         console.log("Guest registered successfully!");
  //         // Redirect to dashboard
  //       } else {
  //         console.error("Failed to register guest.");
  //       }
  //     } catch (e) {
  //       console.error(
  //         "Error registering guest:",
  //         e.response ? e.response.data : e.message
  //       );
  //     }
  //   };

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi activeLink="#" />
        <div className="content">
          <div className="fakeSideBAr" />
          <ToastContainer />.
          <main className="mainContent">
            <div className="register-guest-form">
              <div className="form-title">
                <h2>Guest Pre-Approval Form</h2>
              </div>

              <form className="main-form">
                <div className="input-container">
                  <div className="text-boxes">
                    <label htmlFor="guestName">Name:</label>
                    <input type="text" name="guestName" id="guestName" />
                  </div>
                  <div className="text-boxes">
                    <label htmlFor="guestEmail">Email:</label>
                    <input type="email" name="guestEmail" id="guestEmail" />
                  </div>
                  <div className="text-boxes">
                    <label htmlFor="guestPhoneNo">Phone No:</label>
                    <input type="tel" name="guestPhoneNo" id="guestPhoneNo" />
                  </div>
                  <div className="text-boxes">
                    <label htmlFor="emailSubject">Email Subject:</label>
                    <input type="text" name="emailSubject" id="emailSubject" />
                  </div>
                  <div className="text-boxes">
                    <label htmlFor="eventName">Event Name:</label>
                    <input type="text" name="eventName" id="eventName" />
                  </div>
                  <div className="text-boxes">
                    <label htmlFor="invitedAs">Invited As:</label>
                    <CustomDropDown />
                  </div>
                  <div className="text-boxes">
                    <label htmlFor="arrivalDate">Arrival Date:</label>
                    <DatePicker />
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Register_Guest;
