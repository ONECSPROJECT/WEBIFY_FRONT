import React,{ useState,useEffect } from 'react';
import styles from '../CSS/GlobalTimeTable.module.css'
import axios from "axios";
import Sidebar from './Sidebar';
function SupTimeTables(){
const [schedules, setSchedules]=useState([])
useEffect(()=>{
    const fetchSchedules=async () => {
      try {
        const responses = await Promise.all([
          axios.get(`http://localhost:3000/api/user/fetch-scheds?promoid=1`),
          axios.get(`http://localhost:3000/api/user/fetch-scheds?promoid=2`),
          axios.get(`http://localhost:3000/api/user/fetch-scheds?promoid=3`),
          axios.get(`http://localhost:3000/api/user/fetch-scheds?promoid=4`),
          axios.get(`http://localhost:3000/api/user/fetch-scheds?promoid=5`),
        ]);
 
        const data = responses.map((response)=>response.data); //extract ze data
        setSchedules(data)
        console.log(data)
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
 
    fetchSchedules();
 }, [])
    const promotionNames={
        0:"1CPI",
        1:"2CPI",
        2:"1CS",
        3:"2CS",
        4:"3CS"}
return(
    
             <>
             <Sidebar/>
             <div className={styles.content}>
             <div className={styles.scheds}>
             {schedules.map((schedule, index) => (
      <div key={index}>
    <h3>
      Schedule for Promotion {promotionNames[index] || "Unknown"} 
    </h3>    <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Session Type</th>
              <th>Speciality</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((s, idx) => (
              <tr key={idx}>
                <td>{s.day_of_week}</td>
                <td>{s.starttime}</td>
                <td>{s.duration} min</td>
                <td>{s.session_type}</td>
                <td>{s.speciality|| "null"}</td>
                <td>{s.teacher ||"not selected"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
            </div>
             </div>
             </>
)
}


export default SupTimeTables;