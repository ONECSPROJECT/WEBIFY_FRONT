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
  const [newSession, setNewSession] = useState({day_of_week: "Sunday",start_time: "08:00:00",duration_minutes: "120",session_type: "Course",promotion: "",speciality:"", teacher: ""});
  const [teachers, setTeachers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [specialities, setSpecialities] = useState([])
  const [sessions,setSessions]=useState([])
  const [specName,setSpecName]=useState(null);
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
   


    seteditModal(false)
}


  

  function handleEditClick(session,day) {
    seteditModal(true)
    setSelectedSession({...session, originalDay: day,originalSession: session })
    console.log("editing session:",session)
  }


  

 function handleInputChange(e) {
  const { name, value } = e.target;
  setSelectedSession(prevSession => ({
    ...prevSession,
    [name]: value }))
  console.log("Updated Session:", selectedSession)

}









 
  
  
  useEffect(()=>{
    axios.get("http://localhost:3000/api/user/fetch-teachers").then(res=>setTeachers(res.data));
    axios.get("http://localhost:3000/api/user/fetch-promotions").then(res=>setPromotions(res.data))
    axios.get("http://localhost:3000/api/user/fetch-sessions").then(res =>setSessions(res.data))

  },[]);
  


  const handlePromotionChange =(e)=>{


    const selectedPromotion = e.target.value;
    setNewSession({ ...newSession, promotion: selectedPromotion, speciality: "" });
    if (selectedPromotion) {
      axios.get(`http://localhost:3000/api/user/fetch-speciality?promotion=${selectedPromotion}`)
        .then(res =>setSpecialities(res.data))
        .catch(err=> console.error(err));
    }else {
      setSpecialities([])}
  }


  const handleSpecialityChange = async(e) =>{
    const selectedSpec=e.target.value
    setNewSession(prev => ({ ...prev,speciality:selectedSpec}))
if (selectedSpec){
  try{
    const response= await axios.get(`http://localhost:3000/api/user/fetch-speciality-name?specialityid=${selectedSpec}`)
    setSpecName(response.data.name)
    console.log(specName)
  }
  catch(error){
    console.log("error fetching the spec name")
  }
}
  };


  function handleAddSession(){
    const { day_of_week, start_time, duration_minutes, session_type, promotion,speciality, teacher} = newSession;

 
            setSchedule(prev => ({...prev, [day_of_week]:[
                ...prev[day_of_week],{ start_time, duration_minutes: Number(duration_minutes), session_type, promotion, speciality:specName,teacher,}] }))
                setSpecName("")
    
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
  <select name="promotion" value={selectedSession.promotion} onChange={(e)=>{handleInputChange(e)}}>
    <option value="">Select</option>
    {promotions.map(promo => (
      <option key={promo.name} value={promo.name}>{promo.name}</option>
    ))}
  </select>
</div>





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

        {/*session type selection*/}
        <div>
          <label>Type of session:</label>
          <select required value={newSession.session_type} onChange={e=> {
    setNewSession({ ...newSession, session_type: e.target.value })}}>
            <option value="">Select</option>
            {sessions.map(session => (
              <option key={session.session_type_id} value={session.name}>
               {session.name}
              </option>))}
          </select>
        </div>

  

  {/*Promotion selection*/}
  <div>
  <label>Promotion</label>
  <select required value={newSession.promotion} onChange={e => {handlePromotionChange(e)
    setNewSession({ ...newSession, promotion: e.target.value })}}>
            <option value="">Select</option>
            {promotions.map(promotion => (
              <option key={promotion.promoid} value={promotion.promoid}>
               {promotion.name}
              </option>
            ))}
          </select>
  </div>

    {/*Speciality selection*/}
    <div>
  <label>Speciality</label>
  <select  value={newSession.speciality} onChange={handleSpecialityChange}>
            <option value="">Select</option>
            {specialities.map(speciality => (
              <option key={speciality.specialityid} value={speciality.specialityid}>
               {speciality.name}
              </option>
            ))}
          </select>
  </div>




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

        <button onClick={handleAddSession}>Add Session</button>
        <table border="1">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Session Type</th>
              <th>Promotion</th>
              <th>Speciality</th>
              <th>Teacher</th>
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
                  <td>{s.speciality ||"Null"}</td>
                  <td>{s.teacher||"Not selected"}</td>
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
