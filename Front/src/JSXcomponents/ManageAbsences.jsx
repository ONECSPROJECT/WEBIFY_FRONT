import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import styles from "../CSS/ManageAbsences.module.css";
import SingleDay from "./SingleDay";
import SickLeave from "./SickLeave";
import Sidebar from "./Sidebar";
function ManageAbsences() {
  const [date, setDate] = useState(new Date());
  const [teachersList, setTeachersList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("singleDay");
  const [selectedTeacher, setSelectedTeacher] = useState(null); 
  function dateToDay(date) {
    const days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    return days_of_week[date.getDay() - 1];
  }

  const handleOptionChange=(option) =>{
    setSelectedOption(option);
    setSelectedTeacher(null);/*Reset selected teacher when switching options*/
  };
  
  useEffect(() => {
    async function fetchTeachers() {
      try {
        const formattedDate = date.toISOString().split("T")[0]; //Format date
        const response = await axios.post("",{date: formattedDate,day: dateToDay(date),});
        setTeachersList(response.data);
      }
      
      catch (error) {
        console.log("error");
      }
    }
    fetchTeachers();
  }, [date]);

  return (
    <>
    <Sidebar/>
        <div className={styles.mainContainer}>
      {/* OPTIONS */}
      <h2>Options</h2>
      <label>
        <input type="radio"name="opt" value="singleDay" onChange={()=>handleOptionChange("singleDay")} checked={selectedOption ==="singleDay"}  />Track a single day
      </label>
      <label>
        <input type="radio" name="opt" value="sickLeave" onChange={()=>{handleOptionChange("sickLeave")}} checked={selectedOption === "sickLeave"}/>Long term
      </label>

      {/* CONDITIONALLY RENDER COMPONENT */}
      {selectedOption==="singleDay" ?(
        <SingleDay teacher={selectedTeacher} day={dateToDay(date)} />):
        (<SickLeave teacher={selectedTeacher} />)}

      {/* CALENDAR */}
      <div className="calendar-container">
        <h2>School Calendar</h2>
        <Calendar onChange={setDate} value={date} />
        <h2>{dateToDay(date)}</h2>
      </div>

      {/* TEACHERS LIST */}
      <h2>Teachers</h2>
      <ul>
        {teachersList.map((teacher) => (
          <li key={teacher.teacherID} onClick={() => setSelectedTeacher(teacher)}>{teacher.first_name} {teacher.last_name}</li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default ManageAbsences;
