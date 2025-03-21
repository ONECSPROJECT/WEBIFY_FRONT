import { useState } from "react";
import styles from "../CSS/Tableteacher.module.css";
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import axios from "axios";

function Tableteacher() {
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [ccp, setccp] = useState("");
  const [password, setpassword] = useState("");
  const [state, setstate] = useState("");
  const [grade, setgrade] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

// // Fetch teachers from backend
// const fetchTeachers = async () => {
//   try {
//     const response = await axios.get("http://your-backend-api.com/teachers");
//     setTeachers(response.data);
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//   }
// };

// useEffect(() => {
//   fetchTeachers();
// }, []);




  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeacher({ ...selectedTeacher, [name]: value });
  };

  // Function to submit edited data
  const handleSave = async () => {
    if (!selectedTeacher) return;
    
    try {
      await axios.put(`http://your-backend-api.com/teachers/${selectedTeacher.id}`, selectedTeacher);
      // fetchTeachers();
      // Update the teachers state
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? selectedTeacher : t));

      setShowEditModal(false); // Close modal
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };
  // Manage teachers as a state
  const [teachers, setTeachers] = useState([
    { id: 1, fullName: "Teacher One", email: "teacher1@example.com", grade: "Professor", ccp: "123456789", state: "Intérieur" },
    { id: 2, fullName: "Teacher Two", email: "teacher2@example.com", grade: "Professor", ccp: "987654321", state: "Exterieur" },
    { id: 3, fullName: "Teacher Three", email: "teacher3@example.com", grade: "Professor", ccp: "123123123", state: "Intérieur" },
  ]);

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTeacher) return;

    try {
      await axios.delete(`http://your-backend-api.com/teachers/${selectedTeacher.id}`);
      setTeachers(teachers.filter((t) => t.id !== selectedTeacher.id)); // Remove from UI
      // fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }

    setShowDeleteModal(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://your-backend-api.com/teachers", { fullname, email, password, ccp, grade, state });
      alert("Teacher added successfully!");
      // fetchTeachers();
    } catch (error) {
      alert("Failed to add teacher.");
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.content}>
      <h1>Manage Teachers</h1>
      <div className={styles.inbo}>
        <div className={styles.searchbar}>
          <input
            type="text"
            placeholder="Search for a teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className={styles.icons} />
        </div>
        <button className={styles.addteacher} onClick={() => setShowModal(true)}>
          + Add Teacher
        </button>
      </div>

      {showModal && (
        <div className={styles.modaloverlay}>
          <div className={styles.modal}>
            <div className={styles.anh}>
              <h2>Add Teacher</h2>
              <AiOutlineClose className={styles.closeicon} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <label >Full name</label>
              <input  className={styles.inputad}type="text" value={fullname} onChange={(e) => setfullname(e.target.value)} />
              <label>Email</label>
              <input  className={styles.inputad} type="email" value={email} onChange={(e) => setemail(e.target.value)} />
              <label>Password</label>
              <input className={styles.inputad} type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
              <label>CCP</label>
              <input type="text"  className={styles.inputad} value={ccp} onChange={(e) => setccp(e.target.value)} />
              <label>Grade</label>
              <input  className={styles.inputad} type="text" value={grade} onChange={(e) => setgrade(e.target.value)} />
              <label>State</label>
              <select className={styles.inputad}  value={state} onChange={(e) => setstate(e.target.value)}>
                <option value="Intérieur">Intérieur</option>
                <option value="Exterieur">Exterieur</option>
              </select>
              <div className={styles.btnddiv}>
                <div className={styles.modalbuttons}>
                  <button type="submit" className={styles.submitbtn}>
                    Add
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className={styles.closebtn}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modaldelete}>
          <div className={styles.modaldeletecontent}>
          <div className={styles.anh}>
            <h3>Remove {selectedTeacher?.fullName}?</h3>
            <AiOutlineClose className={styles.closeicon} onClick={() => setShowDeleteModal(false)} />
           </div>
          <hr />
            <h6>
              Are you sure you want to remove <strong>{selectedTeacher?.fullName}</strong>? This action cannot be undone.
            </h6>
            <div className={styles.btnddiv}>
            <button className={styles.cancel} onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className={styles.confirm} onClick={confirmDelete}>
              Confirm
            </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && selectedTeacher && (
        <div className={styles.modaloverlay}>
          <div className={styles.modaledit}>
            <div className={styles.modalheader}>
              <div className={styles.anh}>
              <h2>Edit Teacher</h2>
              <AiOutlineClose className={styles.closeicon} onClick={() => setShowEditModal(false)} />
            </div>
            </div>
            <form>
           
              <input type="text" name="fullName" value={selectedTeacher.fullName} onChange={handleInputChange} />

             
              <input type="email" name="email" value={selectedTeacher.email} onChange={handleInputChange} />

            
              <input type="text" name="ccp" value={selectedTeacher.ccp} onChange={handleInputChange} />

              
              <input type="text" name="grade" value={selectedTeacher.grade} onChange={handleInputChange} />

              <select name="state" value={selectedTeacher.state} onChange={handleInputChange}>
                <option value="Intérieur">Intérieur</option>
                <option value="Exterieur">Exterieur</option>
              </select>

              <div className={styles.btnddiv}>
                <button type="button" className={styles.closebtn} onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button"className={styles.submitedbtn} onClick={handleSave}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th>CCP</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.fullName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.grade}</td>
              <td>{teacher.ccp}</td>
              <td>{teacher.state}</td>
              <td>
                <button className={styles.edit} onClick={() => handleEditClick(teacher)}>
                  <FaEdit />
                </button>
                <button className={styles.delete} onClick={() => handleDeleteClick(teacher)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tableteacher;
