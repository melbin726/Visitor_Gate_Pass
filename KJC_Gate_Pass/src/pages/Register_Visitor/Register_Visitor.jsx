import "./Register_Visitor.css";
import SideBarNavi from '../../components/SideBarNavi/SideBarNavi.jsx';
import registerFormIcon from '../../assets/Icons/RegisterFormIcon.svg';
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast , Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowSize from '../../hooks/useWindowSize.jsx';
import axios from 'axios';
import CustomDropdown from '../../components/CustomDropDown/CustomDropDown.jsx';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../library/helper.js'

function Register_Visitor() {
  const { width, height } = useWindowSize();
  const [visitorExists, setVisitorExists] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [entryGate, setEntryGate] = useState('Gate 1'); // Default entry gate
  const [groupSize, setGroupSize] = useState(1);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isCameraON, setIsCameraON] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState(''); // New state variable to hold the photo data URL
  const NameInputRef = useRef(null);
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [options, setOptions] = useState([
    { value: 'Campus Tour', label: 'Campus Tour' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Event', label: 'Event' }
  ]); // Initial options
  const [filteredOptions, setFilteredOptions] = useState(options); // Define filteredOptions state
  const [idCards, setIdCards] = useState(['', '', '', '', '']);
  const [filteredICards, setFilteredICards] = useState([]);
  const streamRef = useRef(null); // Reference to hold the media stream
  const API_URL = API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    // Convert all elements in idCards to strings
    const idCardsAsStrings = idCards.map(id => String(id));
    
    console.log(`idCards: ${idCardsAsStrings} arraySize: ${idCardsAsStrings.length}`);
    
    // Log each element with pipes around them to clearly show the boundaries of each string
    idCardsAsStrings.map(id => console.log(`|${id}|`));
  }, [idCards]);

  useEffect(() => {
    fetchAvailableCards('').then(initialOptions => {
      setFilteredICards(initialOptions.map(item => ({ value: item, label: item })));
    });
  }, []);

  useEffect(() => {
    const cardInputs = idCards.filter(val => val);
    fetchAvailableCards('').then(responseValues => {
      const uniqueResponseValues = responseValues.filter(item => !cardInputs.includes(item));
      const newOptions = uniqueResponseValues.map(item => ({ value: item, label: item }));
      setFilteredICards(newOptions);
    });
  }, [idCards]);

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

  const notifyExists = (phone_number, name) => {toast.info(`Visitor '${name}' with ${phone_number} exists`, {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
    });};

    const notifyErr = (err) => {toast.error(`${err}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });};

    const notifySuccess = (text) => {toast.success(`${text}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });}

  const fetchAvailableCards = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/available_id_cards`, { params: { query } });
      return response.data.map(item => String(item));
    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };

  const filterAndSetOptions = (inputValue, cardInputs, index) => {
    const newIdCards = [...idCards];
    newIdCards[index] = inputValue.value;
    setIdCards(newIdCards);

    if (!inputValue.value) {
      setFilteredICards([...filteredICards]); // Reset to initial options if input is empty
      return;
    }

    fetchAvailableCards(inputValue.value).then(responseValues => {
      const uniqueResponseValues = responseValues.filter(item => !cardInputs.includes(item));
      const idsArray = filteredICards ? filteredICards.map(f => f.value) : [];
      let totalResponse = [...idsArray, ...uniqueResponseValues];
      totalResponse = [...new Set(totalResponse)];
      const newOptions = totalResponse.map(item => ({ value: item, label: item }));
      setFilteredICards(newOptions);
    });
  };

  const handleIdCardChange = (inputValue, index) => {
    const cardInputs = idCards.filter(val => val);
    filterAndSetOptions(inputValue, cardInputs, index);
  };

  const handlePhonenoChange = async (event) => {
    const input = event.target.value;
    NameInputRef.current.readOnly = false;
    const sanitizedInput = input.replace(/\D/g, ''); // Remove non-digit characters
    const phonenum = sanitizedInput.slice(0, 10); // Ensure the input length is no more than 10

    setPhoneNumber(phonenum); // Update the phone number state

    if (phonenum.length === 10) {
      try {
        // Correctly pass phone_number as query parameter
        const response = await axios.get(`${API_URL}/phoneNumber`, {
          params: { phone_number: phonenum }
        });

        if (response.data === '') {
          // console.log('Visitor does not exist');
          setName(''); // Clear the name if visitor does not exist
          setVisitorExists(false);
        } else {
          setName(response.data); // Update the name state with the returned name
          setVisitorExists(true);
          notifyExists(phonenum, response.data);
          if (NameInputRef) {
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
      const response = await axios.get(`${API_URL}/purpose`, { params: { query: inputValue.value } });
      const newOptions = response.data.map(item => ({ value: String(item), label: String(item) }));
      setFilteredOptions(newOptions);
      console.log(newOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleEntryChange = (event) => {
    setEntryGate(event.target.value);
  };

  const handleGroupSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setGroupSize(newSize);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Reset idCards when groupSize decreases
  useEffect(() => {
    setIdCards(prevIdCards => prevIdCards.slice(0, groupSize));
  }, [groupSize]);

  const getVideo = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 }
      })
        .then(stream => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
          streamRef.current = stream; // Store the stream reference
        })
        .catch(err => {
          console.error("Error accessing webcam: ", err);
        });
    } else {
      console.error("getUserMedia is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (isCameraON && videoRef.current) {
      getVideo();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraON]);

  const onCamera = (event) => {
    event.preventDefault();
    if (isCameraON && streamRef.current) {
      // Stop all tracks of the current stream if the camera is being turned off
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null; // Clear the stream reference
    }
    setIsCameraON(!isCameraON); // Toggle camera state
  };

  const capturePhoto = (event) => {
    event.preventDefault();
    const width = 290;
    const height = width / (16 / 9);
    let video = videoRef.current;
    let photo = photoRef.current;
    photo.width = width;
    photo.height = height;
    const context = photo.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    setHasPhoto(true); // Set the photo state to true once a photo is captured

    // Save the captured image as a data URL
    const dataUrl = photo.toDataURL('image/png');
    setPhotoDataUrl(dataUrl);
  };

  const clearPhoto = (event) => {
    event.preventDefault();
    setHasPhoto(false);
    setPhotoDataUrl('');
    if (photoRef.current) {
      const context = photoRef.current.getContext('2d');
      context.clearRect(0, 0, photoRef.current.width, photoRef.current.height);
    }
  };

  const checkArrayFilled = async () => {
    if (groupSize !== idCards.length) {
      notifyErr('IDs are not assigned');
      return false;
    } else if (idCards.some(id => id === false)) {
      notifyErr('All ID slots must be filled');
      return false;
    } else if (!idCards.every(id => /^\d{3}$/.test(id))) {
      notifyErr('Each ID must be a string of exactly 3 numeric characters');
      return false;
    } else {
      // Check if all IDs are unique
      const uniqueIds = new Set(idCards);
      if (uniqueIds.size !== idCards.length) {
        notifyErr('Each ID must be unique');
        return false;
      }
      // Check if all IDs are between 001 and 500
      if (idCards.some(id => id < "001" || id > "500")) {
        notifyErr('Each ID must be between 001 and 500');
        return false;
      }
      try {
        const response = await axios.get(`${API_URL}/checkIDAvailable`, {
          params: { ID_Array: idCards }
        });
        if (!response.data.checking) {
          notifyErr(response.data.msg);
          return false;
        }
      } catch (error) {
        console.error('Error checking ID availability: ', error);
        notifyErr('Error checking ID availability');
        return false;
      }
      notifySuccess('All ID slots are filled');
      return true;
    }
  };
  
  const checkVisitorAccessibility = async () => {
    if (visitorExists) {
      try {
        const response = await axios.get(`${API_URL}/checkVisitorAccessibility`, {
          params: { phone_number: phoneNumber }
        });
        if (response.data.checking) {
          notifySuccess('Visitor is accessible');
          return true;
        } else {
          notifyErr(response.data.msg);
          return false;
        }
      } catch (error) {
        console.error('Error checking visitor accessibility: ', error);
        notifyErr('Error checking visitor accessibility');
        return false;
      }
    } else {
      return true;
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(visitorExists);
  
    if (phoneNumber.length !== 10) {
      notifyErr('Please fill Phone number appropriately');
      return;
    }
    
    if (!name) {
      notifyErr('Please provide a name');
      return;
    }
    
    if (!purposeOfVisit) {
      notifyErr('Please provide a purpose of visit');
      return;
    }
    
    if (!entryGate) {
      notifyErr('Please provide an entry gate');
      return;
    }
    
    if (!groupSize) {
      notifyErr('Please provide a group size');
      return;
    }
    
    if (!currentDateTime) {
      notifyErr('Please provide the current date and time');
      return;
    }
    
    if (!photoDataUrl) {
      notifyErr('Please provide a photo');
      return;
    }
    
    const idArrayFilled = await checkArrayFilled();
    const accessibleVisitor = await checkVisitorAccessibility();
    
    if (!idArrayFilled) {
      return;
    }
  
    if (!accessibleVisitor) {
      return;
    }
  
    console.log(`bananas`);
    
    const finalData = {
      PhoneNumber: phoneNumber,
      Name: name,
      PurposeOfVisit: purposeOfVisit,
      EntryGate: entryGate,
      GroupSize: groupSize,
      Checkin_time: new Date(),
      IdCards: idCards,
      Photo: photoDataUrl
    };

    console.log(finalData);

    try {
      const response = await axios.post(`${API_URL}/register_Checkin_Visitor`, {
        params: { VisitorSessionInfo: finalData }
      });
      if(response.data.checking){
        notifySuccess(response.data.msg);
      }else{
        notifyErr(response.data.msg);
      }
    }catch (error) {
      console.error('Error Register/Checkin Visitor: ', error);
      notifyErr('Error Register/Checkin Visitor: ', error);
      return false;
    }
  };

  const handleClear = () => {
  setVisitorExists(false);
  setPhoneNumber('');
  setName('');
  setPurposeOfVisit('');
  setEntryGate('Gate 1'); // Default entry gate
  setGroupSize(1);
  // const [currentDateTime, setCurrentDateTime] = useState('');
  setHasPhoto(false);
  setIsCameraON(false);
  setPhotoDataUrl(''); // New state variable to hold the photo data URL
  setOptions([
    { value: 'Campus Tour', label: 'Campus Tour' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Event', label: 'Event' }
  ]); // Initial options
  setFilteredOptions(options); // Define filteredOptions state
  setIdCards(['', '', '', '', '']);
  setFilteredICards([]);
  }
  

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi activeLink="registerLink" />
        <div className="content">
          <div className="fakeSideBAr" />
          <ToastContainer />
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
                <div className="sections">
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
                          placeholder="Select..."
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
                          {[1, 2, 3, 4, 5].map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-boxes">
                        <label htmlFor="checkInTime">Check-in Time:</label>
                        <input type="text" name="checkInTime" id="checkInTime" value={currentDateTime} readOnly />
                      </div>
                    </div>
                    <div className="ID-selects">
                      <div className="text-boxes">
                        <label>ID Selections</label>
                        <div className="ID-drops">
                          {Array.from({ length: groupSize }, (_, index) => (
                            <span className="idcardsSelects" key={index} id={`idSelect${index + 1}`}>
                              <CustomDropdown
                                id={`id${index + 1}`}
                                name={`id${index + 1}`}
                                widths={50}
                                types="number"
                                value={idCards[index]}
                                onChange={(inputValue) => handleIdCardChange(inputValue, index)}
                                options={filteredICards}
                                placeholder="ID"
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right-section-form">
                    <div className="photo-frame">
                      <label>Photo</label>
                      <div className="live-videos">
                        <video
                          ref={videoRef}
                          style={{ display: isCameraON ? 'block' : 'none' }}
                        />
                      </div>
                      <div className="buttons-">
                        {!isCameraON && <button type="button" style={{ backgroundColor: "#16a34a" }} onClick={onCamera}>Turn Camera On</button>}
                        {isCameraON && <button type="button" style={{ backgroundColor: "#dc2626" }} onClick={onCamera}>Turn Camera Off</button>}
                        {isCameraON && <button type="button" onClick={capturePhoto}>Capture Photo</button>}
                      </div>
                    </div>
                    <div className="resulter">
                      <div className={"result " + (hasPhoto ? 'hasPhoto' : '')}>
                        <canvas ref={photoRef} style={{ display: 'none' }} />
                        {/* Display the captured photo */}
                        {photoDataUrl && <img src={photoDataUrl} alt="Captured" />}
                        {hasPhoto && <button type="button" style={{ padding: '2px 5px 4px', borderRadius: '20px', margin: '2px', textAlign: 'center', backgroundColor: "#dc2626" }} onClick={clearPhoto}>x</button>}
                      </div>
                    </div>
                    {/* Add any additional footer elements here */}
                  </div>
                </div>
                <div className="form-footer">
                  <button onClick={handleSubmit} style={{ backgroundColor: "#16a34a" }}>Submit</button>
                  <button type="reset" onClick={handleClear}>Clear</button>
                  <button type="button" onClick={() => {handleClear(); navigate('/dashboard');}} style={{ backgroundColor: "#dc2626" }}>Cancel</button>
                  {/* Add any additional footer elements here */}
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
