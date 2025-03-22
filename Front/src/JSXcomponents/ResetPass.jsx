import { useRef, useState,useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from '../CSS/ResetPass.module.css'
function ResetPass(){
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
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
            try {
                await axios.post("http://localhost:3000/api/user/reset-password", {token,newPassword});
                setResponse("Password reset successfully!");
                navigate('/Redirect');
            } catch (error) {
                setResponse("Error, please retry.");
            }
        }

    return(
        <div className={styles.ResetPassword_container}>
        <div className={styles.container}>
            <form className={styles.form} action="" onSubmit={handleR}>
                    <h2 className={styles.Header}>Reset your password</h2>
                        <span className={styles.infoText}>Enter a new password to secure your account.</span>
                <input className={styles.inputfield} placeholder="New Password"  type="password" name="" id="" value={password} onChange={(e)=>{setPassword(e.target.value); checkStr(e.target.value)}} />
                <span ref={strRef}>Strength:{strength}</span>
                <input className={styles.inputfield} placeholder="Confirm New Password"  type="password" name="" id="" value={newPassword} onChange={(e)=>{setNewPassword(e.target.value);}} />
                <span ref={matchRef}>{match}</span> 
                <br />
                <button className={styles.sub} type="submit">Reset password</button>   
            </form>
            <button className={styles.BacktoLogin} onClick={() => navigate('/')}>Back to login</button>
            <span>{response}</span>       
 
            </div>
            <p>Devoloped by <strong>Webify</strong></p>


        </div>
    )
}

export default ResetPass;