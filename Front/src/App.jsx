import './App.css';
import Login from './Login';
import ForgotPass from './ForgotPass';
import ResetPass from './ResetPass';
import Redirect from './Redirect';
import { AuthProvider } from './Auth';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';

function App() { 
  return (
    <AuthProvider>
      <Routes>
        <Route path="/ForgotPass" element={< ForgotPass/>} />
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path='/ResetPass' element={<ResetPass />}></Route>
        <Route path='/ResetPass/Redirect' element={<Redirect />}></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
