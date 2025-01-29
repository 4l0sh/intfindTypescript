import { Fragment } from 'react';
import StudentCard from './studentCard';
import './manageStudents.css';

const ManageStudents = () => {
  const logOut = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <Fragment>
      <div className='MainContainer container'>
        <div className='HeaderContainer'>
          <div className='headerButton'>
            <button onClick={logOut} className='logOutBtn'>
              <p className='btnTxt'>Log Out</p>
              <i className='fa-solid fa-right-from-bracket logout'></i>
            </button>
          </div>
          <h1 className='headerTitle'>Manage Students</h1>
          <div className='headerDiv3 GetInfo'></div>
        </div>
        <div className='mainCard'>
          <div className='SearchContainer'>
            <StudentCard />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ManageStudents;
