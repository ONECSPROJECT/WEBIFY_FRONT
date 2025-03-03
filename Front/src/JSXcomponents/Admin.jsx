import { createContext, useContext, useState } from "react";
import axios from "axios";
const AdminContext = createContext();

export function AdminProvider({children}) {
    const [adminInfo, setAdminInfo] = useState({});
    async function fetchAdminInfo() {
        try {
            const response =await axios.get("")
            setAdminInfo(response.data);}
            catch (error){
            console.error("Failed to fetch admin info:")}
  }
    return (
        <AdminContext.Provider value={{adminInfo,fetchAdminInfo}}>
            {children}
        </AdminContext.Provider>
  )
}
export function useAdmin(){
    return useContext(AdminContext)
}
