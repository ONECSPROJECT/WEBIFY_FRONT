import { useState,useEffect } from "react";
import axios from "axios";
function AddTeacher(){
const [fullname,setfullname]=useState("");
const [state,setstate]=useState("");
const [grade,setgrade]=useState("");
const [bankAccount,setbankAccount]=useState("");

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:300/api/user/register", {fullname,state,grade,bankAccount});
    } catch (error) {
      
      alert("Failed to add teacher.");
    }
  };

   return(

<form onSubmit={handleSubmit} >
      <input name="fullname" placeholder="Full Name" value={fullname} onChange={(e) => setfullname(e.target.value)}/><br />
      <input name="state" placeholder="State" value={state} onChange={(e) => setstate(e.target.value)}/><br />
      <input name="grade" placeholder="Grade" value={grade} onChange={(e) => setgrade(e.target.value)}/><br />
      <input name="bankAccount" placeholder="Bank Account" value={bankAccount}onChange={(e) => setbankAccount(e.target.value)} /><br />
      <button type="submit">Add Teacher</button>
    </form>

   ); 


}

export default AddTeacher;