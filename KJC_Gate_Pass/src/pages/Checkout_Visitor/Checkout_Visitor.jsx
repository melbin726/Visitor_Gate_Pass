import "./Checkout_Visitor.css";
import SideBarNavi from '../../components/SideBarNavi/SideBarNavi.jsx';
import registerFormIcon from '../../assets/Icons/RegisterFormIcon.svg';
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast , Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowSize from '../../hooks/useWindowSize.jsx';
import axios from 'axios';

function Checkout_Visitor() {
  const { width, height } = useWindowSize();
 
  useEffect(() => {
    document.title = `Checkout_Visitor: ${width} x ${height}`;
  }, [width, height]);


  return (
    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi activeLink="checkoutLink" />
        <div className="content">
          <div className="fakeSideBAr" />
          <main className="mainContent">
            <div className="checkout-register-form">
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Checkout_Visitor;
