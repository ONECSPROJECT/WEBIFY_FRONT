import { useEffect } from "react";
import { useAdmin } from "./AdminCxt";
import { useTeacher } from "./TeacherListCxt";
import NavBar from "./NavBar";
import styles from "../CSS/Home.module.css";
function Home() {
    const {adminInfo, fetchAdminInfo} = useAdmin();
    const {teacherList, fetchTeacherList}=useTeacher()
    useEffect(() =>{
        fetchAdminInfo();
        fetchTeacherList();
    }, []);
    return (
        <div className={styles.Home_container}>
            <NavBar />
            <p>{adminInfo.first_name}</p> {/*just to test if it works*/} <br /> <br />
            <ul>{Object.keys(teacherList).map(teacher =><li key={teacher.teacherID} >{teacher.first_name} {teacher.last_name}</li>)}</ul>
        </div>
    );
}

export default Home;
