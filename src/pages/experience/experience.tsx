import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceForm from './experienceForm';

const Experience = () => {
  const navigate = useNavigate();
  const redirectToSkills = () => {
    navigate('/study');
  };
  const redirectToReferences = () => {
    navigate('/references');
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='box1'>
          {' '}
          <i
            onClick={redirectToSkills}
            className='fa-solid fa-arrow-left arrow-right'
          ></i>
        </div>
        <div className='box2 signupCard'>
          <div className='signupForm'>
            <h1 className='signupTitle'>Work Experience</h1>
            <ExperienceForm />
          </div>
        </div>
        <div className='box3'>
          {' '}
          <i
            onClick={redirectToReferences}
            className='fa-solid fa-arrow-right arrow-right'
          ></i>
        </div>
      </div>
    </Fragment>
  );
};

export default Experience;
