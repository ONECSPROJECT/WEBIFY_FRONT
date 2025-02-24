import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './ResetPass.module.css'
function ResetPass(){

    const[password, setPassword]= useState('');
    const[response,setResponse]=useState('')
    const[strength,setStrength]=useState('');
    const navigate=useNavigate();
    async function handleR(e) {
        e.preventDefault();
        try{
            const data= axios.post("",{password});
            setResponse("Passwrod resetted!")
            navigate('./Redirect')
        }
        catch(error){
            setResponse("error, retry")
        }

        function check(password){
            // check length?
        }


    }

    return(
        <>
        <div className={styles.container}>
            <form className={styles.form} action="" onSubmit={handleR}>
                    <h2 className={styles.Signin}>Reset your password</h2>
                        <span className={styles.infoText}>Enter a new password to secure your account.</span>
                    <br />  <br />
                <input className={styles.inputfield} placeholder="New Password"  type="password" name="" id="" value={password} onChange={(e)=>{setPassword(e.target.value)
                    setStrength(e.target.value)
                }} />
                <br />
                <span>Strength:{strength}</span> <br /> <br />
                <input className={styles.inputfield} placeholder="Confirm New Password"  type="password" name="" id="" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button type="submit">Reset password</button>
            </form>
            <p>{response}</p>
    <button className={styles.BacktoLogin} onClick={() => navigate('/')}>Back to login</button>
        </div>
        </>
    )
}

export default ResetPass;