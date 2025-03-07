

import React from "react";
import Dashboard from "./Dashbord";
import Sidebar from "./Sidebar";
import "../CSS/Sidebar.css"
function AdminPage(){
return(
<div className="adpage">
    <Sidebar/>
    <Dashboard/>
</div>);
};
export default AdminPage;



  