import styles from "../CSS/SickLeave.module.css";
import { TiWarning } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";
import axios from "axios";

function SickLeave({teacher,onClose,startDate,endDate}) {

    async function handleConfirm() {
      try{
        const response=axios.post('http://localhost:3000/api/user/save-vacation',{teacher:teacher.user_id,startDate:startDate,endDate:endDate})
        console.log("absence recorded")
      }
      catch(error){
        console.log("an error has occured")
      }
    }
  
  return (
    
    <div className={styles.SickLeave}>
      <div className={styles.box}>
        <h2 className={styles.warning}> <TiWarning className={styles.warningIcon} />&nbsp; Confirm long-term absence</h2>
                <div onClick={onClose} className={styles.closeIcon}>
                <IoMdClose/>
                </div>
        <div className={styles.horizontalLine} />
        <br />  
        <div className={styles.content}>Are you sure you want to mark <strong>{teacher.last_name} {teacher.first_name}</strong> as <span className={styles.abs}>absent</span> from <strong> {startDate}</strong> to <strong>{endDate} </strong>?</div>
        <br />
        <div className={styles.buttons}>
          <button className={styles.cance} onClick={onClose}><strong>Cancel</strong></button>
          <button className={styles.confirm} onClick={handleConfirm}><strong>Confirm</strong></button>
        </div>
      </div>
    </div>
  );
}

export default SickLeave;
