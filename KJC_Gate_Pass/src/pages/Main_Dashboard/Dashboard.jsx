import "./Dashboard.css";
import SideBarNavi from '../../components/SideBarNavi/SideBarNavi.jsx';
import DashboardWidget from './DashboardWidget.jsx';
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

  useEffect(() => {
    document.title = `Dashboard: ${width} x ${height}`;
  }, [width, height]);

  return (

    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi />
        <div className="content">
          <div className="fakeSideBAr" />
          <div className="Widgets">
            <DashboardWidget isCountWidget={true} icon={totalVisitorIcons} widgets='totalVisitorCount' title='Total Visitor' count={46}/>
            <DashboardWidget isCountWidget={true} icon={CheckinCountICon} widgets='checkinVisitorCount' title='Check-in Visitor' count={14}/>
            <DashboardWidget isCountWidget={true} icon={CheckoutCountICon} widgets='checkoutVisitorCount' title='Check-out Visitor' count={32}/>
            <DashboardWidget isCountWidget={false} icon={registerIcon} widgets='registerVisitor' title='Register Visitor'/>
            <DashboardWidget isCountWidget={false} icon={checkinIcon} widgets='checkinVisitor' title='Check-in Visitor'/>
            <DashboardWidget isCountWidget={false} icon={checkoutIcon} widgets='checkoutVisitor' title='Check-out Visitor'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
