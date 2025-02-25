import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Redirect.module.css'
function Redirect(){
    const navigate = useNavigate();

    return(
        <>
        <div className={styles.container}>
            <h2 className={styles.Signin}>Redirecting...</h2>
            <p>Please wait while we take you to the login page</p>
            <div className={styles.loader}>
                </div>
        </div>
        </>
    )
}

export default Redirect;


/*    useEffect(()=>{
        setTimeout(() => {
            navigate('/')
        }, 3000);
    },[navigate])*/ 