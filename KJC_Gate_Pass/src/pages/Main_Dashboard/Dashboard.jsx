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

import { useEffect, useState } from "react";

import useWindowSize from '../../hooks/useWindowSize';
import axios from 'axios'; // Import axios

function Dashboard() {
  const { width, height } = useWindowSize();
  // const visitorData = [
  //   {
  //       name: "John Doe",
  //       phone_number: "1234567890",
  //       purpose_of_visit: "Campus Tour",
  //       entry_gate: "Gate 1",
  //       check_in_time: "2024-06-26T09:00:00Z",
  //       exit_gate: "Gate 1",
  //       check_out_time: "2024-06-26T17:00:00Z",
  //       group_size: 4,
  //       visitor_cards: [
  //           { card_id: 101, status: "checked_out" },
  //           { card_id: 102, status: "checked_in" }
  //       ],
  //       photos: ["photo1.jpg", "photo2.jpg"]
  //   },
  //   // Add more visitor objects as needed
  // ];  
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await axios.get('http://192.168.29.126:3001/api/visitors');
        setVisitorData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
        setLoading(false);
      }
    };
  
    fetchVisitorData();
  }, []);
 

  useEffect(() => {
    document.title = `Dashboard: ${width} x ${height}`;
  }, [width, height]);

  let totalVisitors = 0;
  let checkedInVisitors = 0;
  let checkedOutVisitors = 0;

  visitorData.forEach(visitor => {
    visitor.visitor_cards.forEach(card => {
        if (card.status === "checked_in") {
            checkedInVisitors++;
        } else if (card.status === "checked_out") {
            checkedOutVisitors++;
        }
    });
  });

  totalVisitors = checkedInVisitors + checkedOutVisitors;
  

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi />
        <div className="content">
          <div className="fakeSideBAr"></div>
          <main className="main-content">
            <div className="Widgets">
              <DashboardWidget isCountWidget={true} icon={totalVisitorIcons} widgets='totalVisitorCount' title='Total Visitor' count={totalVisitors} />
              <DashboardWidget isCountWidget={true} icon={CheckinCountICon} widgets='checkinVisitorCount' title='Check-in Visitor' count={checkedInVisitors} />
              <DashboardWidget isCountWidget={true} icon={CheckoutCountICon} widgets='checkoutVisitorCount' title='Check-out Visitor' count={checkedOutVisitors} />
              <DashboardWidget isCountWidget={false} icon={registerIcon} widgets='registerVisitor' title='Register Visitor' />
              <DashboardWidget isCountWidget={false} icon={checkinIcon} widgets='checkinVisitor' title='Check-in Visitor' />
              <DashboardWidget isCountWidget={false} icon={checkoutIcon} widgets='checkoutVisitor' title='Check-out Visitor' />
            </div>
            <div className="data-grid">
              <TotalVisitorTable visitors={visitorData} isLoading={loading} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
