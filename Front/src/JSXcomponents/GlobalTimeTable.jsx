import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from '../CSS/GlobalTimeTable.module.css';

function GlobalTimeTable() {
  const [schedule, setSchedule] = useState({
    Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: []
  });
  const [newSession, setNewSession] = useState({day_of_week: "Sunday",start_time: "08:00:00",duration_minutes: "120",session_type: "Course",promotion: "",section: "",group: "",teacher: "",salle: ""});
  const [teachers, setTeachers] = useState([]);
  const [salles, setSalles] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [sections, setSections] = useState([]);
  const [groups, setGroups] = useState([]);
  

  useEffect(()=>{
    axios.get("http://localhost:3000/api/user/fetch-teachers").then(res => setTeachers(res.data));
    axios.get("http://localhost:3000/api/user/fetch-salles").then(res => setSalles(res.data));
    axios.get("http://localhost:3000/api/user/fetch-promotions").then(res => setPromotions(res.data));
  },[]);
  const handlePromotionChange = (e) => {
    const selectedPromotion = e.target.value;
    setNewSession({ ...newSession, promotion: selectedPromotion, section: "", group: "" });
    if (selectedPromotion) {
      axios.get(`http://localhost:3000/api/user/fetch-sections?promotion=${selectedPromotion}`)
        .then(res => setSections(res.data))
        .catch(err => console.error(err));
    }else {
      setSections([]);
      setGroups([]);}
  };
  const handleSectionChange = (e) => {
    const selectedSection = e.target.value;
    setNewSession({ ...newSession, section: selectedSection, group: "" });
  
    if (selectedSection) {
      axios.get(`http://localhost:3000/api/user/fetch-groups?section=${selectedSection}`)
        .then(res => setGroups(res.data))
        .catch(err => console.error(err));} 
      
    else {
      setGroups([]);}
  };
  

  function handleAddSession() {
    const { day_of_week, start_time, duration_minutes, session_type, promotion, section, group, teacher, salle } = newSession;
    setSchedule(prev => ({
      ...prev,
      [day_of_week]: [...prev[day_of_week], {start_time,duration_minutes: Number(duration_minutes),session_type,promotion,section,group,teacher,salle}]}));}

  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <h1>Global Timetable</h1>

        <div>
          <label>Day:</label>
          <select value={newSession.day_of_week} onChange={e => setNewSession({ ...newSession, day_of_week: e.target.value })}>
            {Object.keys(schedule).map(day => <option key={day} value={day}>{day}</option>)}
          </select>
        </div>

        <div>
          <label>Start Time:</label>
          <input type="time" value={newSession.start_time} onChange={e => setNewSession({ ...newSession, start_time: e.target.value })} />
        </div>

        <div>
          <label>Duration (minutes):</label>
          <input type="text" value={newSession.duration_minutes} onChange={e => setNewSession({ ...newSession, duration_minutes: e.target.value })} />
        </div>

        <div>
          <label>Type of session:</label>
          <select value={newSession.session_type} onChange={e => setNewSession({ ...newSession, session_type: e.target.value })}>
            <option value="Course">Course</option>
            <option value="TD">TD</option>
            <option value="TP">TP</option>
          </select>
        </div>

        <div>
  <label>Promotion:</label>
  <select value={newSession.promotion} onChange={handlePromotionChange}>
    <option value="">Select</option>
    {promotions.map(promo => (
      <option key={promo.name} value={promo.name}>{promo.name}</option>
    ))}
  </select>
</div>

{newSession.promotion && (
  <div>
    <label>Section:</label>
    <select value={newSession.section} onChange={handleSectionChange}>
      <option value="">Select</option>
      {sections.map(sec =>(
        <option key={sec.sectionID} value={sec.sectionID}>{sec.name}</option>
      ))}
    </select>
  </div>
)}

{newSession.section && (
  <div>
    <label>Group:</label>
    <select value={newSession.group} onChange={e => setNewSession({ ...newSession, group: e.target.value })}>
      <option value="">Select</option>
      {groups.map(group => (
        <option key={group.groupID} value={group.groupID}>{group.name}</option>
      ))}
    </select>
  </div>
)}


        {/* Teacher Selection */}
        <div>
          <label>Teacher:</label>
          <select value={newSession.teacher} onChange={e => setNewSession({ ...newSession, teacher: e.target.value })}>
            <option value="">Select</option>
            {teachers.map(teacher => (
              <option key={teacher.teacherID} value={teacher.teacherID}>
                {teacher.last_name} {teacher.first_name}
              </option>
            ))}
          </select>
        </div>

        {/* Salle Selection */}
        <div>
          <label>Salle:</label>
          <select value={newSession.salle} onChange={e => setNewSession({ ...newSession, salle: e.target.value })}>
            <option value="">Select</option>
            {salles.map(salle => (
              <option key={salle.salleID} value={salle.salleID}>{salle.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleAddSession}>Add Session</button>
        <table border="1">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Session Type</th>
              <th>Promotion</th>
              <th>Section</th>
              <th>Group</th>
              <th>Teacher</th>
              <th>Salle</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(schedule).map(([day, sessions]) =>
              sessions.map((s, index) => (
                <tr key={`${day}-${index}`}>
                  <td>{day}</td>
                  <td>{s.start_time}</td>
                  <td>{s.duration_minutes} min</td>
                  <td>{s.session_type}</td>
                  <td>{s.promotion}</td>
                  <td>{s.section||"All"}</td>
                  <td>{s.group||"All"}</td>
                  <td>{s.teacher||"All"}</td>
                  <td>{s.salle||"All"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button>Save Changes</button>
      </div>
    </>
  );
}

export default GlobalTimeTable;
