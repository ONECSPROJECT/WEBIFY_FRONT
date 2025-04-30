import React, { useState, useEffect } from 'react';
import styles from '../CSS/GlobalTimeTable.module.css';
import axios from "axios";
import Sidebar from './Sidebar';

function SupTimeTables() {
  const [groupedByTeacher, setGroupedByTeacher] = useState({});
  const [date,getDate]=useState(new Date().toISOString().split("T")[0])
  const [period,setPeriod]=useState(0)
  const [search, setSearch] = useState("");

  useEffect(()=>{
  console.log("period is",period)
  },[period])
  useEffect(()=> {
    const fetchSchedules =async()=>{
      try {
        const response= await axios.get(`http://localhost:3000/api/user/fetch-scheds?date=${date}`);
        const allSchedules= response.data.scheds;
        setPeriod(response.data.periodid)
    


        const grouped = {};
        allSchedules.forEach((sched) => {
          const teacher = sched.teacher || "Not Assigned";
          if (!grouped[teacher]) {
            grouped[teacher] = [];
          }
          grouped[teacher].push(sched);
        });

        setGroupedByTeacher(grouped);
        console.log(grouped);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);
  const dayOrder = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.scheds}>
        <input className={styles.filter} type="text" placeholder="Search teacher..." value={search} onChange={(e)=>setSearch(e.target.value)} />

      {Object.entries(groupedByTeacher)
        .filter(([teacher]) => teacher.toLowerCase().includes(search.toLowerCase()))
        .map(([teacher, scheds], index) => (
          <div key={index}>
            <h3>Extra hours schedule for {teacher} and their presence this week:</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>Duration</th>
                  <th>Session Type</th>
                  <th>Speciality</th>
                  <th>Promotion</th>
                  <th>Presence</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  scheds.reduce((acc, curr) => {
                    acc[curr.day_of_week] = acc[curr.day_of_week] ||[];
                    acc[curr.day_of_week].push(curr);
                    return acc;
                  }, {})
                )
                  .sort(([a],[b]) => dayOrder.indexOf(a)- dayOrder.indexOf(b))
                  .flatMap(([day, sessions]) =>
                    sessions.map((s, idx) => (
                      <tr key={`${day}-${idx}`}>
                        {idx === 0 && (
                          <td rowSpan={sessions.length} style={{ fontWeight: "bold" }}>
                            {day}
                          </td>
                        )}
                        <td>{s.starttime}</td>
                        <td>{s.duration} min</td>
                        <td>{s.session_type}</td>
                        <td>{s.speciality || "null"}</td>
                        <td>{s.promotion || "Unknown"}</td>
                        <td><strong>{s.presence==0? "absent":"present"}</strong></td>
                        <td>{period}</td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}

export default SupTimeTables;
