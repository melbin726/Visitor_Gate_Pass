import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage_KJC/LoginPage.jsx';
import Dashboard from './pages/Main_Dashboard/Dashboard.jsx';
import Register_Visitor from './pages/Register_Visitor/Register_Visitor.jsx';
import Checkout_Visitor from './pages/Checkout_Visitor/Checkout_Visitor.jsx';
import Visitor_Details from './pages/Visitor_Details/Visitor_Details.jsx';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/register_visitor' element={<Register_Visitor />} />
                <Route path='/checkout_visitor' element={<Checkout_Visitor />} />
                <Route path='/Visitor_Details' element={<Visitor_Details />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
