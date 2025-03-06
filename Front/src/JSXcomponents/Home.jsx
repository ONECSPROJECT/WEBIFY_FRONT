import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import styles from "../CSS/Home.module.css";
import CalendarView from "./CalendarView";
function Home() {
    const [adminInfo,setAdminInfo]=useState({})
    /*useEffect(() =>{
        async function fetchAdminInfo() {
            try{
                const response = await axios.get('');
                setAdminInfo(response.data);}
            catch(error){
                console.log("error")
            }
        }
        fetchAdminInfo();
    }, []);*/
    return (
        <div className={styles.Home_container}>
            <NavBar />
            <p>{adminInfo.first_name}</p> {/*just to test if it works*/} <br /> <br />
            <CalendarView />
            
        </div>
    );
}

export default Home;
