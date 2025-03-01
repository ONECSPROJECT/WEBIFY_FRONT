import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import NavBar from "./NavBar";
import styles from '../CSS/Home.module.css'
function Home() {
  const [name, setName] = useState('');
  const {email}=useAuth();
  useEffect(()=>{
    async function username() {
      try {
        const response = await axios.post("",{email});
        setName(response.data.name);}
      catch (error) {
        console.error("Failed to fetch user name:", error);}}
        if (email) username();},[email]);
  return (
    <div className={styles.Home_container}>
    <NavBar />
    <p>{name}</p>
    </div>
  );
}

export default Home;
