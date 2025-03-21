import React, { useState, useEffect } from "react";
import styles from "../CSS/Settings.module.css";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

function Settingscomp() {
  const [name, setName] = useState("Admin Name");
  const [email, setEmail] = useState("admin@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchVacationsAndExams();
  }, []);

  const fetchVacationsAndExams = async () => {
    try {
      const response = await axios.get("http://your-backend-api.com/get-periods");
      setVacations(response.data.vacations || []);
      setExams(response.data.exams || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      await axios.put("http://localhost:5000/api/admin/profile", {
        name,
        email,
        currentPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Profile updated successfully");
    } catch (error) {
      alert("Error updating profile");
    }
  };

  const [vacations, setVacations] = useState([]);
  const [exams, setExams] = useState([]);


  const [showVacationModal, setShowVacationModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const confirmDeleteVacation = (id) => {
    setDeleteId(id);
    setShowVacationModal(true);
  };

  const confirmDeleteExam = (id) => {
    setDeleteId(id);
    setShowExamModal(true);
  };



  const deleteVacation = async () => {
    try {
      await axios.delete(`http://your-backend-api.com/delete-vacation/${deleteId}`);
      setVacations(vacations.filter(vacation => vacation.id !== deleteId));
      setShowVacationModal(false);
    } catch (error) {
      console.error("Error deleting vacation:", error);
    }
  };

  const deleteExam = async () => {
    try {
      await axios.delete(`http://your-backend-api.com/delete-exam/${deleteId}`);
      setExams(exams.filter(exam => exam.id !== deleteId));
      setShowExamModal(false);
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  const addVacation = () => {
    setVacations([...vacations, { id: Date.now(), start: "", end: "" }]);
  };

  

  const addExam = () => {
    setExams([...exams, { id: Date.now(), start: "", end: "" }]);
  };

  

  const handleSaveVE = async () => {
    const data = { vacations, exams };
    try {
      await axios.post("http://your-backend-api.com/save", data, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  return (
    <div className={styles.settingscontainer}>
      <h2>Settings</h2>
      <div className={styles.settingscard}>
        <h3>Admin Profile</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Current Password:</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit" className={styles.savebtn}>Save Changes</button>
        </form>
      </div>
      <main className={styles.content}>
        <section className={styles.card}>
          <h3>University Vacations</h3>
          <hr />
          <div className={styles.divperiod}>
            {vacations.map((vac, index) => (
              <div key={vac.id} className={styles.period}>
                <div className={styles.diviconp}>
                  <h2>Vacation {index + 1}:</h2>
                 
                  <button onClick={() => confirmDeleteVacation(vac.id)}  className={styles.deleteBtn}>
                  
                    <FaTrash />
                  </button>
                </div>
                <label>Start:</label>
                <input type="date" value={vac.start} onChange={(e) => handleInputChange("vacation", index, "start", e.target.value)} />
                <label>End:</label>
               
                <input type="date" value={vac.end} onChange={(e) => handleInputChange("vacation", index, "end", e.target.value)} />

</div>
            ))}
            <div className={styles.dbtnadd}>
            <button onClick={addVacation} className={styles.addBtn}>+ Add Vacation</button>
            </div>
            
            {vacations.length > 0 && <button onClick={handleSaveVE} className={styles.savebtnve}>Save Changes</button>}
         
          </div>
        </section>
        <section className={styles.card}>
          <h3>Exam Periods</h3>
          <hr />
          <div className={styles.divperiod}>
            {exams.map((exam, index) => (
              <div key={exam.id} className={styles.period}>
                <div className={styles.diviconp}>
                  <h2>Exam {index + 1}:</h2>
                  <button onClick={() => confirmDeleteExam(exam.id)}  className={styles.deleteBtn}>
                 
                    <FaTrash />
                  </button>
                </div>
                <label>Start:</label>
                <input type="date" value={exam.start} onChange={(e) => handleInputChange("exam", index, "start", e.target.value)} />
                <label>End:</label>
                <input type="date" value={exam.end} onChange={(e) => handleInputChange("exam", index, "end", e.target.value)} />
              </div>
            ))}
            <div className={styles.dbtnadd}>
            <button onClick={addExam} className={styles.addBtn}>+ Add Exam Period</button>
            
            </div>
            {exams.length > 0 && <button onClick={handleSaveVE} className={styles.savebtnve}>Save Changes</button>}
          </div>
        </section>
        
      </main>
      {/* new modal confirm delete  */}


      {showVacationModal && (
        <div className={styles.modalconf}>
          <div className={styles.modalContentconf}>
            <h3>Confirm Deletion</h3>
            <h1>Are you sure you want to delete this vacation?</h1>
            <div className={styles.btnddiv}>
            <button onClick={() => setShowVacationModal(false)} className={styles.confirmBtnconf}>Cancel</button>
            <button onClick={deleteVacation} className={styles.cancelBtnconf}>Confirm</button>
          </div>
          </div>
        </div>
      )}
      {showExamModal && (
        <div className={styles.modalconf}>
          <div className={styles.modalContentconf}>
            <h3>Confirm Deletion</h3>
            <h1>Are you sure you want to delete this exam?</h1>
            <div className={styles.btnddiv}>
            <button onClick={() => setShowExamModal(false)} className={styles.confirmBtnconf}>Cancel</button>
            <button onClick={deleteExam} className={styles.cancelBtnconf}>Confirm</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settingscomp;
