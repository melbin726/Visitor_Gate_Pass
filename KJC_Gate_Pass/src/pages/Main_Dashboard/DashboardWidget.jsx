import "./DashboardWidget.css"


function DashboardWidget(props){
    if(!props.isCountWidget){
        return(
            <div className={`widgetCard ${props.widgets}`}>
            <img src={props.icon} alt="TotalVisitoirBlack_Icon" />
            <div className="textss">
                <p>{props.title}</p>
            </div>
        </div>
        );
    }
    return(
        <div className={`widgetCard ${props.widgets}`}>
            <img src={props.icon} alt="TotalVisitoirBlack_Icon" />
            <div className="texts">
                <p>{props.title}</p>
                <h3>{props.count}</h3>
            </div>
        </div>
    );
}

export default DashboardWidget;