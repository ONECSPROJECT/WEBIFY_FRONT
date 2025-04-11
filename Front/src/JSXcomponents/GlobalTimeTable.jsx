import React, { useState } from "react";
import Sidebar from "./Sidebar";
import styles from '../CSS/GlobalTimeTable.module.css';
import ExcelImport from "./ExcelImport";
import FillInWebsite from "./FillInWebsite";

function GlobalTimeTable(){
  const [mode, setMode]=useState("excel")
  return (
    <>
      <Sidebar/>
      <div className={styles.content}>
        <div className={styles.options}>
          <label>choose input mode:</label>
          <select value={mode} className={styles.optionBox} onChange={(e) =>setMode(e.target.value)}>
            <option value="excel">excel import</option>
            <option value="manual">fill in manually</option>
          </select>
        </div>

        {mode ==="excel"&& <ExcelImport />}
        {mode==="manual" && <FillInWebsite />}
      </div>
    </>
  );
}

export default GlobalTimeTable;
