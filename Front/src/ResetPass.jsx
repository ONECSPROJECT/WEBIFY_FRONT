import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        <div className="container">
            <form action="" onSubmit={handleR}>
                <label htmlFor="">Reset your password</label>
                <input type="password" name="" id="" value={password} onChange={(e)=>{setPassword(e.target.value)
                    setStrength(e.target.value)
                }} />
                <p>Strength:{strength}</p>
                <button type="submit">Reset password</button>
            </form>
            <p>{response}</p>
            <button onClick={navigate('./Login')}>Back to Login</button>
        </div>
        </>
    )
}

export default ResetPass;