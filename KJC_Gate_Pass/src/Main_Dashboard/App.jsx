import "./App.css";
import SideBarNavi from '../My_Components/SideBarNavi/SideBarNavi.jsx';
import DashboardWidget from './DashboardWidget.jsx'

function App() {
  return (

    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi />
        <div className="content">
          <div className="fakeSideBAr" />
          <div className="Widgets">
            <DashboardWidget isCountWidget={true} widgets='totalVisitorCount' title='Total Visitor' count={46}/>
            <DashboardWidget isCountWidget={true} widgets='checkinVisitorCount' title='Check-in Visitor' count={14}/>
            <DashboardWidget isCountWidget={true} widgets='checkoutVisitorCount' title='Check-out Visitor' count={32}/>
            <DashboardWidget isCountWidget={false} widgets='registerVisitor' title='Register Visitor'/>
            <DashboardWidget isCountWidget={false} widgets='checkinVisitor' title='Check-in Visitor'/>
            <DashboardWidget isCountWidget={false} widgets='checkoutVisitor' title='Check-out Visitor'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
