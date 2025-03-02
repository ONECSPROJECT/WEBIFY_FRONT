import React from "react";
import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../CSS/Auth.module.css'
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

function handleForgotPass(){
    navigate('/ForgotPass')
}

   
    
return(

<div className={styles.Login_container}>
<div className={styles.container}>
  <form className={styles.Form} onSubmit={handlesubmit}>
    <span className={styles.Header}>Sign In</span>
<br /> <br />
    <div className={styles.emailinput}>
      <input className={styles.email} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
    </div>
<br />
    <div className={styles.passwordinput}>
      <input className={styles.password} type="text" placeholder="Password"value={password} onChange={(e) => setpassword(e.target.value)}/>
    </div>
<br />
    <button className={styles.sub} type="submit">
      Sign In</button>
    <button className={styles.ForgotPass} onClick={handleForgotPass}>
      Forgot Password?</button>
  </form>
</div>
</div>
 
)





}
export default Login;