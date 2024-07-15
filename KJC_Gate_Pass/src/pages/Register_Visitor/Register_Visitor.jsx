  //Dasboard.jsx

import "./Register_Visitor.css";
import SideBarNavi from '../../components/SideBarNavi/SideBarNavi.jsx';
import registerFormIcon from '../../assets/Icons/RegisterFormIcon.svg';

import { useEffect, useState } from "react";
import useWindowSize from '../../hooks/useWindowSize.jsx';
import axios from 'axios'; // Import axios

function Register_Visitor() {
  const { width, height } = useWindowSize();

  useEffect(() => {
    document.title = `Register_Visitor: ${width} x ${height}`;
  }, [width, height]);

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <SideBarNavi />
        <div className="content">
          <div className="fakeSideBAr"/>
          <main className="main-content">
            <div className="register-form">
              <div className="form-title">
                <img src={registerFormIcon} alt="registerFormIcon.svg" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Register_Visitor;
