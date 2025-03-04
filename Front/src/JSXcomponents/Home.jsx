import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import styles from "../CSS/Home.module.css";
function Home() {
    const [teacherList,setTeacherList]=useState([])
    const [adminInfo,setAdminInfo]=useState({})
    useEffect(() =>{
        async function fetchTeacherList(params) {
            try{
                const response= await axios.get('')
                setTeacherList(response.data);
            }
            catch(error){
                console.log("error")
            }
        }

        async function fetchAdminInfo(params) {
            try{
                const response = await axios.get('');
                setAdminInfo(response.data);
            }
            catch(error){
                console.log("error")
            }
        }
        fetchTeacherList();
        fetchAdminInfo();
    }, []);
    return (
        <div className={styles.Home_container}>
            <NavBar />
            <p>{adminInfo.first_name}</p> {/*just to test if it works*/} <br /> <br />
            <ul>{teacherList.map(teacher=> (<li key={teacher.teacherID}>{teacher.first_name} {teacher.last_name}</li>))}</ul>
        </div>
    );
}

export default Home;
