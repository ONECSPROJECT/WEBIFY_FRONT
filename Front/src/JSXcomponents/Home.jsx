import { useEffect } from "react";
import { useAdmin } from "./Admin";
import NavBar from "./NavBar";
import styles from "../CSS/Home.module.css";
function Home() {
    const {adminInfo, fetchAdminInfo} = useAdmin();
    useEffect(() =>{
        fetchAdminInfo();
    }, []);
    return (
        <div className={styles.Home_container}>
            <NavBar />
            <p>{adminInfo.first_name}</p> {/*just to test if it works*/}
        </div>
    );
}

export default Home;
