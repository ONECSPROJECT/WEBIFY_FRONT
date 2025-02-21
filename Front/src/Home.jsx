import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import NavBar from "./NavBar";
function Home() {
  const [name, setName] = useState('');
  const {email}=useAuth();
  useEffect(() => {
    async function username() {
      try {
        const response = await axios.post("",{email});
        setName(response.data.name);}
        catch (error) {
        console.error("Failed to fetch user name:", error);}}
    if (email) username();},[email]);
  return (
    <>
    <NavBar />
    <p>{name}</p>
    </>
  );
}

export default Home;
