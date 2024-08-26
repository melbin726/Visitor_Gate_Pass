import "./Checkout_Visitor.css";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import SideBarNavi from "../../components/SideBarNavi/SideBarNavi.jsx";
import CheckoutBlack_Icon from "../../assets/Icons/CheckoutBlack_Icon.svg";
import CustomDropdown from "../../components/CustomDropDown/CustomDropDown.jsx";
import default_photo from "../../assets/default_photo.svg";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../library/helper.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout_Visitor() {
  const [selectedValuesArray, setSelectedValuesArray] = useState([]);
  const { width, height } = useWindowSize();
  const [initiallyCheckedOut, setInitiallyCheckedOut] = useState([]);
  const [checkedStates, setCheckedStates] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [checkedInIds, setCheckedInIds] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [visitorData, setVisitorData] = useState(null); // State for visitor data
  const [selectedExit, setSelectedExit] = useState("Gate 1"); // Default value for exit gate
  const API_URL = API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Checkout_Visitor: ${width} x ${height}`;
  }, [width, height]);

  const notifyExists = (id) => {
    toast.info(`Id No: ${id} Exists`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const notifyErr = (err) => {
    toast.error(`${err}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const notifySuccess = (text) => {
    toast.success(`${text}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const fetchCheckedInIds = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/checked-in-ids`, {
        params: { query },
      });
      // console.log('Fetched IDs:', response.data);
      setCheckedInIds(
        response.data.map((id) => ({ label: String(id), value: String(id) }))
      );
    } catch (error) {
      console.error("Error fetching checked-in IDs:", error);
      setCheckedInIds([]); // Clear the state in case of error
    }
  };
  useEffect(() => {
    fetchCheckedInIds(""); // Fetch all IDs initially
  }, []);

  const handleIdCardChange = (inputValue) => {
    setSelectedId(inputValue.value);
  };

  const handleFetchData = async (event) => {
    event.preventDefault();
    if (!checkSelectedIdsFormat()) {
      return false;
    }

    if (selectedId == "") {
      notifyErr("No Id Selected");
    } else {
      try {
        setSelectedValues([]);
        const response = await axios.get(
          `${API_URL}/checkout-visitor-details`,
          { params: { id: selectedId } }
        );
        if (response.status === 200) {
          const data = response.data;
          setVisitorData(data); // Set visitor data including photo
          notifyExists(selectedId);

          // Set checked states based on member_details
          const newCheckedStates = data.member_details.map(
            (member) => member.status === "checked_out"
          );
          setCheckedStates(newCheckedStates);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        notifyErr("The Id Is Not Checked-In ");
        console.error("Error occurred while fetching data:", error);
      }
    }
  };

  //Formated date and time
  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = hours.toString().padStart(2, "0");

    return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  useEffect(() => {
    if (visitorData?.member_details) {
      const initialCheckedStates = visitorData.member_details.map(
        (member) => member.status === "checked_in"
      );
      const initialCheckedOut = visitorData.member_details.map(
        (member) => member.status === "checked_out"
      );
      setCheckedStates(initialCheckedStates);
      setInitiallyCheckedOut(initialCheckedOut);
    }
  }, [visitorData]);

  const handleToggle = (index, card_id) => {
    if (!initiallyCheckedOut[index]) {
      setCheckedStates((prevStates) =>
        prevStates.map((state, i) => (i === index ? !state : state))
      );

      setSelectedValues((prevValues) => {
        const updatedValues = prevValues.includes(card_id)
          ? prevValues.filter((id) => id !== card_id)
          : [...prevValues, card_id];
        console.log("Selected Values:", updatedValues);
        setSelectedValuesArray(updatedValues);
        return updatedValues;
      });
    }
  };

  const checkSelectedIdsFormat = () => {
    if (!/^\d{3}$/.test(selectedId)) {
      notifyErr("Each ID must be a string of exactly 3 numeric characters");
      return false;
    } else if (selectedId < "001" || selectedId > "500") {
      notifyErr("Each ID must be between 001 and 500");
      return false;
    }
    return true;
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (!checkSelectedIdsFormat()) {
      return false;
    }

    if (selectedValuesArray.length < 1) {
      notifyErr("Please Select an ID to Checkout");
      return false;
    }

    try {
      const response = await axios.post(`${API_URL}/checkout-visitor`, {
        selectedValues,
        selectedExit,
      });

      if (response.status === 200) {
        notifySuccess("Checkout completed successfully.");
        handleClear();
      } else {
        notifyErr("Failed to complete checkout.");
      }
    } catch (error) {
      notifyErr("An error occurred during checkout.");
      console.error("Checkout error:", error);
    }
  };

  const handleClear = () => {
    setVisitorData(null);
  };

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi activeLink="checkoutLink" />
        <div className="content">
          <div className="fakeSideBAr" />
          <ToastContainer />
          <main className="mainContent">
            <div className="checkout-register-form">
              <div className="form-title">
                <div className="icon-text">
                  <img src={CheckoutBlack_Icon} alt="registerFormIcon.svg" />
                  <h2>Visitor Check-out</h2>
                </div>
                <div className="lines">
                  <div className="line1" />
                  <div className="line2" />
                </div>
              </div>

              <form className="main-form">
                <div className="sections">
                  <div className="left-section-form">
                    <div className="fetch-ids">
                      <div className="text-boxes">
                        <label>Visitor ID Card:</label>
                        <CustomDropdown
                          id="checkoutId"
                          name="checkoutId"
                          types="text"
                          widths={100}
                          option_width={50}
                          search_box_width={135}
                          value={selectedId}
                          onChange={handleIdCardChange}
                          options={checkedInIds}
                          placeholder="Select ID"
                        />
                      </div>
                      <button
                        onClick={handleFetchData}
                        style={{ backgroundColor: "#16a34a" }}
                      >
                        Fetch Data
                      </button>
                    </div>
                    <div className="text-inputs">
                      <div className="text-boxes">
                        <label htmlFor="name">Name:</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={visitorData?.name || ""}
                          readOnly
                        />
                      </div>
                      <div className="text-boxes">
                        <label htmlFor="phoneno">Phone No:</label>
                        <input
                          type="tel"
                          name="phoneno"
                          id="phoneno"
                          value={visitorData?.phone_number || ""}
                          readOnly
                        />
                      </div>
                      <div className="text-boxes">
                        <label htmlFor="purpose">Purpose of Visit:</label>
                        <input
                          type="text"
                          name="purpose"
                          id="purpose"
                          value={visitorData?.purpose_of_visit || ""}
                          readOnly
                        />
                      </div>
                      <div className="text-boxes">
                        <label htmlFor="groupSize">Group Size:</label>
                        <input
                          type="text"
                          name="groupSize"
                          id="groupSize"
                          value={visitorData?.group_size || ""}
                          readOnly
                        />
                      </div>
                      <div className="text-boxes">
                        <label htmlFor="checkInTime">Check-in Time:</label>
                        <input
                          type="text"
                          name="checkInTime"
                          id="checkInTime"
                          value={
                            visitorData
                              ? formatDateTime(visitorData.check_in_time)
                              : ""
                          }
                          readOnly
                        />
                      </div>
                      <div className="text-boxes">
                        <label htmlFor="entry">Entry Gate:</label>
                        <input
                          type="text"
                          name="entry"
                          id="entry"
                          value={visitorData?.entry_gate || ""}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="ID-selects">
                      <div className="text-boxes">
                        <label>ID Selections</label>
                        <div
                          className="ID-drops"
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          {visitorData?.member_details.map((member, index) => (
                            <span
                              className="idcardsSelects"
                              key={index}
                              id={`idSelect${index + 1}`}
                            >
                              <input
                                type="checkbox"
                                checked={checkedStates[index]}
                                onChange={() =>
                                  handleToggle(index, member.card_id)
                                }
                                id={`checkbox-${index}`}
                                style={{ display: "none" }}
                              />
                              <label
                                htmlFor={`checkbox-${index}`}
                                style={{
                                  backgroundColor: checkedStates[index]
                                    ? "red"
                                    : "#02e802",
                                  boxShadow: checkedStates[index]
                                    ? "0px 4px 10px rgba(255, 0, 0, 0.5)"
                                    : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                  color: checkedStates[index]
                                    ? "white"
                                    : "black",
                                  border: "none",
                                  borderRadius: "5px",
                                  padding: "10px 15px",
                                  cursor: initiallyCheckedOut[index]
                                    ? "not-allowed"
                                    : "pointer",
                                  transition: "transform 0.2s ease",
                                  transform: checkedStates[index]
                                    ? "scale(1.05)"
                                    : "scale(1)",
                                  display: "inline-block",
                                }}
                              >
                                {member.card_id}
                              </label>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-boxes">
                        <label htmlFor="exit">Exit Gate:</label>
                        <select
                          name="exit"
                          id="exit"
                          value={selectedExit}
                          onChange={(e) => setSelectedExit(e.target.value)}
                        >
                          <option value="Gate 1">Gate 1</option>
                          <option value="Gate 2">Gate 2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="right-section-form">
                    <div className="photo-frame">
                      <label>Photo</label>
                      <div className="photo">
                        <img
                          src={visitorData?.photos || default_photo}
                          alt="Visitor"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-footer">
                  <button
                    onClick={handleCheckout}
                    style={{ backgroundColor: "#16a34a", width: 90 }}
                  >
                    Check-Out
                  </button>
                  <button type="reset" onClick={handleClear}>
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleClear();
                      navigate("/dashboard");
                    }}
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Checkout_Visitor;
