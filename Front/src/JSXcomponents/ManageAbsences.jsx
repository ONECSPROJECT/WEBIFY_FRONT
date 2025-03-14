import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "../CSS/ManageAbsences.module.css";
import SingleDay from "./SingleDay";
import SickLeave from "./SickLeave";
import Sidebar from "./Sidebar";
import {teachers} from './TeacherTest.jsx'
import { GoPerson } from "react-icons/go";
import { IoMdSearch } from "react-icons/io";
import { FaCalendarDays } from "react-icons/fa6";

function ManageAbsences() {
  const[component, setComponent]=useState(null)
  const navigate =useNavigate()
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now()+7 *24*60 *60*1000));//one week later by default
  const [search,setSearch]=useState('');
  const [date, setDate] = useState(new Date());
  const [teachersList, setTeachersList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("singleDay");
  const [selectedTeacher, setSelectedTeacher] = useState(null); 
  const [clickedTeacher, setClickedTeacher]=useState(null)

  const formattedDate=date.toISOString().split("T")[0]
  function dateToDay(date) {
    const days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
    return days_of_week[date.getDay()];
  }

  useEffect(() => {
    if (!selectedTeacher) {
      console.log("Please select a teacher first");
      setComponent(null);
      return;
    }
    if(selectedOption==="singleDay"){setComponent(<SingleDay teacher={selectedTeacher} day={dateToDay(date)} date={formattedDate} onClose={()=>setComponent(null)} />);
    } 
    
    else{
      setComponent(<SickLeave teacher={selectedTeacher} />);
    }
  },[selectedTeacher, selectedOption,date]);



  function handleStartDateChange(e) {
    const newStartDate = e.target.value;
    if (newStartDate.length === 10) {
      setStartDate(new Date(newStartDate));
      
    }

  }
  
  function handleEndDateChange(e) {
    const newEndDate = e.target.value;
    if (newEndDate.length === 10) {
      setEndDate(new Date(newEndDate));
    }
  }
  

  const handleOptionChange=(option) =>{
    setSelectedOption(option);
    setSelectedTeacher(null);/*Reset selected teacher when switching options*/
  };
  
  useEffect(() => {
    async function fetchTeachers() {
      try {
        const formattedDate = date.toISOString().split("T")[0]; //Format date
        const response = await axios.post("",{selectedOption: selectedOption, date: formattedDate,day: dateToDay(date),}); //Start with the option, if it's a long term absence, then show all teachers, else use the formatted date to exclude holidays and sock leaves, and then filter the teachers by the day
        setTeachersList(response.data);
      }
      
      catch (error) {
        console.log("error");
      }
    }
    fetchTeachers();
  }, [selectedOption,date]);

  function handleInputChange(e) {
    const newDate = e.target.value;
        if (newDate.length=== 10){
      setDate(new Date(newDate));
    }
  }

  async function teacherPFP(){
    try{
      const response=await axios('',{data:clickedTeacher})
      navigate(`./teacherPFP:${response.data.token}`)
    }    
    catch(error){
      console.log("failed to load teacher profile page")
    }
  }

  return (
    <>
    <Sidebar/>
        <div className={styles.mainContainer}>

          {/*TITLE*/}
          <h1>Manage Absences</h1>


      {/*OPTIONS */}


      <div className={styles.options}>
      <label>
        <input type="radio"name="opt" value="singleDay" onChange={()=>handleOptionChange("singleDay")} checked={selectedOption ==="singleDay"}  />Track a single day
      </label>
      <label>
        <input type="radio" name="opt" value="sickLeave" onChange={()=>{handleOptionChange("sickLeave")}} checked={selectedOption === "sickLeave"}/>Mark a long-term absence
      </label>
      </div>

      {/*SEARCH FOR A TEACHER*/}
      <div className={styles.row}>
      <div className={styles.search}>
        <IoMdSearch className={styles.searchIcon}/>
        <input  type="text" onChange={(e)=>setSearch(e.target.value)} placeholder="Search for a teacher..." />
        {console.log(search)}
      </div>
              {/* CONDITIONALLY RENDER DATE FIELD(S)*/}
              {selectedOption==="singleDay"?(
                <div className={styles.date}>
                  <label htmlFor=""><FaCalendarDays/>Select a date &nbsp;</label>
                <input type="date" value={date.toISOString().split("T")[0]} onChange={handleInputChange} />        
                </div>):(
        <div className={styles.date}>
          <label> <FaCalendarDays/>Select a date range: &nbsp;</label>
          <input type="date" value={startDate.toISOString().split("T")[0]} onChange={handleStartDateChange}/> 
          <br /> <input className={styles.secondDate} type="date" value={endDate.toISOString().split("T")[0]} onChange={handleEndDateChange}/>
        </div>
      )}
</div>
      {/*CONDITIONALLY RENDER COMPONENT */}
      <div className={styles.components}>
        {component}

        </div>


    
  

      {/* CALENDAR (for the test, it won't show to the admin)*/}
      <div className={styles.calendar_container}>
        <h2>School Calendar</h2>
        <Calendar onChange={setDate} value={date} />
        <h2>{dateToDay(date)}</h2>
      </div> 


      {/*TEACHERS LIST (it'll filter out the teacher as the search bar changes) */} 
      <div className={styles.teacherList}>
      <ul className={styles.teachers}>
        {teachers.filter((teacher)=>{
          return search.toLowerCase()===''? teacher: teacher.last_name.toLowerCase().includes(search)
        }).map((teacher) => (
          <li className={styles.teacher} key={teacher.teacherID} onClick={() => setSelectedTeacher(teacher)}>
           <button className={styles.pfp} onClick={(e) =>{e.stopPropagation()
           setClickedTeacher(teacher)
           teacherPFP()
}}>
           <GoPerson />
           </button> <strong>{teacher.last_name} {teacher.first_name}</strong></li>
        ))}
      </ul>
      </div>
    </div>
    </>
  );
}

export default ManageAbsences;
