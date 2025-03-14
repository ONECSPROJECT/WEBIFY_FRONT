import React, {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from '../CSS/GlobalTimeTable.module.css'
function GlobalTimeTable() {


  // const [teacherList,setTeacherList]=useState([])
  // const[selectedteacherID, setselectedTeacherID]=useState()
  const [schedule, setSchedule] = useState({
    Sunday:[],Monday:[],Tuesday:[],Wednesday:[], Thursday:[]});
  const [newSession, setNewSession] = useState({day_of_week: "Sunday", start_time:"08:00:00", duration_minutes: "120", session_type:"Course"});



  function handleAddSession() {
    const {day_of_week,start_time,duration_minutes,session_type} = newSession;
    setSchedule(prev=>({...prev,[day_of_week]: [...prev[day_of_week], {start_time,duration_minutes: Number(duration_minutes),session_type }]}));
    }
  return (
    <>
              <Sidebar/>
<div className={styles.content}>
      <div>
        <h1>Tmetable</h1>
        <label>Day:</label>
        <select value={newSession.day_of_week} onChange={e=>setNewSession({...newSession, day_of_week:e.target.value })}>
          {Object.keys(schedule).map(day_of_week =><option key={day_of_week} value={day_of_week}>{day_of_week}</option>)}
        </select>
      </div>
      <div>
        <label>Start Time:</label>
        <input type="time" value={newSession.start_time} onChange={(e) =>setNewSession({ ...newSession, start_time:e.target.value })} />
      </div>
      <div>
        <label>Duration (in minutes):</label>
        <input type="text" placeholder="120 munites" value={newSession.duration_minutes} onChange={e => setNewSession({ ...newSession,duration_minutes: e.target.value })} />
      </div>
      <div>
        <label>Type of session:</label>
        <select value={newSession.session_type} onChange={e=>setNewSession({ ...newSession, session_type: e.target.value })}>
          <option value="Course">Course</option>
          <option value="TD">TD</option>
          <option value="TP">TP</option>
        </select>
      </div>
      {/* <div>
            <label>Teachers</label>
            <select value={newSession.teacher} onChange={e=>setNewSession({ ...newSession, teacher: e.target.value })}>
              {teacherList.map(teacher=> {<option key={teacher.teacherID}>{teacher.last_name}</option>})}
              </select>        
      </div> 
      <div>
      <label>Promotion</label>
      <select value={newSession.promotion} onChange={e=>setNewSession({ ...newSession, promotion: e.target.value })}>
          <option value="1CPI">1CPI</option>
          <option value="2CPI">2CPI</option>
          <option value="1CS">1CS</option>
          <option value="2CS">2CS</option>
          <option value="3CS">3CS</option>
        </select>
      </div>

      <div>
      <label>Group</label>
      <select value={newSession.group} onChange={e=>setNewSession({ ...newSession, group: e.target.value })}>
        </select>
      </div> */}
      <button onClick={handleAddSession}>Add Session</button>
      <table border="1">
        <thead>
          <tr><th>Day</th><th>Sessions</th></tr>
        </thead>
        <tbody>
          {Object.entries(schedule).map(([day_of_week, sessions]) => (
            <tr key={day_of_week}>
              <td>{day_of_week}</td>
              <td>
                  <ul>{sessions.map((s,index) => (
                    <li key={index}>
                 <td>{s.start_time}</td>  <td>{s.duration_minutes} minutes</td>  <td>{s.session_type}</td></li>))}</ul>: 
              </td>
            </tr>))}
        </tbody>
      </table>


      <button >Save Changes</button>
    </div>
    </>
    
);
    


}

export default GlobalTimeTable;
