import axios from "axios";
import { useEffect, useState } from "react";

function SingleDay({teacher, day}) {
    const [sessions,setSessions]=useState([]) //sessions are an array of objects ig {Module,startTime,Duration,presentFlag} present by default in the database
    useEffect(()=> {
        async function fetchSessions() {
            try {
                const response =await axios.post('', {teacher, day});
                setSessions(response.data);
            }catch (e) {
                console.log("Error at showing the teacher's extra sessions", e);
            }}
             fetchSessions(); // Only fetch if a teacher is selected
},[teacher,day]); 

    return (
      <div>
        <h3> Session on {day}</h3>
        <ul>
            {sessions.map(session=>(<li key={session.start_time}>{session.Module} {session.Duration}</li>))}
        </ul>
      </div>
    );
  }
  
  export default SingleDay;
  