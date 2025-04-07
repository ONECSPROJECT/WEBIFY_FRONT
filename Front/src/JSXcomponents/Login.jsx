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
    if (!email ||!password){
      console.log("Email and password must not be empty")
      return;
  }
try{
 const response= await axios.post("http://localhost:3000/api/user/login",{email,password}) //respond with a token and a role
 console.log("Login Response:", response.data.data.user.role);
 localStorage.setItem("authToken",response.data.token)
 if(response.data.data.user.role==="admin"){
  navigate('./AdminPage')
 }
 else{
  navigate('./TeacherPage')
 }
}
catch(erreur){
    console.log("erreur verifier le email ou mot pass", erreur)
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
      <input className={styles.password} type="password" placeholder="Password"value={password} onChange={(e) => setpassword(e.target.value)}/>
    </div>
<br />
    <button className={styles.sub} type="submit">
      Sign In</button>
    <button className={styles.ForgotPass} onClick={handleForgotPass}>
      Forgot Password?</button>
  </form>
</div>
<p className={styles.dev}>Devoloped by <strong>Webify</strong></p>
</div>
 
)





}
export default Login;