import { Link, useNavigate } from 'react-router-dom';
import './SideBarNavi.css';
import circleLogo from '../../assets/KJC_CircLe_Logo_Blu.svg';
import dashboardIcon from '../../assets/Icons/HomeBlack_Icon.svg';
import registerIcon from '../../assets/Icons/RegisterBlack_Icon.svg';
import VisitorDetails from '../../assets/Icons/VisitorDetails.svg';
import checkoutIcon from '../../assets/Icons/CheckoutBlack_Icon.svg';

function SideBarNavi(props){

    const navigate = useNavigate();

    return(
        <div className='sideNaviBar'>
            <div className='logoNavi'>
                <img src={circleLogo} alt="KJC_CircLe_Logo_Blu.svg" />
                <div className='naviGroups'>
                    <div className={`naviLinks ${props.activeLink == 'dashboardLink' ? 'selected' : ''}`} id={`dashboardLink`} onClick={() => navigate('/dashboard')}>
                        <img className='icons' src={dashboardIcon} alt="HomeBlack_Icon" />
                        <p>Dashboard</p>
                    </div>
                    <div className={`naviLinks ${props.activeLink == 'registerLink' ? 'selected' : ''}`} id='registerLink' onClick={() => navigate('/register_visitor')}>
                        <img className='icons' src={registerIcon} alt="RegisterBlack_Icon" />
                        <p>Register Visitor</p>
                    </div>
                    <div className={`naviLinks ${props.activeLink == 'checkoutLink' ? 'selected' : ''}`} id='checkoutLink' onClick={() => navigate('/checkout_visitor')}>
                        <img className='icons' src={checkoutIcon} alt="CheckoutBlack_Icon" />
                        <p>Check-out Visitor</p>
                    </div>
                    <div className={`naviLinks ${props.activeLink == 'VisiorDetailsLink' ? 'selected' : ''}`} id='VisiorDetailsLink' onClick={() => navigate('/visitor_details')}>
                        <img className='icons' src={VisitorDetails} alt="Visitor_Details" />
                        <p>Visitor Details</p>
                    </div>
                </div>         
            </div>
            <Link to={'/login'} className='logout'>
            <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 512 512">
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"/>
            </svg>
            <p>Logout</p>
            </Link>
        </div>
    );
}

export default SideBarNavi;