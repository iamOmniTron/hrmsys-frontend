import { ChakraProvider } from '@chakra-ui/react'
import LoginAdmin from "./Admin/LoginAdmin";
import Dashboard from './Admin/dashboard';
import Employees from "./Admin/Employee/employees";
import Employee from "./Admin/Employee/employee";
import Roles from "./Admin/Role/roles";
import Role from "./Admin/Role/role";
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
            <Route path="/admin/login" element={<LoginAdmin/>}/>
            <Route path="/admin/dashboard" element={<Dashboard/>}>
              <Route path="employees" index element={<Employees/>}/>
              <Route path="employee/:id" element={<Employee/>}/>
              <Route path="roles" element={<Roles/>}/>
              <Route path="role/:id" element={<Role/>}/>
            </Route>
        </Routes>
      </Router>
      </AdminContext.Provider>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default App;
