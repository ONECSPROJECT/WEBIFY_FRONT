import axios from "axios";
import { createContext, useContext, useState } from "react";


 const TeacherContext= createContext();

 export function TeacherProvider({children}){
    const [teacherList, setTeacherList]=useState([])
    async function fetchTeacherList(e) {
        e.preventDefault();
        try{
            const response =await axios.get('');
            setTeacherList(response.data)
        }
        catch (error){
            console.log("error at fetching teachers list");
        }

    }
    return (
        <TeacherContext.Provider value={{teacherList,setTeacherList,fetchTeacherList}}>
            {children}
        </TeacherContext.Provider>
  )
 }


 export function useTeacher(){
     return useContext(TeacherContext)
 }