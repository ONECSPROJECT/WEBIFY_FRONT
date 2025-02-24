import { useRef, useState } from "react";
import axios from "axios";
import styles from './ForgotPass.module.css';


import { useNavigate } from "react-router-dom";
function ForgotPass(){
    const ResetRef=useRef(null);
    const CheckRef=useRef(null);
    const [email, setEmail]=useState('');
    const [response, setResponse]= useState('');
    const backtolog=useNavigate();
    async function handleF(e) {
        e.preventDefault();
        try{
            const data = await axios.post("",{email});
            setResponse("Check your email for the reset link");
            ResetRef.current.style.display="none";
            CheckRef.current.style.display="flex"

        }
        catch(error){
            setResponse("Error, retry.")
        }
        
    }


    return(
        <>
  <div ref={ResetRef} className={styles.containerReset}>
    <br />
    <h2 className={styles.Signin}>Forgot your password?</h2>
    <span className={styles.infoText}>Enter your email below and we’ll send you a reset link.</span>
    <form className={styles.form} onSubmit={handleF}>
      <input className={styles.inputfield} placeholder="Enter your email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <button type="submit">Send Reset Link</button>
    </form>
    <button className={styles.BacktoLogin} onClick={() => backtolog('/')}>Back to login</button>
    <p>{response}</p>
  </div>

  <div ref={CheckRef} className={styles.containerCheck}>
    <h1 className={styles.Signin}>Password Reset Sent!</h1>
    <br />
    <span className={styles.infoText}>Check your email for a password reset link.</span>
  </div>
</>


    )
}


export default ForgotPass;