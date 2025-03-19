import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from '../CSS/GlobalTimeTable.module.css';
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
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
  const [selectedSession, setSelectedSession] = useState(null);
  const [editmodal, seteditModal]=useState(false);
  const [deletemodal, setdeletemodal]=useState(false);


  function handleDeleteClick(session,day) {
    setdeletemodal(true)
    setSelectedSession({...session, originalDay: day, originalSession: session});
  
    console.log("deleting session:", session);
  }
  function handleDelete() {
    if (!selectedSession) return;
    setSchedule(prevSchedule =>{
      const updatedSchedule = { ...prevSchedule };
        updatedSchedule[selectedSession.originalDay]= updatedSchedule[selectedSession.originalDay].filter(
        session =>session!== selectedSession.originalSession
      );
      return updatedSchedule
    });

    setdeletemodal(false)
  }
  
  
  function handleEdit() {
    if (!selectedSession) return;
    setSchedule(prevSchedule => {
        const updatedSchedule = { ...prevSchedule };
        updatedSchedule[selectedSession.originalDay] = updatedSchedule[selectedSession.originalDay].filter(
            session =>session!==selectedSession.originalSession
        );
        return updatedSchedule
    });
    const { day_of_week, start_time, duration_minutes, session_type, promotion, section, group, teacher, salle } = selectedSession;
    let sectionName= "All"
    let groupName ="All"

    axios.get(`http://localhost:3000/api/user/fetch-section-name?sectionID=${section}`)
        .then(sectionRes => {
            sectionName = sectionRes.data.name || "All";
            return axios.get(`http://localhost:3000/api/user/fetch-group-name?groupID=${group}`);
        })
        .then(groupRes => {
            groupName = groupRes.data.name || "All";
            setSchedule(prev => ({
                ...prev,
                [day_of_week]: [
                    ...prev[day_of_week],
                    {start_time,duration_minutes: Number(duration_minutes),session_type,promotion,section: sectionName,group: groupName,teacher,salle}]}))
        })
        .catch(err =>console.error("Error fetching section or group name:", err));





    seteditModal(false)
}


  

  function handleEditClick(session,day) {
    seteditModal(true);
    
    setSelectedSession({...session, originalDay: day,originalSession: session 
    })
  
    console.log("editing session:",session)
  }


  

 function handleInputChange(e) {
  const { name, value } = e.target;
  setSelectedSession(prevSession => ({
    ...prevSession,
    [name]: value
  }));
  console.log("Updated Session:", selectedSession)

}









 
  
  
  useEffect(()=>{
    axios.get("http://localhost:3000/api/user/fetch-teachers").then(res => setTeachers(res.data));
    axios.get("http://localhost:3000/api/user/fetch-salles").then(res => setSalles(res.data))
    axios.get("http://localhost:3000/api/user/fetch-promotions").then(res => setPromotions(res.data))
  },[]);
  const handlePromotionChange =(e)=>{



    const selectedPromotion = e.target.value;
    setNewSession({ ...newSession, promotion: selectedPromotion, section: "", group: "" });
    if (selectedPromotion) {
      axios.get(`http://localhost:3000/api/user/fetch-sections?promotion=${selectedPromotion}`)
        .then(res =>setSections(res.data))
        .catch(err=> console.error(err));
    }else {
      setSections([]);
      setGroups([]);}
  };
  const handleSectionChange = (e) => {
    const selectedSection = e.target.value;
    setNewSession({ ...newSession, section:selectedSection, group: "" });
  
    if (selectedSection){
      axios.get(`http://localhost:3000/api/user/fetch-groups?section=${selectedSection}`)
        .then(res => setGroups(res.data))
        .catch(err => console.error(err));} 
      

        
    else {
      alert("crash")
      setGroups([])}
  };


  


  function handleAddSession(){
    const { day_of_week, start_time, duration_minutes, session_type, promotion, section, group, teacher, salle } = newSession;

    axios.get(`http://localhost:3000/api/user/fetch-section-name?sectionID=${section}`)
      .then(res => {
              console.log("Received section name", res.data)

        const sectionName = res.data.name|| "All" 
  
        // Fetch group name
        axios.get(`http://localhost:3000/api/user/fetch-group-name?groupID=${group}`)
          .then(groupRes => {
            const groupName = groupRes.data.name ||"All"
            setSchedule(prev => ({...prev, [day_of_week]:[
                ...prev[day_of_week],{ start_time, duration_minutes: Number(duration_minutes), session_type, promotion, section: sectionName, group: groupName,      teacher,salle}] }));
          })
          .catch(err => console.error("checkpoint error:", err))
      })
      .catch(err => console.error("checkpoint eroor:", err))
  }
  
      
      
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <h1>Global Timetable</h1>





        {editmodal && selectedSession && (
        <div className={styles.modal_overlay}>
          <div className={styles.modaledit}>
            <div className="modal-header">
              <div className="anh">
              <h2>Edit Session</h2>
              <AiOutlineClose className="close-icon" onClick={() => seteditModal(false)} />
            </div>
            </div>
            <form>
           
             <div>
          <label>Day:</label>
          <select name="day_of_week" value={selectedSession.day_of_week} onChange={handleInputChange}>
            {Object.keys(schedule).map(day => <option key={day} value={day}>{day}</option>)}
          </select>
        </div>

        <div>
          <label>Start Time:</label>
          <input name="start_time" type="time" value={selectedSession.start_time} onChange={handleInputChange} />
        </div>

        <div>
          <label>Duration (minutes):</label>
          <input name="duration_minutes" type="text" value={selectedSession.duration_minutes} onChange={handleInputChange} />
        </div>

        <div>
          <label>Type of session:</label>
          <select name="session_type" value={selectedSession.session_type} onChange={handleInputChange}>
            <option value="Course">Course</option>
            <option value="TD">TD</option>
            <option value="TP">TP</option>
          </select>
        </div>

        <div>
  <label>Promotion:</label>
  <select name="promotion" value={selectedSession.promotion} onChange={(e)=>{handlePromotionChange(e);
    handleInputChange(e);
  }}>
    <option value="">Select</option>
    {promotions.map(promo => (
      <option key={promo.name} value={promo.name}>{promo.name}</option>
    ))}
  </select>
</div>

{selectedSession.promotion && (
  <div>
    <label>Section:</label>
    <select name="section" value={selectedSession.section} onChange={(e)=> {    handleSectionChange(e)
handleInputChange(e);
    }}>
      <option value="">Select</option>
      {sections.map(sec =>(
        <option key={sec.sectionID} value={sec.sectionID}>{sec.name}</option>
      ))}
    </select>
  </div>
)}

{selectedSession.section && (
  <div>
    <label>Group:</label>
    <select name="group" value={selectedSession.group} onChange={handleInputChange}>
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
          <select name="teacher" value={selectedSession.teacher}onChange={handleInputChange}>
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
          <select name="salle" value={selectedSession.salle} onChange={handleInputChange}>
            <option value="">Select</option>
            {salles.map(salle => (
              <option key={salle.salleID} value={salle.salleID}>{salle.name}</option>
            ))}
          </select>
        </div>


        <div className="btnddiv">
                <button type="button" className="close-btn" onClick={() => seteditModal(false)}>Cancel</button>
                <button type="button"className="submited-btn" onClick={handleEdit}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}


{deletemodal&& (
        <div className="modaldelete">
          <div className="modaldelete-content">
          <div className="anh">
            <h3>Remove this {selectedSession.originalDay} session?</h3>
            <AiOutlineClose className="close-icon" onClick={() => setdeletemodal(false)} />
           </div>
          <hr />
            <h6>
              Are you sure you want to remove <strong>{selectedSession?.originalDay} session at {selectedSession.start_time} and tought by {selectedSession.teacher}</strong>? This action cannot be undone.
            </h6>
            <div className="btnddiv">
            <button className="cancel" onClick={() => setdeletemodal(false)}>
              Cancel
            </button>
            <button className="confirm" onClick={handleDelete}>
              Confirm
            </button>
            </div>
          </div>
        </div>
      )}













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
        <option key={group.groupID}  value={group.groupID}>{group.name}</option>
      ))}
    </select>
  </div>
)}


        {/* Teacher Selection */}
        <div>
          <label>Teacher:</label>
          <select required value={newSession.teacher} onChange={e => setNewSession({ ...newSession, teacher: e.target.value })}>
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
              <th>Actions</th>
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
                  <td>{s.teacher||"Not selected"}</td>
                  <td>{s.salle||"Not selected"}</td>
                  <td>
                                  <button className="edit" onClick={() => handleEditClick(s, day)}>
                                    <FaEdit />
                                  </button>
                                  <button className={styles.delete} onClick={() => handleDeleteClick(s, day)}>
                                    <FaTrash />
                                  </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button>Save Changes</button>
      </div>
    </>
  )
}

export default GlobalTimeTable;
