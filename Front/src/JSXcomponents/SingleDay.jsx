import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../CSS/SingleDay.module.css'
import { IoCloseOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

function SingleDay({teacher, day, date, onClose}) {
  
    const [sessions,setSessions]=useState([]) //sessions are an array of objects ig {Module,startTime,Duration,presentFlag} present by default in the database
    const [absentSessions, setAbsentSessions] =useState({})
    useEffect(()=>{
      async function getExtraSessions(){
        await axios.get(`http://localhost:3000/api/user/fetch-extra-session?teacher=${teacher?.teacherid}`).then(res=>setSessions(res.data))
        if(!sessions){
          console.log("empty")
        }

      }
      getExtraSessions()
    },[])

function toggleAbsent (startTime) {
  setAbsentSessions((prev)=>({...prev,
    [startTime]:!prev[startTime]
  }))
}



 async function handleChanges(){

try{
  const absentTimes = Object.keys(absentSessions).filter(startTime => absentSessions[startTime]);

  console.log("absent sessions:", absentTimes)
  await axios.put(`http://localhost:3000/api/user/mark-absence`,{teacher: teacher?.teacherid, day: day, absentSessions:absentTimes})
  alert("absent sessions sent correctly")
}  
catch(error){
  console.log("failed to send absent sessions")
}


}


    return (
      <div className={styles.SingleDay}>
        <div className={styles.box}>
        <h2> {teacher?.first_name} {teacher?.last_name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -{date} </h2>
        <ul>
        <div onClick={onClose} className={styles.closeIcon}>
        <IoCloseOutline />
        </div>
        {sessions.map((session) => {
  const isAbsent = absentSessions[session.starttime]
  return (
    <li key={session.starttime} onClick={()=>toggleAbsent(session.starttime)}className={isAbsent ?styles.absent :styles.present}> 
      <span className={isAbsent?styles.fadeOut :styles.fadeIn}>
        <FaRegCheckCircle />
      </span>
      <span className={isAbsent? styles.fadeIn: styles.fadeOut}>
        <IoCloseCircle />
      </span>
      <strong>{session.starttime.slice(0,5)}-{
      new Date(
        new Date(`1970-01-01T${session.starttime}`).getTime() +
        session.duration * 60000
      ).toTimeString().slice(0, 5)
    }</strong></li>)



})}

        </ul>
        <br />
        <button onClick={handleChanges} className={styles.saveChanges}>Save Changes  </button>
        </div>
      </div>
    );
  }
  
  export default SingleDay;
  