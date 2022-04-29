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
import LoginUser from "./User/auth/LoginUser";
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
            <Route path="/login" element={<LoginUser/>}/>
            <Route path="/admin/login" element={<LoginAdmin/>}/>
            <Route path="/admin/dashboard" element={<Dashboard/>}>
              <Route path="employees" index element={<Employees/>}/>
              <Route path="employee/:id" element={<Employee/>}/>
              <Route path="employee/add" exact elemet={<AddEmployee/>}/>
              <Route path="roles" element={<Roles/>}/>
              <Route path="role/:id" element={<Role/>}/>
              <Route path="role/add" exact element={<AddRole/>}/>
              <Route path="skills" element={<Skills/>}/>
              <Route path="skill/:id" element={<Skill/>}/>
              <Route path="skill/add" exact element={<AddSkill/>}/>
            </Route>
        </Routes>
      </Router>
      </AdminContext.Provider>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default App;
