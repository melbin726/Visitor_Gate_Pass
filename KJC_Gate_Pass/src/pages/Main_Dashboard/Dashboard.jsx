//Dasboard.jsx

import "./Dashboard.css";
import SideBarNavi from '../../components/SideBarNavi/SideBarNavi.jsx';
import DashboardWidget from './DashboardWidget.jsx';
import TotalVisitorTable from "../../components/DataGrid/TotalVisitorTable.jsx";

import totalVisitorIcons from '../../assets/Icons/TotalVisitoirBlack_Icon.svg';
import CheckinCountICon from '../../assets/Icons/CheckinCount_Icon.svg';
import CheckoutCountICon from '../../assets/Icons/CheckoutCount_Icon.svg';
import registerIcon from '../../assets/Icons/RegisterBlack_Icon.svg';
import checkinIcon from '../../assets/Icons/CheckinBlack_Icon.svg';
import checkoutIcon from '../../assets/Icons/CheckoutBlack_Icon.svg';

import { useEffect, useState} from "react";
import useWindowSize from '../../hooks/useWindowSize';

function Dashboard() {
  
  const { width, height } = useWindowSize();
  const visitorData = [
    {
      id: 1,
      name: "John Doe",
      phone_number: "1234567890",
      purpose_of_visit: "Campus Tour",
      entry_gate: "Gate 1",
      check_in_time: "2024-06-26T09:00:00Z",
      exit_gate: "Gate 1",
      check_out_time: "2024-06-26T17:00:00Z",
      group_size: 2,
      visitor_cards: [
        { card_id: 101, status: "checked_out" },
        { card_id: 102, status: "checked_in" }
      ],
      photos: "photo1.jpg"
    },
    {
      id: 2,
      name: "Jane Smith",
      phone_number: "0987654321",
      purpose_of_visit: "Meeting",
      entry_gate: "Gate 1",
      check_in_time: "2024-06-27T10:00:00Z",
      exit_gate: "Gate 2",
      check_out_time: "2024-06-27T16:00:00Z",
      group_size: 1,
      visitor_cards: [
        { card_id: 103, status: "checked_out" }
      ],
      photos: "photo2.jpg"
    },
    {
      id: 3,
      name: "Alice Johnson",
      phone_number: "1122334455",
      purpose_of_visit: "Interview",
      entry_gate: "Gate 2",
      check_in_time: "2024-06-28T11:00:00Z",
      exit_gate: "Gate 1",
      check_out_time: "2024-06-28T15:00:00Z",
      group_size: 1,
      visitor_cards: [
        { card_id: 104, status: "checked_out" }
      ],
      photos: "photo3.jpg"
    },
    {
      id: 4,
      name: "Bob Brown",
      phone_number: "2233445566",
      purpose_of_visit: "Workshop",
      entry_gate: "Gate 2",
      check_in_time: "2024-06-29T08:00:00Z",
      exit_gate: "Gate 2",
      check_out_time: "2024-06-29T12:00:00Z",
      group_size: 3,
      visitor_cards: [
        { card_id: 105, status: "checked_in" },
        { card_id: 106, status: "checked_out" },
        { card_id: 107, status: "checked_in" }
      ],
      photos: "photo4.jpg"
    },
    {
      id: 5,
      name: "Cathy White",
      phone_number: "3344556677",
      purpose_of_visit: "Conference",
      entry_gate: "Gate 1",
      check_in_time: "2024-06-30T09:30:00Z",
      exit_gate: "Gate 1",
      check_out_time: "2024-06-30T18:00:00Z",
      group_size: 2,
      visitor_cards: [
        { card_id: 108, status: "checked_out" },
        { card_id: 109, status: "checked_out" }
      ],
      photos: "photo5.jpg"
    },
    {
      id: 6,
      name: "Daniel Green",
      phone_number: "4455667788",
      purpose_of_visit: "Networking Event",
      entry_gate: "Gate 1",
      check_in_time: "2024-07-01T10:00:00Z",
      exit_gate: "Gate 1",
      check_out_time: "2024-07-01T17:00:00Z",
      group_size: 4,
      visitor_cards: [
        { card_id: 110, status: "checked_in" },
        { card_id: 111, status: "checked_in" },
        { card_id: 112, status: "checked_in" },
        { card_id: 113, status: "checked_in" }
      ],
      photos: "photo6.jpg"
    },
  
      // Add more visitor objects as needed
  ];

  useEffect(() => {
    document.title = `Dashboard: ${width} x ${height}`;
  }, [width, height]);

  return (

    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi />
        <div className="content">
          <div className="fakeSideBAr">
          </div>
          <main className="main-content">
            <div className="Widgets">
              <DashboardWidget isCountWidget={true} icon={totalVisitorIcons} widgets='totalVisitorCount' title='Total Visitor' count={46}/>
              <DashboardWidget isCountWidget={true} icon={CheckinCountICon} widgets='checkinVisitorCount' title='Check-in Visitor' count={14}/>
              <DashboardWidget isCountWidget={true} icon={CheckoutCountICon} widgets='checkoutVisitorCount' title='Check-out Visitor' count={32}/>
              <DashboardWidget isCountWidget={false} icon={registerIcon} widgets='registerVisitor' title='Register Visitor'/>
              <DashboardWidget isCountWidget={false} icon={checkinIcon} widgets='checkinVisitor' title='Check-in Visitor'/>
              <DashboardWidget isCountWidget={false} icon={checkoutIcon} widgets='checkoutVisitor' title='Check-out Visitor'/>
            </div>
            <div className="data-grid">
              <TotalVisitorTable  visitors={visitorData}/>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
