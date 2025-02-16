import React from "react";
import {useState} from "react";
import axios from "axios";
function Login(){
    const[email,setemail]=useState('');
    const[password,setpassword]=useState('');

const handlesubmit = async ()=>{
try{
 const response= await axios.post("",{email,password})
}
catch(erreur){
    console.log("erreur verifier le email ou mot pass")
}

}

   
    
return(




    <form onSubmit={handlesubmit} action="">
        <div className="emailinput">
<label htmlFor="">Enter your email:</label>
<br />
<input type="text" placeholder="email"  value={email} onChange={(e)=>setemail(e.target.value)}/>
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