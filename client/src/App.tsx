import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import {CreateModule} from "./components/CreateModule"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/module' element={<CreateModule/>}/>
      </Routes>
    </Router>
  );
}

export default App;
