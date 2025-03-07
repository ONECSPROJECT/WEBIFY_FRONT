import React from "react";
import { FaChalkboardTeacher, FaCalendarAlt, FaMoneyBill, FaClock, FaCog, FaSignOutAlt } from "react-icons/fa"; 
import "../CSS/Sidebar.css";
import { useNavigate } from "react-router-dom";



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
        <li><FaChalkboardTeacher className="icon" /> Manage Teachers</li>
        <li><FaCalendarAlt className="icon" /> Manage Absences</li>
        <li><FaMoneyBill className="icon" /> Payments</li>
        <li><FaClock className="icon" /> Sup Hours Timetable</li>
        <li><FaCog className="icon" /> Setting</li>
      </ul>
      </div>
      <div className="btnlogout">
      <button className="logout" onClick={handleLogout}><FaSignOutAlt className="icon" /> Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
