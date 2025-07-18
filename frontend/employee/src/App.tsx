import {Routes, Route } from "react-router-dom";
import Layout from "@components/Layout";
import RequireAuth from "@components/RequireAuth";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Report from "@pages/Report";
import Payroll from "@pages/Payroll";
import ChangePassword from "@pages/ChangePassword";
import Vacation from "@pages/Vacation";
import Sales from "@pages/Sales";
import Client from "@pages/Client";


function App() {

  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RequireAuth><Home /></RequireAuth>}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/change-password" element={<ChangePassword />}/>
          <Route path="/client" element={<RequireAuth><Client /></RequireAuth>}/>
          <Route path="/payroll" element={<RequireAuth><Payroll /></RequireAuth>}/>
          <Route path="/report" element={<RequireAuth><Report /></RequireAuth>}/>
          <Route path="/vacation" element={<RequireAuth><Vacation /></RequireAuth>}/>
          <Route path="/sales" element={<RequireAuth><Sales /></RequireAuth>}/>
        </Route>
      </Routes>
  )
}

export default App
