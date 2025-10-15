import { useState } from 'react'
import './App.css'
import Login from './Pages/FinalVisa/Login'
import Dashboard from './Pages/FinalVisa/Dashboard'
import Mainpages from './Pages/FinalVisa/Mainpages'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CountryPage from './Pages/FinalVisa/CountryPage'
import JobPage from './Pages/FinalVisa/JobPage'
import Leads from './Pages/FinalVisa/Leads'
import FullLeadPage from './Pages/FinalVisa/FullLeadPage'
import Office from './Pages/FinalVisa/Office'
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

          <Route path="/leads" element={
            <Dashboard>
              <Leads />
            </Dashboard>
          } />

          <Route path="/office" element={
            <Dashboard>
              <Office />
            </Dashboard>
          } />


          <Route path="leads/full-lead-page" element={
            <Dashboard>
              <FullLeadPage />
            </Dashboard>
          } />

        </Routes>
      </Router>
    </>
  )
}

export default App
