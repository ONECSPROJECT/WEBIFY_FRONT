import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "../CSS/ManageAbsences.module.css";
import SingleDay from "./SingleDay";
import SickLeave from "./SickLeave";
import Sidebar from "./Sidebar";
import { GoPerson } from "react-icons/go";
import { IoMdSearch } from "react-icons/io";
import { FaCalendarDays } from "react-icons/fa6";

function ManageAbsences() {
  const[component, setComponent]=useState(null)
  const navigate =useNavigate()
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now()+7 *24*60 *60*1000));//one week later by default
  const [search,setSearch]=useState('');
  const [date, setDate] = useState(new Date('4-18-2025'));
  const [teachersList, setTeachersList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("singleDay");
  const [selectedTeacher, setSelectedTeacher] = useState(null); 
  const [clickedTeacher, setClickedTeacher]=useState(null)
  //this performs when the page loads
  const [allow,setAllow]=useState(true)

   
 
  async function fetchHolidays() {
    try {
      const res = await axios.get(`http://localhost:3000/api/user/fetch-holiday?date=${date.toISOString().split("T")[0]}`);
      const newValue = !res.data
      setAllow(newValue);
      console.log("NEW allow value:", newValue);
    } catch (err) {
      console.error("Error fetching holidays:", err);
    }
  }
  

  const formattedDate=date.toISOString().split("T")[0]
  function dateToDay(date) {
    const days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
    return days_of_week[date.getDay()];
  }

  useEffect(() => {
    console.log("selected option is",selectedOption)
    if (selectedOption === "singleDay") {
      setTeachersList([])
      console.log("SingleDay selected");
         fetchHolidays()
         if(allow){
           fetchSelectiveTeachers()
        }
      
      if (!allow) {
        //if it's a holiday then display the message
        console.log("Holiday detected");
        setComponent(<h2>Today is a holiday, nothing to display!</h2>);
        return;
      }
  
      if (!selectedTeacher) {
        console.log("Please select a teacher first");
        setComponent(null);
        return;
      }
  
      setComponent(
        <SingleDay
          teacher={selectedTeacher}
          day={dateToDay(date)}
          date={formattedDate}
          onClose={() => setComponent(null)}
        />
      );
    } 
    
    else if (selectedOption === "sickLeave") {
      console.log("SickLeave selected");
  fetchAllTeachers()
      // SickLeave should display regardless of `allow`
      if (!selectedTeacher) {
        console.log("Error: No teacher selected for sick leave.");
        setComponent(<h2>Please select a teacher first.</h2>);
        return;
      }
  
      if (!startDate || !endDate) {
        console.log("Error: Invalid date range for sick leave.");
        setComponent(<h2>Invalid date selection.</h2>);
        return;
      }
  
      setComponent(
        <SickLeave
          teacher={selectedTeacher}
          startDate={startDate.toISOString().split("T")[0]}
          endDate={endDate.toISOString().split("T")[0]}
          onClose={() => setComponent(null)}
        />
      );
    }
  }, [selectedTeacher, selectedOption, date, allow, startDate, endDate]);
  

  useEffect(()=>{
    async function ResetPresence() {
      try{
        const day=dateToDay(date)
        const res =await axios.get(`http://localhost:3000/api/user/get-weekend?day=${day}`)
        console.log("response is,,,,,", res.data)
        if(res.data==="Friday"){
            const teachers=await fetchAllTeachersTWO()
            console.log("to send for adding sup hurs",teachers)
            if(teachers.length===0){
              console.log("teachers are null")
              return;
            }
            else{
              console.log("teachers are not  null")

              const day=date.getDate()
              const month =date.getMonth()+1;
              await axios.post(`http://localhost:3000/api/user/add-record?day=${day}&month=${month}`);
              await axios.put(`http://localhost:3000/api/user/add-suphoursBySession`,{
                teachers,
                date: date.toISOString().split("T")[0]
              })
                            await axios.put(`http://localhost:3000/api/user/reset-presence?date=${date.toISOString().split("T")[0]}`);
            }
          }}
       catch (err) {
        console.log(err)
      }
    }
    ResetPresence()
  }, [])
  
  

  const fetchAllTeachers = async () => {
    setTeachersList([])
    try {
      const response = await axios.get("http://localhost:3000/api/user/fetch-teachers");
      setTeachersList(response.data);
      console.log("teachers object:",response.data)
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };
  

 
  const fetchAllTeachersTWO = async () => {
    setTeachersList([])
    try {
      const response =await axios.get("http://localhost:3000/api/user/fetch-teachers")
      console.log("teacher list inTWO,",response.data)
      return response.data
    } catch (error) {
      console.error("Error fetching teachers",error);
    }
  };


  function handleStartDateChange(e) {
    const newStartDate = e.target.value
    if (newStartDate.length ===10) {
      setStartDate(new Date(newStartDate));
      
    }

  }
  
  function handleEndDateChange(e) {
    const newEndDate =e.target.value
    if (newEndDate.length=== 10) {
      setEndDate(new Date(newEndDate));
    }
  }
  

  const handleOptionChange=(option) =>{
    setSelectedOption(option);
    setSelectedTeacher(null);/*Reset selected teacher when switching options*/
  };
  
  
     async function fetchSelectiveTeachers() {
      try {
        setTeachersList([])
        console.log("day:", dateToDay(date))
       const formattedDate = date.toISOString().split("T")[0]; //Format date
         const response = await axios.get(`http://localhost:3000/api/user/get-selective-teachers?date=${formattedDate}&day=${dateToDay(date)}`) //Start with the formatted date to exclude holidays and sick leaves, and then filter the teachers by the day
       console.log("response data of component set",response.data)
         if (response.data==="Friday"){
        setComponent(<h2>Friday, calculating extra hours...</h2>);  
        setTeachersList([])

       }
       else if(response.data==="No teacher has extra sessions today"){
        setComponent(<h2>No teacher has extra sessions today.</h2>);       

       }
       else{
        setTeachersList(response.data)
       }
      }

      
      catch (error) {
        console.log("error");
      }
   }
    
 

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
        <div className={styles.row}>
      <div className={styles.search}>
        <IoMdSearch className={styles.searchIcon}/>
        <input  type="text" onChange={(e)=>setSearch(e.target.value)} placeholder="Search for a teacher..." />
        {console.log(search)}
      </div>
              {selectedOption==="singleDay"?(
                <div className={styles.date}>
                  <label htmlFor=""><FaCalendarDays/>Select a date({dateToDay(date)}) &nbsp;</label>
                <input type="date" value={date.toISOString().split("T")[0]} onChange={handleInputChange} />        
                </div>):(
        <div className={styles.date}>
          <label> <FaCalendarDays/>Select a date range: &nbsp;</label>
          <input type="date" value={startDate.toISOString().split("T")[0]} onChange={handleStartDateChange}/> 
          <br /> <input className={styles.secondDate} type="date" value={endDate.toISOString().split("T")[0]} onChange={handleEndDateChange}/>
        </div>
      )}
</div>
      <div className={styles.components}>
        {component}

        </div>


    
  

      <div className={styles.calendar_container}>
        <h2>School Calendar</h2>
        <Calendar onChange={setDate} value={date} />
        <h2>{dateToDay(date)}</h2>
      </div> 


      <div className={styles.teacherList}>
      <ul className={styles.teachers}>
        {teachersList.filter((teacher)=>{
          return search.toLowerCase()===''? teacher: teacher.last_name.toLowerCase().includes(search)
        }).map((teacher) => (
          <li className={styles.teacher} key={teacher.user_id} onClick={() => setSelectedTeacher(teacher)}>
           <button className={styles.pfp} onClick={(e) =>{e.stopPropagation()
           setClickedTeacher(teacher)
           teacherPFP()
}}>
           <GoPerson />
           </button> <strong>{teacher.first_name} {teacher.last_name}</strong></li>
        ))}
      </ul>
      </div>
      </div>
   
    </>
  );
}

export default ManageAbsences;
