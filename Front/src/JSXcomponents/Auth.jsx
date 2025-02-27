import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export function AuthProvider({children}) {
  const [email, setEmail] = useState(null);
  const login = (email)=>{
    setEmail(email);};
  const logout = () => {
    setEmail(null);
  };




  return (
    <AuthContext.Provider value={{email,login,logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = ()=>{
  return useContext(AuthContext);};
