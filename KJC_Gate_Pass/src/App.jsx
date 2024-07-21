import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage_KJC/LoginPage.jsx';
import Dashboard from './pages/Main_Dashboard/Dashboard.jsx';
import Register_Visitor from './pages/Register_Visitor/Register_Visitor.jsx';
import Checkout_Visitor from './pages/Checkout_Visitor/Checkout_Visitor.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/register_visitor' element={<Register_Visitor />} />
                <Route path='/checkout_visitor' element={<Checkout_Visitor />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
