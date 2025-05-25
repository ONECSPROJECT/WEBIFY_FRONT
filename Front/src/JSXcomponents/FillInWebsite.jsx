import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from '../CSS/GlobalTimeTable.module.css';
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
function FillInWebsite() {
  const [weekDays, setWeekDays] = useState([ 
    {id: 1,name: "Sunday" },
    {id: 2, name:"Monday" },
    {id:3,name:"Tuesday" },
    { id: 4,name:"Wednesday" },
    {id:5, name: "Thursday" }])
const [schedules, setSchedules]=useState([])
const [date,setDate]=useState(new Date().toISOString().split("T")[0])
    const[counter, setCounter]=useState(0)
  const [schedule, setSchedule] = useState({Sunday:[], Monday: [], Tuesday:[], Wednesday:[], Thursday: []})
  const [newSession, setNewSession] = useState({day_of_week: "Sunday",start_time: "08:00:00",duration_minutes: "120",session_type: "Course",promotion: "",speciality:"", teacher: "", isExtra:false});
  const [teachers, setTeachers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [specialities, setSpecialities] = useState([])
  const [sessions,setSessions]=useState([])
  const [specName,setSpecName]=useState(null);
  const [selectedSession, setSelectedSession] = useState(null)
  const [editmodal, seteditModal]=useState(false);
  const [deletemodal, setdeletemodal]=useState(false);
  const [showScheds, setShowSheds]=useState(true)
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
  useEffect(() =>{
    async function searchPeriod(){
      try {
        const response = await axios.get(`http://localhost:3000/api/user/get-period?date=${date}`)
        console.log("period is", response.data)
        setCounter(response.data)
      } catch (err) {
        console.log(err)
      }
    }
  
    searchPeriod();
  }, [])
  
  useEffect(()=>{
    console.log("counter is", counter)
  },[counter])
  
  
  function handleEdit() {
    if (!selectedSession) return;
  
    setSchedule(prevSchedule => {
      const updatedSchedule = { ...prevSchedule };
      const newDay = selectedSession.day_of_week ||selectedSession.originalDay; //there's always a valid day
        updatedSchedule[selectedSession.originalDay]= updatedSchedule[selectedSession.originalDay].filter(
        session =>session!==selectedSession.originalSession
      )
      if (newDay!== selectedSession.originalDay){
        updatedSchedule[newDay] =updatedSchedule[newDay]?.filter(
          session=> session !==selectedSession.originalSession)||[]
      }
      updatedSchedule[newDay].push({ ...selectedSession })
      return updatedSchedule
    })
    seteditModal(false)
  }
  


  

  function handleEditClick(session,day) {
    seteditModal(true)
    setSelectedSession({...session, originalDay: day,originalSession: session, day_of_week: session.day_of_week || day })
    console.log("editing session:",session)

  }


  

 function handleInputChange(e) {
  const { name, value } = e.target
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
    const { day_of_week, start_time, duration_minutes, session_type, promotion,speciality, teacher, isExtra} = newSession;

 
            setSchedule(prev => ({...prev, [day_of_week]:[
                ...prev[day_of_week],{ start_time, duration_minutes: Number(duration_minutes), session_type, promotion, speciality:specName,teacher, isExtra}] }))
                setSpecName("")
                console.log(newSession)
                console.log( typeof newSession.session_type)
    
  }
  

  function handleSaveSchedule() {

    if (!schedule||!weekDays.length){
      console.error(weekDays.length)
      alert ("MANKHDEMCH")
      return;
    }
  



    let formattedSchedule = Object.entries(schedule).flatMap(([dayName, sessions]) => {
      const dayObject = weekDays.find(day => day.name === dayName);
      const dayId = dayObject ? dayObject.id : null;
      if (!dayId) {
        console.error(`No ID found for day: ${dayName}`)
        return [];
      }
      return sessions.map(session =>({...session,day_id: dayId,day_of_week: dayName,duration: session.duration_minutes / 60, //convert minutes to hours
        }))
    })
  
    console.log("Initial Schedule Data:", formattedSchedule)
    // Sort by priority (Course >td >tp) then by day
    formattedSchedule.sort((a, b) => {
      const priority = {Course:3, TD: 2,TP: 1}
      if (priority[a.session_type] !== priority[b.session_type]) {
        return priority[b.session_type]- priority[a.session_type] //sort by session type first, how to do so?
      }
      return a.day_id -b.day_id //then sort by day
    })
  
    console.log("sorted sessions:", formattedSchedule)
    let updatedSchedule =[] //this stores modified sessions
    //now that we sorted the sessions, we perform the calculations:
    //first we check the aboveSix condition
    //now we filter only course sessions
const courseSessions = formattedSchedule.filter(session =>session.session_type=== "Course")
//sum up the total course hours
const totalCourseHours = courseSessions.reduce((sum, session) => sum + session.duration_minutes/60, 0)
console.log("Total course hours:", totalCourseHours);
//check if course hours exceed 6
if (totalCourseHours>= 6) {
    console.log("Course sessions exceed 6 hours! we have GOT to mark extras, like...GOT TO!")
    let remainingCourseHours= 6 //we can only keep 6 hours of courses as non-extra
    let totalWorkload =0 //ttracks all counted hours

    for (const session of formattedSchedule){
        let sessionHours = session.duration_minutes /60//thos convert minutes to hours

        if (session.session_type ==="Course"){
            if (remainingCourseHours> 0) {
                if (sessionHours <= remainingCourseHours) {
                    //this course session fits within the 6-hour limit
                    session.isExtra = false;
                    remainingCourseHours -= sessionHours
                    totalWorkload += sessionHours;
                    updatedSchedule.push(session);
                } else {
                  //if we enter this block, it means the session we're in is da BREAKING POINT, it means it's where we start marking sessions as extra, we split it cuz a part of it is a workload and the other is extra
                  //to do: make a whole new sched to work on since there are splits to be done, ie new sessions to be created
                    const nonExtraPart = remainingCourseHours * 60; // Convert to minutes
                    const extraPart = session.duration_minutes - nonExtraPart;
                    updatedSchedule.push({ ...session, duration_minutes: nonExtraPart, isExtra: false });
                    totalWorkload+= remainingCourseHours
                    updatedSchedule.push({ ...session, duration_minutes: extraPart, isExtra: true })
                    remainingCourseHours= 0
                }
            } else {
                //we here mark remaining course sessions as extra
                session.isExtra = true;
                updatedSchedule.push(session);
            }
        } else {
            //if it's tutorial/lab and total course hours were already 6 or more, mark as extra
            session.isExtra = true;
            updatedSchedule.push(session);
        }
    }

    formattedSchedule.length = 0
    formattedSchedule.push(...updatedSchedule);
    console.log(updatedSchedule)

} else {
  console.log("Course sessions are within the 6-hour limit, now we perform the calc on tutorials");
  //covert the courses into tuts to see how much we need lft to complete the total 9hrs
  let convertedCourseHours = totalCourseHours * (3/2);
  console.log("Converted Course Hours: ", convertedCourseHours);
  
  const tutorialSessions = formattedSchedule.filter(session =>session.session_type ==="TD")
  let totalTutorialHours = tutorialSessions.reduce((sum, session) => sum + session.duration_minutes /60,0)
  console.log("Total Tutorial Hours: ", totalTutorialHours)

  // determine deeded tut houra to reach 9hrs totoal
  let neededTutHours = 9 -convertedCourseHours;
  console.log("Needed Tutorial Hours: ", neededTutHours)
  

  //here we mark the courses as non extra and move on to wrestle with the tuts
  for (const session of formattedSchedule){
    let sessionHours = session.duration_minutes / 60 //convert minutes to hours
  
    if (session.session_type === "Course") {
      session.isExtra = false; //keep all of the course sessions as non-extra ie in workload 
      updatedSchedule.push(session)
    } 
    else if (session.session_type==="TD"){
      if (neededTutHours> 0){
        if (sessionHours <=neededTutHours) {
          session.isExtra =false
          neededTutHours-=sessionHours
        } else {
          //if a session exceeds neededTutHours, split it to create teo or more session, first part is in the workloas and the second in the extras
          updatedSchedule.push({ ...session, duration_minutes: neededTutHours * 60,isExtra: false })
          updatedSchedule.push({ ...session, duration_minutes: (sessionHours-neededTutHours) * 60, isExtra: true })
          neededTutHours =0
          continue;
        }
        updatedSchedule.push(session)

      } else {
        session.isExtra = true//mark the rest as extra
        updatedSchedule.push(session)

      }
    }
    else{
      session.isExtra = true//mark the rest as extra
      updatedSchedule.push(session)

    } 

  }

  
  //here, we use the lab work houss if the tuts were not enough to complete 9hrs, to do tommorow, i'm tired
  if (neededTutHours >0) {
    console.log("Not enough tutorial hours, using lab hours to finalise the treatmet......")
    let labSessions= formattedSchedule.filter(session =>session.session_type==="TP")
    let totalLabHours= labSessions.reduce((sum, session)=> sum + session.duration_minutes/ 60, 0)
    let neededLabHours= neededTutHours*(4/3);
  console.log("still needed hours to finalise the calculations",neededLabHours)
    for (const session of labSessions){
      let sessionHours = session.duration_minutes /60
      if (neededLabHours> 0) {
        if (sessionHours <= neededLabHours){
          session.isExtra = false
          neededLabHours -= sessionHours
        } else {
          // If a session exceeds neededLabHours, split it
          updatedSchedule.push({...session, duration_minutes: neededLabHours * 60, isExtra: false})
          updatedSchedule.push({...session, duration_minutes:(sessionHours- neededLabHours) *60, isExtra: true})
          neededLabHours=0
          continue;
        }
      }else{
        session.isExtra = true
      }
      updatedSchedule.push(session)
    }
  }
  console.log("updated Schedule, with all treated edge cases:",updatedSchedule)
  //suiii it worked ig
  setShowSheds(true)
  //to do: verify if it's really being saved
}
     console.log("Final Processed Schedule:", updatedSchedule);
     console.log("counter is ",counter)
     axios.post("http://localhost:3000/api/user/save-schedule", {schedule: updatedSchedule,period: counter})
     .then(response => {
      console.log("successfully saved the schedule!",response.data)})
     .catch(error => {
       console.error("Error saving schedule:", error)})

      }




     
     
     
      
  return (
    <>
        <div className={styles.contentt}>
          <h1>Global Timetable</h1>

<div className={styles.formContainer}>
  <div className={styles.formGroup}>
    <label className={styles.label}>Day:</label>
    <select
      className={styles.input}
      value={newSession.day_of_week}
      onChange={e => setNewSession({ ...newSession, day_of_week: e.target.value })}
    >
      {Object.keys(schedule).map(day => (
        <option key={day} value={day}>{day}</option>
      ))}
    </select>
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Start Time:</label>
    <input
      type="time"
      className={styles.input}
      value={newSession.start_time}
      onChange={e => setNewSession({ ...newSession, start_time: e.target.value })}
    />
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Duration (minutes):</label>
    <input
      type="text"
      className={styles.input}
      value={newSession.duration_minutes}
      onChange={e => setNewSession({ ...newSession, duration_minutes: e.target.value })}
    />
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Type of session:</label>
    <select
      required
      className={styles.input}
      value={newSession.session_type}
      onChange={e => setNewSession({ ...newSession, session_type: e.target.value })}
    >
      <option value="">Select</option>
      {sessions.map(session => (
        <option key={session.session_type_id} value={session.name}>
          {session.name}
        </option>
      ))}
    </select>
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Promotion:</label>
    <select
      required
      className={styles.input}
      value={newSession.promotion}
      onChange={e => {
        handlePromotionChange(e);
        setNewSession({ ...newSession, promotion: e.target.value });
      }}
    >
      <option value="">Select</option>
      {promotions.map(promotion => (
        <option key={promotion.promoid} value={promotion.promoid}>
          {promotion.name}
        </option>
      ))}
    </select>
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Speciality:</label>
    <select
      className={styles.input}
      value={newSession.speciality}
      onChange={handleSpecialityChange}
    >
      <option value="">Select</option>
      {specialities.map(speciality => (
        <option key={speciality.specialityid} value={speciality.specialityid}>
          {speciality.name}
        </option>
      ))}
    </select>
  </div>

  <div className={styles.formGroup}>
    <label className={styles.label}>Teacher:</label>
    <select
      required
      className={styles.input}
      value={newSession.teacher}
      onChange={e => setNewSession({ ...newSession, teacher: e.target.value })}
    >
      <option value="">Select</option>
      {teachers.map(teacher => (
        <option key={teacher.teacherID} value={teacher.teacherID}>
          {teacher.last_name} {teacher.first_name}
        </option>
      ))}
    </select>
  </div>
</div>

  
          <button className={styles.ADDSESSION} onClick={handleAddSession}>Add Session</button>
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
  
          <button className={styles.SAVESESSION}onClick={handleSaveSchedule}>Save Changes</button>
        </div>
        





        {editmodal && selectedSession && (
        <div className={styles.modal_overlay}>
          <div className={styles.modaledit}>
            <div className="modal-header">
              <div className="anh">
              <h2>Edit Session</h2>
              <AiOutlineClose className={styles.close_icon} onClick={() => seteditModal(false)} />
            </div>
            </div>
            <form className={styles.editForm}>
           
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
          <select name="session_type" required value={selectedSession.session_type} onChange={handleInputChange}>
            <option value="">Select</option>
            {sessions.map(session => (
              <option key={session.session_type_id} value={session.name}>
               {session.name}
              </option>))}
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


<div>
  <label>Speciality</label>
  <select name="speciality"  value={selectedSession.speciality} onChange={(e)=>{
    handleSpecialityChange(e)
    handleInputChange(e)
  }}>
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
            <AiOutlineClose className="close-icon" onClick={()=> setdeletemodal(false)} />
           </div>
          <hr />
            <h6>
              Are you sure you want to remove <strong>{selectedSession?.originalDay} session at {selectedSession.start_time} and tought by {selectedSession.teacher}</strong>? This action cannot be undone.
            </h6>
            <div className="btnddiv">
            <button className="cancel" onClick={()=> setdeletemodal(false)}>
              Cancel
            </button>
            <button className="confirm" onClick={handleDelete}>
              Confirm
            </button>
            </div>
          </div>
        </div>
      )}




          
    </>
  )
}

export default FillInWebsite;
