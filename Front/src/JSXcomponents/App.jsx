import '../CSS/App.css';
import Login from './Login';
import ForgotPass from './ForgotPass';
import ResetPass from './ResetPass';
import Redirect from './Redirect';
import AddTeacher from './AddTeacher';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './AdminPage';
import ManageAbsences from './ManageAbsences';
import GlobalTimeTable from './GlobalTimeTable';
import ManageTeachers from './ManageTeachers';
import Tableteacher from './Tableteacher';
import Settings from './settings';
import Settingscomponents from './settingscomponents';
import Settingscomp from './settingscomponents';

function App() { 
  return (
      <Routes>
        <Route path="/ForgotPass" element={< ForgotPass/>} />
        <Route path="/" element={<Login />} />
        <Route path='/ResetPass/:token' element={<ResetPass />}></Route>
        <Route path='/ResetPass/Redirect' element={<Redirect />}></Route>
        <Route path='/AddTeacher' element={<AddTeacher/>}></Route>
        <Route path='/adminpage' element={<AdminPage/>}></Route>
        <Route path='/adminpage/manage-absences' element={<ManageAbsences/>}></Route>
        <Route path='/adminpage/manage-teachers' element={<ManageTeachers/>}></Route>
        <Route path='/adminpage/global-timetable' element={<GlobalTimeTable/>}></Route>
        <Route path='/table' element={<Tableteacher/>}></Route>
        <Route path='/adminpage/settings' element={<Settings/>}></Route>
        <Route path='/adminpage/comp' element={<Settingscomp/>}></Route>
      </Routes>
  );
}

export default App;
