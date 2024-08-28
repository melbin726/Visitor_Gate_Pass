import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper";

const API_URL = API_BASE_URL;

const Register_Guest = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataGuest = {
      name: "Vandana",
      email: "vandanasaharan11@gmail.com",
      phone: "9876543210",
      emailSubject: "Invitation from KJC",
      eventName: "Ideathon",
      invitedAs: "Judge",
      arrivalDate: new Date(),
    };
    console.log("Sending data:", dataGuest);

    try {
      const response = await axios.post(`${API_URL}/register-guest`, dataGuest);
      console.log("Response:", response.data);

      if (response.status === 200) {
        console.log("Guest registered successfully!");
        // Redirect to dashboard
      } else {
        console.error("Failed to register guest.");
      }
    } catch (e) {
      console.error(
        "Error registering guest:",
        e.response ? e.response.data : e.message
      );
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Register_Guest;
