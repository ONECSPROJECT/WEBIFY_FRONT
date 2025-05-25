import React from "react";
import styles from'../CSS/Dashboard.module.css';
import logo from '../assets/Screenshot 2025-05-25 171048.png'
const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
    <div className={styles.contenta}>
      <div className={styles.logo}>
        <img src={logo} alt="abc" />
        </div> 
      <h2 className={styles.wh2}>Welcome to the Admin Panel</h2>
      <h2 className={styles.paragr}>Manage everything with ease.</h2> 
      <button className={styles.getstarted}>Get Started</button> 
    </div>
  </div>
  );
};

export default Dashboard;
