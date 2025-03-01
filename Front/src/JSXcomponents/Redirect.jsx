import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../CSS/Redirect.module.css'
function Redirect(){
    const navigate = useNavigate();
    useEffect(()=>{
        setTimeout(() => {
            navigate('/Home');
        }, 2000);
    },[navigate])
    return(
        <div className={styles.Redirect_container}>
        <div className={styles.container}>
            <h2 className={styles.Header}>Redirecting...</h2>
            <p>Please wait while we take you to the login page</p>
            <div className={styles.loader}>
                </div>
        </div>
        </div>
    )
}

export default Redirect;