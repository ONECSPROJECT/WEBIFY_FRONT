import React, {useEffect, useState} from "react";
import axios from "axios";
import { useTeacher } from "./TeacherListCxt";
function Timetable() {

const {teacherList}=useTeacher();
const[selectedteacherID, setselectedTeacherID]=useState()
  const [schedule, setSchedule] = useState({
    Sunday:[],Monday:[],Tuesday:[],Wednesday:[], Thursday:[]});
  const [newSession, setNewSession] = useState({day_of_week: "Sunday", start_time:"08:00:00", duration_minutes: "120", session_type:"Course"});


async function save(e){
    e.preventDefault()
    try{
        await axios.post('',{selectedteacherID,schedule})
        console.log("Successful save")
    }
    catch(error){
        console.log("error")
    }
}
  function handleAddSession() {
    const {day_of_week,start_time,duration_minutes,session_type} = newSession;
    setSchedule(prev=>({...prev,[day_of_week]: [...prev[day_of_week], {start_time,duration_minutes: Number(duration_minutes),session_type}]}));
    }
  return (
    <div>
        <div>
            <h1>Teachers</h1>
            <ul>{Object.keys(teacherList).map(teacher =><button key={teacher.teacherID} onClick={setselectedTeacherID(teacher.teacherID)}>{teacher.first_name} {teacher.last_name}</button>)}</ul>
        </div>

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


      <button onClick={save}>Save Changes</button>
    </div>
    
    
);
    


}

export default Timetable;
