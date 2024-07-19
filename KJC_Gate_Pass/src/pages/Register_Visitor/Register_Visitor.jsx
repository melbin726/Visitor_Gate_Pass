// Register_Visitor.jsx
import "./Register_Visitor.css";
import SideBarNavi from '../../components/SideBarNavi/SideBarNavi.jsx';
import registerFormIcon from '../../assets/Icons/RegisterFormIcon.svg';

import { useEffect, useState, useRef} from "react";
import useWindowSize from '../../hooks/useWindowSize.jsx';
import axios from 'axios';
import CustomDropdown from './CustomDropDown.jsx';

function Register_Visitor() {
  const { width, height } = useWindowSize();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [entryGate, setEntryGate] = useState('Gate 1'); // Default entry gate
  const [groupSize, setGroupSize] = useState(1);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const NameInputRef = useRef(null);
  const [options, setOptions] = useState([
    { value: 'Campus Tour', label: 'Campus Tour' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Event', label: 'Event' }
  ]); // Initial options
  const [filteredOptions, setFilteredOptions] = useState(options); // Define filteredOptions state

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

  const handlePhonenoChange = async (event) => {
    const input = event.target.value;
    NameInputRef.current.readOnly = false;
    const sanitizedInput = input.replace(/\D/g, ''); // Remove non-digit characters
    const phonenum = sanitizedInput.slice(0, 10); // Ensure the input length is no more than 10

    setPhoneNumber(phonenum); // Update the phone number state

    if (phonenum.length === 10) {
        try {
            // Correctly pass phone_number as query parameter
            const response = await axios.get('http://192.168.29.14:3001/api/phoneNumber', {
                params: { phone_number: phonenum }
            });

            if (response.data === '') {
                console.log('Visitor does not exist');
                setName(''); // Clear the name if visitor does not exist
            } else {
                setName(response.data); // Update the name state with the returned name
                if(NameInputRef){
                  NameInputRef.current.readOnly = true;
                }
            }
        } catch (error) {
            console.error('Error fetching name by phone number:', error);
            // Optionally set an error state here
        }
    } else {
        setName(''); // Clear the name state if phone number length is less than 10
    }
};

  const handlePurposeInputChange = async (selectedOption) => {
    setPurposeOfVisit(selectedOption);
    console.log(selectedOption.value); // Log the selected option's value
  };

  useEffect(() => {
    // Use this effect to do something when purposeOfVisit updates
    console.log('Updated purposeOfVisit:', purposeOfVisit);
  }, [purposeOfVisit]);

  const handlePurposeChange = async (inputValue) => {
    setPurposeOfVisit(inputValue.value);

    if (!inputValue.value) {
      setFilteredOptions(options); // Reset to initial options if input is empty
      return;
    }

    try {
      const response = await axios.get('http://192.168.29.14:3001/api/purpose', { params: { query: inputValue.value } });
      const newOptions = response.data.map(item => ({ value: String(item), label: String(item) }));
      setFilteredOptions(newOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

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
          <main className="mainContent">
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
                      <input type="text" name="name" id="name" ref={NameInputRef} value={name} onChange={handleNameChange} />
                    </div>
                    <div className="text-boxes">
                      <label htmlFor="purpose">Purpose of Visit:</label>
                      <CustomDropdown
                        id="purpose"
                        name="purpose"
                        value={purposeOfVisit}
                        onChange={handlePurposeChange}
                        options={filteredOptions}
                        placeholder="Type or select..."
                      />
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
                      <select name="groupSize" id="groupSize" value={groupSize} onChange={handleGroupSizeChange}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </div>
                    <div className="text-boxes">
                      <label htmlFor="checkInTime">Check-in Time:</label>
                      <input type="text" name="checkInTime" id="checkInTime" value={currentDateTime} readOnly />
                    </div>
                  </div>
                  <div className="ID-selects">
                    {/* Additional elements if necessary */}
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
