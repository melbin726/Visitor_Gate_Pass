import './SideBarNavi.css';
import circleLogo from '../../assets/KJC_CircLe_Logo_Blu.svg';
import dashboardIcon from '../../assets/Icons/HomeBlack_Icon.svg';
import registerIcon from '../../assets/Icons/RegisterBlack_Icon.svg';
import checkinIcon from '../../assets/Icons/CheckinBlack_Icon.svg';
import checkoutIcon from '../../assets/Icons/CheckoutBlack_Icon.svg';
import logoutIcon from '../../assets/Icons/LogoutVectorRed_Icon.svg';


function SideBarNavi(){
    return(
        <div className='sideNaviBar'>
            <div className='logoNavi'>
                <img src={circleLogo} alt="KJC_CircLe_Logo_Blu.svg" />
                <div className='naviGroups'>
                    <div className='naviLinks' id='dashboardLink'>
                        <img className='icons' src={dashboardIcon} alt="HomeBlack_Icon" />
                        <p>Dashboard</p>
                    </div>
                    <div className='naviLinks' id='registerLink'>
                        <img className='icons' src={registerIcon} alt="RegisterBlack_Icon" />
                        <p>Register Visitor</p>
                    </div>
                    <div className='naviLinks' id='checkinLink'>
                        <img className='icons' src={checkinIcon} alt="CheckinBlack_Icon" />
                        <p>Check-In Visitor</p>
                    </div>
                    <div className='naviLinks' id='checkoutLink'>
                        <img className='icons' src={checkoutIcon} alt="CheckoutBlack_Icon" />
                        <p>Check-out Visitor</p>
                    </div>                    
                </div>            
            </div>
            <div className='logout'>
                <img src={logoutIcon} alt="LogoutVectorRed_Icon" />
                <p>Logout</p>
            </div>
        </div>
    );
}

export default SideBarNavi;