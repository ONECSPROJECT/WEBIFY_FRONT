import { NavLink } from "react-router-dom";
import styles from '../CSS/NavBar.module.css'
function NavBar(){
    return(
        <nav className={styles.NavBar_container}>
            <NavLink to='/Home'>DashBoard</NavLink>
            <NavLink to='/AddTeacher'>AddTeacher</NavLink>
            <NavLink to='/TimeTable'>TimeTable</NavLink>
        </nav>
    )
}

export default NavBar;