import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/signup/signup';
import Skills from './pages/skills/skills';
import LoginMail from './pages/login/loginMail';
import Login from './pages/login/login';
import Study from './pages/study/study';
import Experience from './pages/experience/experience';
import References from './pages/references/references';
import ManageStudents from './pages/Student/manageStudents';
import ShowStudent from './pages/Student/showStudent';
import './pages/signup/signup.css';
function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/skills' element={<Skills />} />
          <Route path='/loginMail' element={<LoginMail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/study' element={<Study />} />
          <Route path='/experience' element={<Experience />} />
          <Route path='/references' element={<References />} />
          <Route path='/manageStudents' element={<ManageStudents />} />
          <Route path='/showStudent' element={<ShowStudent />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
