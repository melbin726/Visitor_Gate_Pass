import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage_KJC/LoginPage.jsx";
import Dashboard from "./pages/Main_Dashboard/Dashboard.jsx";
import Register_Visitor from "./pages/Register_Visitor/Register_Visitor.jsx";
import Checkout_Visitor from "./pages/Checkout_Visitor/Checkout_Visitor.jsx";
import Visitor_Details from "./pages/Visitor_Details/Visitor_Details.jsx";

function App() {
  // Suppress specific React warnings in development mode
  if (process.env.NODE_ENV === "development") {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        args[0] &&
        args[0].includes(
          'A props object containing a "key" prop is being spread'
        )
      ) {
        // Ignore the specific warning about `key` prop spreading
        return;
      }
      originalWarn(...args); // Call the original console.warn for other warnings
    };
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register_visitor" element={<Register_Visitor />} />
        <Route path="/checkout_visitor" element={<Checkout_Visitor />} />
        <Route path="/visitor_details" element={<Visitor_Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
