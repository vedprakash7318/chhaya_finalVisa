import { useState } from 'react'
import './App.css'
import Login from './Pages/FinalVisa/Login'
import Dashboard from './Pages/FinalVisa/Dashboard'
import Mainpages from './Pages/FinalVisa/Mainpages'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CountryPage from './Pages/FinalVisa/CountryPage'
import JobPage from './Pages/FinalVisa/JobPage'
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />


          <Route path="/dashboard" element={
            <Dashboard>
              <Mainpages />
            </Dashboard>
          } />


          <Route path="/country" element={
            <Dashboard>
              <CountryPage />
            </Dashboard>
          } />

          <Route path="/jobs" element={
            <Dashboard>
              <JobPage />
            </Dashboard>
          } />

        </Routes>
      </Router>
    </>
  )
}

export default App
