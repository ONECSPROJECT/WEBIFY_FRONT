import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../CSS/SingleDay.module.css'
import { IoCloseOutline } from "react-icons/io5";
import sessions from './SessionsTest'
import { FaRegCheckCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

function SingleDay({teacher, day, date, onClose}) {
    const [session,setSessions]=useState([]) //sessions are an array of objects ig {Module,startTime,Duration,presentFlag} present by default in the database
    const [absentSession, setAbsentSession] =useState({})
//     useEffect(()=> {
//         async function fetchSessions() {
//             try {
//                 const response =await axios.post('', {teacher, day});
//                 setSessions(response.data);
//             }catch (e) {
//                 console.log("Error at showing the teacher's extra sessions", e);
//             }}
//              if(teacher!==null){
//               fetchSessions();
//              } // Only fetch if a teacher is selected
// },[teacher,day]); 


function toggleAbsent (startTime) {
  setAbsentSession((prev)=>({...prev,
    [startTime]:!prev[startTime]
  }));
};



 async function handleChanges(){

try{
  await axios.post('',{teacher: teacher, day: day, absentSessions:absentSession})
  console.log("absent sessions sent correctly")
}  
catch(error){
  console.log("failed to send absent sessions")
}


}


    return (
      <div className={styles.SingleDay}>
        <div className={styles.box}>
        <h2>{teacher?.first_name} {teacher?.last_name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -{date} </h2>
        <ul>
        <div onClick={onClose} className={styles.closeIcon}>
        <IoCloseOutline />
        </div>
        {sessions.map((session) => {
  const isAbsent = absentSession[session.start_time]
  return (
    <li key={session.start_time} onClick={()=>toggleAbsent(session.start_time)}className={isAbsent ?styles.absent :styles.present}> 
      <span className={isAbsent?styles.fadeOut :styles.fadeIn}>
        <FaRegCheckCircle />
      </span>
      <span className={isAbsent? styles.fadeIn: styles.fadeOut}>
        <IoCloseCircle />
      </span>
      <strong>{session.start_time}-{session.end_time}</strong></li>)



})}

        </ul>
        <br />
        <button onClick={handleChanges} className={styles.saveChanges}>Save Changes</button>
        </div>
      </div>
    );
  }
  
  export default SingleDay;
  