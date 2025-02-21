import React from "react";
import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login(){
    const navigate=useNavigate();
    const[email,setEmail]=useState('');
    const[password,setpassword]=useState('');

const handlesubmit = async (e)=>{
    e.preventDefault();
try{
 const response= await axios.post("",{email,password})
 navigate('/Home')
}
catch(erreur){
    console.log("erreur verifier le email ou mot pass")
}

}

   
    
return(




    <form onSubmit={handlesubmit} action="">
        <div className="usernameinput">
<label htmlFor="">Enter your email:</label>
<br />
<input type="text" placeholder="email"  value={email} onChange={(e)=>setEmail(e.target.value)}/>
</div>


<div className="passwordinput">
<label htmlFor="">password:</label>
<br />
<input type="text" placeholder="password"  value={password} onChange={(e)=>setpassword(e.target.value)} />
</div>
<button type="submit"> Log In</button>
    </form>
    
    
 
)





}
export default Login;