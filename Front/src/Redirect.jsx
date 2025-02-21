import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect(){
    const navigate = useNavigate();
    useEffect(()=>{
        setTimeout(() => {
            navigate('/Login')
        }, 3000);
    },[navigate])
    return(
        <>
        <div className="container">
            <h2>Redirecting</h2>
            <p>Please wait while we take you to the login page</p>
            {/*circle animation thingy*/}
        </div>
        </>
    )
}

export default Redirect;