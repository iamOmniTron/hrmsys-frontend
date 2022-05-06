import "./App.css";
import { ChakraProvider } from '@chakra-ui/react'
import LoginAdmin from "./Admin/LoginAdmin";
import Dashboard from './Admin/dashboard';
import Employees from "./Admin/Employee/employees";
import Employee from "./Admin/Employee/employee";
import Roles from "./Admin/Role/roles";
import Role from "./Admin/Role/role";
import AddEmployee from "./Admin/Employee/add";
import AddRole from "./Admin/Role/add";
import AddSkill from "./Admin/Skill/add";
import Skills from "./Admin/Skill/skills";
import Skill from "./Admin/Skill/skill";
import Attendance from "./Admin/Attendance/attendance";
import Trainings from "./Admin/Training/trainings";
import AddTraining from "./Admin/Training/add";
import LoginUser from "./User/auth/LoginUser";
import Payroll from "./Admin/Payroll/payroll";
import Program from "./User/program/program"
import AddProgram from "./User/program/add";
import UserDashboard from "./User/dashboard";
import Session from "./User/session/session";
import Profile from "./User/profile";
// import Cam from "./User/auth/test";

import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import AuthContext from "./contexts/auth";
import AdminContext from "./contexts/admin";
import {useState} from "react";

function App() {
  const [token,setToken] = useState('');
  const [isAdmin,setIsAdmin] = useState(false);
  return (
    <ChakraProvider>
      <AuthContext.Provider value={[token,setToken]}>
        <AdminContext.Provider value={[isAdmin,setIsAdmin]}>
      <Router>
        <Routes>
            {/* <Route path="/" element={<Cam/>}/> */}
            <Route path="/login" element={<LoginUser/>}/>
            <Route path="/user/dashboard" element={<UserDashboard/>}>
              <Route path="programs" element={<Program/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="attendance" element={<Session/>}/>
              <Route path="program/add" element={<AddProgram/>}/>
            </Route>
            <Route path="/admin/login" element={<LoginAdmin/>}/>
            <Route path="/admin/dashboard" element={<Dashboard/>}>
              <Route path="employees" index element={<Employees/>}/>
              <Route path="employee/:id" element={<Employee/>}/>
              <Route path="employee/add" exact element={<AddEmployee/>}/>
              <Route path="roles" element={<Roles/>}/>
              <Route path="role/:id" element={<Role/>}/>
              <Route path="role/add" exact element={<AddRole/>}/>
              <Route path="skills" element={<Skills/>}/>
              <Route path="skill/:id" element={<Skill/>}/>
              <Route path="skill/add" exact element={<AddSkill/>}/>
              <Route path="attendance" element={<Attendance/>}/>
              <Route path="payroll" element={<Payroll/>}/>
              <Route path="trainings" element={<Trainings/>} />
              <Route path="trainings/add" element={<AddTraining/>}/>
            </Route>
        </Routes>
      </Router>
      </AdminContext.Provider>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default App;
