import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import './App.css';
import GetStarted from './pages/GetStartedForm/GetStartedForm';

function App() {
  return (
    <div>
      {/* <h1>Hello world!!</h1> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
    </div>
  );
}

export default App;
