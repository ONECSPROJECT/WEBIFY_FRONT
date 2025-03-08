import styles from "../CSS/ManageAbsences.module.css";

function SickLeave({teacher}) {
  return (
    <div>
      <h3>Mark as Absent</h3>
      <label>
        From: <input type="date" />
      </label>
      <br />
      <label>
        To: <input type="date" />
      </label>
    </div>
  );
}

export default SickLeave;
