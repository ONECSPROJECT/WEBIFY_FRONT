import { useRef, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './ResetPass.module.css'
function ResetPass(){
    const[password, setPassword]= useState('');
    const[newPassword, setNewPassword]=useState('')
    const [match, setMatch]=useState('')
    const[response,setResponse]=useState('')
    const[strength,setStrength]=useState('');
    const navigate=useNavigate();
    const matchRef=useRef(null)
    const strRef=useRef(null);


    function checkStr(pass){
        if(pass.length<=8){
            setStrength("Weak")
            strRef.current.style.color="red"
        }
        else if(pass.length<=12){
            setStrength("Moderate")
            strRef.current.style.color="yellow"

        }
        else{
            setStrength("Strong")
            strRef.current.style.color="green"

        }
    }

    useEffect(() => {
        if (newPassword==='') return;
        if (newPassword !== password){
            setMatch("Passwords do not match!")
            matchRef.current.style.color="red"
        }else{
            setMatch("Passwords match!")
            matchRef.current.style.color="green"
        }},[password, newPassword]);



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

    

    }

    return(
        <>
        <div className={styles.container}>
            <form className={styles.form} action="" onSubmit={handleR}>
                    <h2 className={styles.Signin}>Reset your password</h2>
                        <span className={styles.infoText}>Enter a new password to secure your account.</span>
                <input className={styles.inputfield} placeholder="New Password"  type="password" name="" id="" value={password} onChange={(e)=>{setPassword(e.target.value); checkStr(e.target.value)}} />
                <span ref={strRef}>Strength:{strength}</span>
                <input className={styles.inputfield} placeholder="Confirm New Password"  type="password" name="" id="" value={newPassword} onChange={(e)=>{setNewPassword(e.target.value);}} />
                <span ref={matchRef}>{match}</span> 
                <button type="submit">Reset password</button>   
            </form>
            <button className={styles.BacktoLogin} onClick={() => navigate('/')}>Back to login</button>
            <p>{response}</p>        </div>
        </>
    )
}

export default ResetPass;