import { useState,useEffect } from "react";
import "../CSS/Tableteacher.css";
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BiHide } from "react-icons/bi";

import axios from "axios";

function Tableteacher() {
  const [date,setDate]=useState(new Date().toISOString().split("T")[0])
  const [teachers, setTeachers] = useState([]);
  const [first_name, setfirstname] = useState("");
  const [last_name, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [payment_information, setccp] = useState("");
  const [password, setpassword] = useState("");
  const [state, setstate] = useState("Intérieur");
  const [grades, setgrades] = useState([]);
  const [grade,setgrade]=useState()
  const [faculty, setfaculty]=useState("esi-sba")
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/fetch-table-teachers");
      const transformedData = response.data.map(teacher => ({
        ...teacher,
        fullname: `${teacher.full_name}`
      }));
      setTeachers(transformedData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  async function fetchRanks(){
    try{
      const res =await axios.get("http://localhost:3000/api/user/fetch-ranks");
      setgrades(res.data)
      console.log("grades:", res.data);
    } catch(error){
      console.log(error)
    }
  }
  
  

 useEffect(() => {
  setTeachers([])
   fetchTeachers();
   fetchRanks()
 }, []);

 useEffect(()=>{
  console.log("teacher list", teachers)
},[teachers])

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeacher({ ...selectedTeacher, [name]: value });
  };

  // Function to submit edited data
  const handleSave = async () => {
    if (!selectedTeacher) return;
    
    try {
      await axios.put(`http://localhost:3000/api/user/mark-enddate?enddate=${date}`)
      console.log("enddate marked!")
      await axios.post(`http://localhost:3000/api/user/update-rank`,{teacher:selectedTeacher.user_id,grade:grade,date:date});
      // Update the teachers state
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? selectedTeacher : t));
      fetchTeachers();

      setShowEditModal(false); // Close modal
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleHideClick = (teacher) => {
    setSelectedTeacher(teacher);
    console.log(teacher)
    setShowDeleteModal(true);
  };
  const confirmHide = async (e) => {
    if (!selectedTeacher) return;
    e.preventDefault();
  
    try {
      await axios.put(`http://localhost:3000/api/user/mask-teacher?user_id=${selectedTeacher.user_id}`);
      
      setTeachers(prev => prev.filter(t => t.user_id !== selectedTeacher.user_id));
      alert("Teacher masked!")
  
    } catch (error) {
      console.error("eror masking teacher:", error);
      alert("something went wrong")
    } finally {
       setShowDeleteModal(false)
       console.log(typeof showDeleteModal)
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/user/register", {first_name, last_name, state, payment_information, grade, faculty, email, password, role:"teacher" ,date,masked:0});
      alert("Teacher added successfully!"); 
       fetchTeachers();
    } catch (error) {
      alert("Failed to add teacher.");
    }
  };

  const filteredTeachers =teachers.filter((teacher) =>
    teacher.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="content">
      <h1>Manage Teachers</h1>
      <div className="inbo">
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search for a teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="icons" />
        </div>
        <button className="add-teacher" onClick={() => setShowModal(true)}>
          + Add Teacher
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="anh">
              <h2>Add Teacher</h2>
              <AiOutlineClose className="close-icon" onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <label>First name</label>
              <input type="text" value={first_name} onChange={(e) => setfirstname(e.target.value)} />
              <label>Last name</label>
              <input type="text" value={last_name} onChange={(e) => setlastname(e.target.value)} />
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setemail(e.target.value)} />
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
              <label>CCP</label>
              <input type="text" value={payment_information} onChange={(e) => setccp(e.target.value)} />
              <label>Grade</label>
              <select value={grade} onChange={(e)=>setgrade(e.target.value)} name="" id="">
                {grades.map((grade)=>(
                  <option key={grade.rankid} value={grade.rankid}>{grade.name}</option>
                ))}
              </select>
              <label>State</label>
              <select value={state} onChange={(e) => {const selectedValue = e.target.value;
                setstate(selectedValue);
                if(selectedValue === "Intérieur") {
                  setfaculty("esi-sba");} else{
                    setfaculty("uni-sba");}
                    }}>
                      <option value="Intérieur">Intérieur</option>
                      <option value="Exterieur">Exterieur</option>
                      </select>

              <div className="btnddiv">
                <div className="modal-buttons">
                  <button type="submit" className="submit-btn">
                    Add
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="close-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modaldelete">
          <div className="modaldelete-content">
          <div className="anh">
            <h3>Mask {selectedTeacher?.full_name}?</h3>
            <AiOutlineClose className="close-icon" onClick={() => setShowDeleteModal(false)} />
           </div>
          <hr />
            <h6>
              Are you sure you want to mask <strong>{selectedTeacher?.full_name}</strong>? This action cannot be undone.
            </h6>
            <div className="btnddiv">
            <button className="cancel" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="confirm" onClick={confirmHide}>
              Confirm
            </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && selectedTeacher && (
        <div className="modal-overlay">
          <div className="modaledit">
            <div className="modal-header">
              <div className="anh">
              <h2>Edit Teacher</h2>
              <AiOutlineClose className="close-icon" onClick={() => setShowEditModal(false)} />
            </div>
            </div>
            <form>
           
              <input type="text" name="fullName" value={selectedTeacher.fullName} onChange={handleInputChange} />

             
              <input type="email" name="email" value={selectedTeacher.email} onChange={handleInputChange} />

            
              <input type="text" name="ccp" value={selectedTeacher.ccp} onChange={handleInputChange} />

              
              <select value={grade} onChange={(e)=>setgrade(e.target.value)} name="" id="">
                {grades.map((grade)=>(
                  <option key={grade.rankid} value={grade.rankid}>{grade.name}</option>
                ))}
              </select>

              <select name="state" value={selectedTeacher.state} onChange={handleInputChange}>
                <option value="Intérieur">Intérieur</option>
                <option value="Exterieur">Exterieur</option>
              </select>

              <div className="btnddiv">
                <button type="button" className="close-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button"className="submited-btn" onClick={handleSave}>Save</button>
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
            <th>Faculty</th>
            <th>CCP</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.fullname}</td>
              <td>{teacher.email}</td>
              <td>{teacher.current_rank}</td>
              <td>{teacher.faculty}</td>
              <td>{teacher.payment_information}</td>
              <td>{teacher.state}</td>
              <td>
                <button className="edit" onClick={() => handleEditClick(teacher)}>
                  <FaEdit />
                </button>
                <button className="delete" onClick={() => handleHideClick(teacher)}>
                <BiHide />
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
