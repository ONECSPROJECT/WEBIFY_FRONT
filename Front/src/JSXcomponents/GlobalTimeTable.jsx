import React, {useEffect, useState,useRef} from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import styles from '../CSS/GlobalTimeTable.module.css'
import { FaPlus } from "react-icons/fa";
import { IoFolderOpenOutline } from "react-icons/io5";
import { ImFolderUpload } from "react-icons/im";
import { BsFiletypeXls } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";

function GlobalTimeTable() {
  const [showAddModal, setShowAddmodal]=useState(false)
  const [isEmpty, setIsEmpty]=useState(true)
  const [file, setFile] = useState(null);
const [fileURL, setFileURL] = useState("")
  const [fileName, setFileName] = useState(""); 
  const [timetables, setTimetables]=useState([])
  const fileInputRef = useRef(null);
  const[promo, setPromo]=useState("1CPI")
  const[semester, setSemester]=useState("Semester 1")
  const[section, setSection]=useState("1")
  const[showeditModal,setshowEditModal]=useState(false)
const [editingTimetable,setEditingTimetable]=useState(null)
const [deletingtimetable, setdeletingtimetable]=useState(null)
const [showdeleteModal, setshowDeleteModal]=useState(false)

function handleDelete(timetable) {
  setdeletingtimetable(timetable);
    setTimetables((prev)=>prev.filter((item)=>item.id!==timetable.id))
}

  const handleClick = () => {
    fileInputRef.current.click()
  }
  const handleFileChange =(event)=>{
    if (event.target.files.length >0){
      const uploadedFile = event.target.files[0];
      setFileName(uploadedFile.name) 
      setFile(uploadedFile)
      setFileURL(URL.createObjectURL(uploadedFile))
    }
  }

  const handleDownload=()=>{
    if (fileURL){
      const link = document.createElement("a")
      link.href = fileURL
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link);
    }
  };
  useEffect(() => {
    setIsEmpty(timetables.length=== 0)
  }, [timetables]);
  function addTimeTable(e) {
    e.preventDefault();
    setTimetables((prev) => {
      const updatedTimetables = [
        ...prev,
        { id: Date.now(), promo, semester, section, fileName }
      ];
      setShowAddmodal(false);
      setPromo("1CPI");
      setSemester("Semester 1");
      setSection("1");
      setFileName("");
      setshowEditModal(false);
      return updatedTimetables;
    });
  }
  
 

  function editTimeTable(e) {
    e.preventDefault()
  
    if (!editingTimetable) return;
  
    setTimetables(prev=>
      prev.map(item =>
        item.id===editingTimetable.id?{ ...item, promo, semester, section, fileName }:item))
    setEditingTimetable(null)
    setPromo("")
    setSemester("")
    setSection("")
    setFileName("")
    setshowEditModal(false)
  }
  
  

  useEffect(()=>{
    if (editingTimetable) {
      setPromo(editingTimetable.promo|| "");
      setSemester(editingTimetable.semester|| "");
      setSection(editingTimetable.section|| "");
      setFileName(editingTimetable.fileName|| "");
    }
  }, [editingTimetable])
  
  
  return (
    <>
              <Sidebar/>
<div className={styles.content}>
<h1>Global Timetables</h1>

      <div className={styles.description}>
      Upload and manage timetables for different academic years and semesters.
      </div>
      <div className={styles.addModalButton} onClick={()=>setShowAddmodal(true)}><FaPlus />
      Add timetable</div>

      {showAddModal&&(
        <div className={styles.addContainer}>
          <div className={styles.box}>
          <div onClick={()=> setShowAddmodal(false)} className={styles.closeicon}>
          <IoCloseSharp />
          </div>

            <h2>Upload a new TimeTable</h2>
            <form onSubmit={addTimeTable} action="">
            <div className={styles.promotions} >
              <label htmlFor="">Academic year</label> <br />
              <select name="promo" onChange={(e) => setPromo(e.target.value)} >
  <option value="1CPI">1CPI</option>
  <option value="2CPI">2CPI</option>
  <option value="1CS">1CS</option>
  <option value="2CS">2CS</option>
  <option value="3CS">3CS</option>
</select>

            </div>
            <div className={styles.semesters}>
              <label htmlFor="">Semester</label> <br />
              <select name="" id="" onChange={(e)=>setSemester(e.target.value)} >select
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
            <div className={styles.sections}>
              <label htmlFor="">Number of sections</label> <br />
              <input required onChange={(e)=>setSection(e.target.value)} type="number"   />
            </div>
      <div className={styles.upload}>
        <label htmlFor="">Upload a time table</label> <br /> <br />
      <div className={styles.uploadBox} onClick={handleClick}>
      <div className={styles.xlsicon}>
      <BsFiletypeXls />

      </div>
      <p>{fileName ||"Drag and drop or click to upload"}</p>
      <input ref={fileInputRef} required   onChange={handleFileChange}   className={styles.fileInput} type="file"/>
    </div>
      </div>
              <div className={styles.buttons}>
                <button type="submit" className={styles.uploadbutton}><div className={styles.uploadicon}><ImFolderUpload /></div><strong className={styles.text} >Upload</strong></button>
                <button  onClick={()=> setShowAddmodal(false)} className={styles.cancelbutton}><strong className={styles.textcancel}>Cancel</strong></button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showeditModal&&(
        <div className={styles.editcontainer}>
            <div className={styles.box}>
          <div onClick={()=> setshowEditModal(false)} className={styles.closeicon}>
          <IoCloseSharp />
          </div>

            <h2>Edit the  TimeTable</h2>
            <form onSubmit={editTimeTable} action="">
            <div className={styles.promotions} >
              <label htmlFor="">Academic year</label> <br />
              <select name="promo" value={promo} onChange={(e) => setPromo(e.target.value)} >
  <option value="1CPI">1CPI</option>
  <option value="2CPI">2CPI</option>
  <option value="1CS">1CS</option>
  <option value="2CS">2CS</option>
  <option value="3CS">3CS</option>
</select>

            </div>
            <div className={styles.semesters}>
              <label htmlFor="">Semester</label> <br />
              <select value={semester} name="" id="" onChange={(e)=>setSemester(e.target.value)} >select
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
            <div className={styles.sections}>
              <label htmlFor="">Number of sections</label> <br />
              <input value={section} onChange={(e)=>setSection(e.target.value)} type="number"  />
            </div>
      <div className={styles.upload}>
        <label htmlFor="">Upload a time table</label> <br /> <br />
      <div className={styles.uploadBox} onClick={handleClick}>
      <div className={styles.xlsicon}>
      <BsFiletypeXls />

      </div>
      <p>{fileName ||"Drag and drop or click to edit"}</p>
      <input ref={fileInputRef}   onChange={handleFileChange}  className={styles.fileInput} type="file"/>
    </div>
      </div>
              <div className={styles.buttons}>
                <button type="submit" className={styles.uploadbutton}><div className={styles.uploadicon}><ImFolderUpload /></div><strong className={styles.text} >Upload</strong></button>
                <button  onClick={()=> setshowEditModal(false)} className={styles.cancelbutton}><strong className={styles.textcancel}>Cancel</strong></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showdeleteModal&&(
        <div className={styles.deletecontainer}>
          <div className={styles.box}>
          <div onClick={()=> setshowDeleteModal(false)} className={styles.closeicon}>
          <IoCloseSharp />
          </div>
          <p>Are you sure you want to delete this, bitch?</p>
          </div>
        </div>
      )}


      {isEmpty?
      
      (<div className={styles.empty}>
        <div className={styles.foldericon}>
        <IoFolderOpenOutline />
        </div>
      <br />
        <strong>No Timetables uploaded yet</strong>
      </div>):
    
      
      (
      <div className={styles.timeTables}>
       <ul className={styles.list}>
    {timetables.map((timetable)=>(
    
        <li key={timetable.id}>
        <p><strong>{timetable.promo} - {timetable.semester}</strong></p>
        <p>Sections: {timetable.section}</p>
        <p>File: {timetable.fileName}</p>
        <div className={styles.buttons}>
          <button className={styles.editbutton} onClick={() => {
            setEditingTimetable(timetable); setshowEditModal(true)
          }}>
            <div><FaRegEdit/></div>Edit
          </button>

          <button className={styles.deletebutton} onClick={() => handleDelete(timetable)}>
            <div><MdDelete /></div><span>Delete</span>
          </button>

          <button className={styles.downloadbutton} onClick={handleDownload}>
            <div><AiOutlineDownload /></div><span>Download</span>
          </button>
        </div>
        </li>
    ))}
</ul>


      </div>)}
    </div>
    </>
    
);
    


}

export default GlobalTimeTable;
