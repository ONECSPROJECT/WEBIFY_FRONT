import React from "react";
import styles from'../CSS/Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
    <div className={styles.contenta}>
      <div className={styles.logo}>logo</div> 
      <h2 className={styles.wh2}>Welcome to the Admin Panel</h2>
      <p className={styles.paragr}>Manage everything with ease.</p> 
      <button className={styles.getstarted}>Get Started</button> 
    </div>
  </div>
  );
};

export default Dashboard;
