import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPass(){
    const [email, setEmail]=useState('');
    const [response, setResponse]= useState('');
    const backtolog=useNavigate();
    async function handleF(e) {
        e.preventDefault();

        try{
            const data = await axios.post("",{email});
            setResponse("Check your email for the reset link");
        }
        catch(error){
            setResponse("Error, retry.")
        }
        
    }


    return(
        <>
        <div className="container">
        <form onSubmit={handleF}>
            <label htmlFor="">Type your email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <button type="submit" name="" id="">Send</button>
        </form>
        <button onClick={()=>{backtolog('./Login')}}>Back to login</button>
        <p>{response}</p>
        </div>
        </>
    )
}


export default ForgotPass;