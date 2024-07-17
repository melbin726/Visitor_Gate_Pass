// Register_Visitor.jsx

import "./Register_Visitor.css";
import SideBarNavi from '../../components/SideBarNavi/SideBarNavi.jsx';
import registerFormIcon from '../../assets/Icons/RegisterFormIcon.svg';

import { useEffect, useState } from "react";
import useWindowSize from '../../hooks/useWindowSize.jsx';
import axios from 'axios'; // Import axios

function Register_Visitor() {
  const { width, height } = useWindowSize();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [entryGate, setEntryGate] = useState('Gate 1'); // Default entry gate
  const [groupSize, setGroupSize] = useState(1);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    document.title = `Register_Visitor: ${width} x ${height}`;
  }, [width, height]);

  useEffect(() => {
    const updateCurrentDateTime = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
  
      // Convert hours to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight (0 hours)
  
      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDateTime(formattedDateTime);
    };
  
    // Update the date and time immediately on mount
    updateCurrentDateTime();
  
    // Update the date and time every second
    const intervalId = setInterval(updateCurrentDateTime, 1000);
  
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  

  const handlePhonenoChange = (event) => {
    const input = event.target.value;
    const sanitizedInput = input.replace(/\D/g, ''); // Remove non-digit characters

    // Ensure the input length is no more than 10
    setPhoneNumber(sanitizedInput.slice(0, 10));
  };

  const handlePurposeChange = (event) => {
    setPurposeOfVisit(event.target.value);
  }

  const handleEntryChange = (event) => {
    setEntryGate(event.target.value);
  }

  const handleGroupSizeChange = (event) => {
    setGroupSize(event.target.value);
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi activeLink="registerLink" />
        <div className="content">
          <div className="fakeSideBAr" />
          <main className="main-content">
            <div className="register-form">
              <div className="form-title">
                <div className="icon-text">
                  <img src={registerFormIcon} alt="registerFormIcon.svg" />
                  <h2>Visitor Registration</h2>
                </div>
                <div className="lines">
                  <div className="line1" />
                  <div className="line2" />
                </div>
              </div>
              <form className="main-form">
                <div className="left-section-form">
                  <div className="text-inputs">
                    <div className="text-boxes">
                      <label htmlFor="phoneno">Phone No:</label>
                      <input type="tel" name="phoneno" id="phoneno" value={phoneNumber} onChange={handlePhonenoChange} />
                    </div>
                    <div className="text-boxes">
                      <label htmlFor="name">Name:</label>
                      <input type="text" name="name" id="name" value={name} onChange={handleNameChange} />
                    </div>
                    <div className="text-boxes">
                      <label htmlFor="purpose">Purpose of Visit:</label>
                      <select name="purpose" id="purpose" value={purposeOfVisit} onChange={handlePurposeChange}>
                        <option value="">Select Purpose</option>
                        <option value="Campus Tour">Campus Tour</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Event">Event</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="text-boxes">
                      <label htmlFor="entry">Entry Gate:</label>
                      <select name="entry" id="entry" value={entryGate} onChange={handleEntryChange}>
                        <option value="Gate 1">Gate 1</option>
                        <option value="Gate 2">Gate 2</option>
                      </select>
                    </div>
                    <div className="text-boxes">
                      <label htmlFor="groupSize">Group Size:</label>
                      <input type="number" name="groupSize" id="groupSize" value={groupSize} onChange={handleGroupSizeChange} min="1" max="5" />
                    </div>
                    <div className="text-boxes">
                      <label htmlFor="checkInTime">Check-in Time:</label>
                      <input type="text" name="checkInTime" id="checkInTime" value={currentDateTime} readOnly />
                    </div>
                  </div>
                  <div className="ID-selects">

                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Register_Visitor;
