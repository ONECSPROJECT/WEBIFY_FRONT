import React from "react";
import styles from'../CSS/Dashboard.module.css';
import { NavLink,useNavigate } from "react-router-dom";
const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
    <div className={styles.contenta}>
      <div className={styles.logo}>logo</div> 
      <h2 className={styles.wh2}>Welcome to the Admin Panel</h2>
      <h2 className={styles.paragr}>Manage everything with ease.</h2> 
      <NavLink to="/adminpage/manage-teachers" >
      <button className={styles.getstarted}>Get Started</button> 
      </NavLink>
    </div>
  </div>
  );
};

export default Dashboard;
