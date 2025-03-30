import React from "react";
import { FaChalkboardTeacher, FaCalendarAlt, FaMoneyBill, FaClock, FaCog, FaSignOutAlt,FaCalendarCheck } from "react-icons/fa"; 
import styles from '../CSS/Sidebar.module.css';
import { NavLink,useNavigate } from "react-router-dom";



const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("authToken"); 
      navigate("/"); 
    };
  
  return (
    <div className={styles.sidebar}>
        <div className={styles.lien}>
      <h2>Admin Panel</h2>
      <ul>
        <NavLink to="/adminpage/manage-teachers" className={styles.navitem}>
          <FaChalkboardTeacher className={styles.icon} /> Manage Teachers</NavLink>
        <NavLink to="/adminpage/manage-absences" className={styles.navitem}><FaCalendarAlt className={styles.icon} /> Manage Absences</NavLink>
        <NavLink to="/adminpage/global-timetable" className={styles.navitem}><FaCalendarCheck className={styles.icon} />Global TimeTable</NavLink>
        <NavLink to="/adminpage/payment" className={styles.navitem}>
          <FaMoneyBill className={styles.icon} /> Payments</NavLink>
        <NavLink to="/adminpage/sup-hours-timetable" className={styles.navitem}>
          <FaClock className={styles.icon} /> Sup Hours Timetable </NavLink>
        <NavLink to="/adminpage/settings" className={styles.navitem}>
          <FaCog className={styles.icon} /> Setting</NavLink>
      </ul>
      </div>
      <div className={styles.btnlogout}>
      <button className={styles.logout} onClick={handleLogout}><FaSignOutAlt className={styles.icon} /> Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
