import React from "react";
import { FaChalkboardTeacher, FaCalendarAlt, FaMoneyBill, FaClock, FaCog, FaSignOutAlt,FaCalendarCheck } from "react-icons/fa"; 
import "../CSS/Sidebar.css";
import { NavLink,useNavigate } from "react-router-dom";



const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("authToken"); 
      navigate("/"); 
    };
  
  return (
    <div className="sidebar">
        <div className="lien">
      <h2>Admin Panel</h2>
      <ul>
        <NavLink to="/adminpage/manage-teachers" className="nav-item">
          <FaChalkboardTeacher className="icon" /> Manage Teachers</NavLink>
        <NavLink to="/adminpage/manage-absences" className="nav-item"><FaCalendarAlt className="icon" /> Manage Absences</NavLink>
        <NavLink to="/adminpage/global-timetable" className="nav-item"><FaCalendarCheck className="icon" />Global TimeTable</NavLink>
        <NavLink to="/adminpage/payments" className="nav-item">
        <FaMoneyBill className="icon" /> Payments</NavLink>
      
        <NavLink to="/adminpage/sup-hours-timetable" className="nav-item">
          <FaClock className="icon" /> Sup Hours Timetable </NavLink>
        <NavLink to="/adminpage/settings" className="nav-item">
          <FaCog className="icon" /> Setting</NavLink>
      </ul>
      </div>
      <div className="btnlogout">
      <button className="logout" onClick={handleLogout}><FaSignOutAlt className="icon" /> Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
